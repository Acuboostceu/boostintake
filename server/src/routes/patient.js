const express = require('express')
const { randomBytes } = require('crypto')
const nanoid = (size = 10) => randomBytes(size).toString('base64url').slice(0, size)
const { requireAuth } = require('../middleware/auth')
const { supabase } = require('../services/supabase')
const { sendSMS } = require('../services/sms')
const { generatePDF } = require('../services/pdf')
const { sendEmail } = require('../services/email')

const router = express.Router()

// Staff sends intake link to patient
router.post('/send-link', requireAuth, async (req, res) => {
  const { firstName, lastName, phone, dob, customMessage } = req.body
  if (!firstName || !lastName || !phone || !dob) {
    return res.status(400).json({ message: 'All fields required' })
  }

  const token = nanoid(10)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  // Store token with patient identity for verification
  const { error } = await supabase.from('intake_tokens').insert({
    token,
    clinic_id: req.user.clinicId,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    dob,
    phone: phone.replace(/\D/g, ''),
    expires_at: expiresAt,
    used: false,
  })

  if (error) return res.status(500).json({ message: 'Failed to create link' })

  const link = `${process.env.APP_URL}/p/${token}`

  // Get clinic info for SMS fallback
  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, sms_template')
    .eq('id', req.user.clinicId)
    .single()

  // Build SMS body — always replace {link} on server since token is generated here
  const rawTemplate = customMessage
    || clinic?.sms_template
    || 'Hi {firstName}! This is {clinicName}. Please complete your intake forms before your appointment: {link}'

  const smsBody = rawTemplate
    .replace('{firstName}', firstName)
    .replace('{clinicName}', clinic?.name || 'your clinic')
    .replace('{link}', link)

  await sendSMS(phone.replace(/\D/g, ''), smsBody)

  res.json({ link, phone: phone.replace(/\D/g, '') })
})

// Patient verifies identity before accessing forms
router.post('/verify', async (req, res) => {
  const { token, firstName, lastName, dob } = req.body
  if (!token || !firstName || !lastName || !dob) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const { data: record, error } = await supabase
    .from('intake_tokens')
    .select('*, clinics(name, address, phone, logo_url, cancel_hours, no_show_fee)')
    .eq('token', token)
    .single()

  if (error || !record) return res.status(404).json({ message: 'Invalid or expired link' })
  if (record.used) return res.status(410).json({ message: 'This intake link has already been used' })
  if (new Date(record.expires_at) < new Date()) {
    return res.status(410).json({ message: 'This link has expired. Please contact the clinic for a new link.' })
  }

  const nameMatch =
    record.first_name.toLowerCase() === firstName.trim().toLowerCase() &&
    record.last_name.toLowerCase() === lastName.trim().toLowerCase()
  const dobMatch = record.dob === dob

  if (!nameMatch || !dobMatch) {
    return res.status(401).json({ message: 'Name or date of birth does not match our records.' })
  }

  const clinic = record.clinics
  res.json({
    ok: true,
    clinic: {
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      logoUrl: clinic.logo_url,
      cancelHours: clinic.cancel_hours,
      noShowFee: clinic.no_show_fee,
    },
  })
})

// Patient submits completed forms
router.post('/submit', async (req, res) => {
  const { token, patient, formData, signatures, declinedForms, clinicId, formContents, formFields } = req.body

  // For non-tablet mode, validate token and mark used
  let clinic = null
  if (token !== 'tablet') {
    const { data: record, error } = await supabase
      .from('intake_tokens')
      .select('*, clinics(*)')
      .eq('token', token)
      .single()

    if (error || !record || record.used) {
      return res.status(400).json({ message: 'Invalid submission token' })
    }

    clinic = record.clinics
    await supabase.from('intake_tokens').update({ used: true }).eq('token', token)
  } else {
    // Tablet mode: look up clinic by ID sent from client
    console.log('[submit] tablet mode, clinicId:', clinicId)
    if (!clinicId) return res.status(400).json({ message: 'Missing clinic ID for tablet submission' })

    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single()

    if (error || !data) {
      console.log('[submit] clinic not found:', error)
      return res.status(400).json({ message: 'Clinic not found' })
    }
    clinic = data
  }

  console.log('[submit] clinic:', clinic?.name, '| emails:', clinic?.emails)

  try {
    console.log('[submit] generating PDF...')
    const pdfBuffer = await generatePDF({ patient, formData, signatures, declinedForms, clinic, formContents, formFields })
    console.log('[submit] PDF generated, size:', pdfBuffer?.length)

    const safeName = patient.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    const dobStr = patient.dob.replace(/[-\/]/g, '')
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const filename = `${safeName}_${dobStr}_${dateStr}.pdf`

    const emails = clinic.emails || []
    console.log('[submit] sending email to:', emails)
    if (emails.length > 0) {
      await sendEmail({
        to: emails,
        subject: `Intake Forms: ${patient.name} — ${new Date().toLocaleDateString()}`,
        text: `Please find the attached intake forms for ${patient.name}.`,
        attachments: [{ filename, content: pdfBuffer, contentType: 'application/pdf' }],
      })
    }

    await supabase.from('submission_logs').insert({
      clinic_id: clinic.id,
      submitted_at: new Date().toISOString(),
      email_sent: emails.length > 0,
      source: token === 'tablet' ? 'tablet' : 'link',
      patient_name: patient.name || null,
    })

    console.log('[submit] done ✓')
    res.json({ ok: true })
  } catch (err) {
    console.error('[submit] error:', err)
    res.status(500).json({ message: 'Failed to process submission' })
  }
})

module.exports = router
