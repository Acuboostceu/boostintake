const express = require('express')
const { randomBytes } = require('crypto')
const nanoid = (size = 10) => randomBytes(size).toString('base64url').slice(0, size)
const { requireAuth, requireSubscription } = require('../middleware/auth')
const { supabase } = require('../services/supabase')
const { sendSMS } = require('../services/sms')
const { generatePDF } = require('../services/pdf')
const { sendEmail } = require('../services/email')

const router = express.Router()

// Get clinic branding from token (public — no PHI exposed)
router.get('/clinic-info/:token', async (req, res) => {
  const { data, error } = await supabase
    .from('intake_tokens')
    .select('location_name, clinics(name, logo_url)')
    .eq('token', req.params.token)
    .single()

  if (error || !data) return res.status(404).json({ message: 'Not found' })
  const clinic = data.clinics
  res.json({ clinicName: data.location_name || clinic?.name || null, logoUrl: clinic?.logo_url || null })
})

// Staff sends intake link to patient
router.post('/send-link', requireAuth, requireSubscription, async (req, res) => {
  const { firstName, lastName, phone, dob, customMessage, formIds, locationName, locationAddress, ehrPatientId } = req.body
  if (!firstName || !lastName || !phone || !dob) {
    return res.status(400).json({ message: 'All fields required' })
  }

  const token = nanoid(10)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  // NOTE: the intake_tokens table needs a form_ids jsonb column:
  //   ALTER TABLE intake_tokens ADD COLUMN form_ids jsonb;

  const { error } = await supabase.from('intake_tokens').insert({
    token,
    clinic_id: req.user.clinicId,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    dob,
    phone: phone.replace(/\D/g, ''),
    expires_at: expiresAt,
    used: false,
    ...(formIds && formIds.length > 0 ? { form_ids: formIds } : {}),
    ...(locationName ? { location_name: locationName } : {}),
    ...(locationAddress ? { location_address: locationAddress } : {}),
    ...(ehrPatientId ? { ehr_patient_id: String(ehrPatientId) } : {}),
  })

  if (error) {
    console.error('[send-link] insert error:', error)
    return res.status(500).json({ message: 'Failed to create link' })
  }

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

  try {
    await sendSMS(phone.replace(/\D/g, ''), smsBody)
  } catch (smsErr) {
    console.error('[send-link] SMS failed:', smsErr?.message)
  }

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
    .select('*, clinics(name, address, phone, logo_url, cancel_hours, no_show_fee, specialty)')
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
      name: record.location_name || clinic.name,
      address: record.location_address || clinic.address,
      phone: clinic.phone,
      logoUrl: clinic.logo_url,
      cancelHours: clinic.cancel_hours,
      noShowFee: clinic.no_show_fee,
      specialty: clinic.specialty || 'acupuncture',
    },
    formIds: record.form_ids || null,
  })
})

// Patient submits completed forms
router.post('/submit', async (req, res) => {
  const { token, patient, formData, signatures, declinedForms, clinicId, locationName, locationAddress, formContents, formFields, ehrPatientId } = req.body

  // For non-tablet mode, validate token and mark used
  let clinic = null
  let resolvedEhrPatientId = ehrPatientId || null
  if (token !== 'tablet') {
    const { data: record, error } = await supabase
      .from('intake_tokens')
      .select('*, clinics(*)')
      .eq('token', token)
      .single()

    if (error || !record || record.used) {
      return res.status(400).json({ message: 'Invalid submission token' })
    }

    clinic = { ...record.clinics }
    // Override with selected location if set
    if (record.location_name) clinic.name = record.location_name
    if (record.location_address) clinic.address = record.location_address
    // Use ehrPatientId stored at send-link time if not sent directly
    if (!resolvedEhrPatientId && record.ehr_patient_id) resolvedEhrPatientId = record.ehr_patient_id
    await supabase.from('intake_tokens').update({ used: true }).eq('token', token)
  } else {
    // Tablet mode: look up clinic by ID sent from client
    if (!clinicId) return res.status(400).json({ message: 'Missing clinic ID for tablet submission' })

    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single()

    if (error || !data) {
      return res.status(400).json({ message: 'Clinic not found' })
    }
    clinic = { ...data }
    // Override with selected location if set (tablet mode)
    if (locationName) clinic.name = locationName
    if (locationAddress) clinic.address = locationAddress
  }

  try {
    const pdfBuffer = await generatePDF({ patient, formData, signatures, declinedForms, clinic, formContents, formFields })

    const safeName = patient.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    const dobStr = patient.dob.replace(/[-\/]/g, '')
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const filename = `${safeName}_${dobStr}_${dateStr}.pdf`

    const emails = clinic.emails || []
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

    // Auto-save PDF to Glow EHR patient files if ehrPatientId is known
    console.log('[submit] resolvedEhrPatientId:', resolvedEhrPatientId, '| EHR_URL set:', !!process.env.EHR_URL, '| EMBED_SECRET set:', !!process.env.EMBED_SECRET)
    if (resolvedEhrPatientId && process.env.EHR_URL && process.env.EMBED_SECRET) {
      try {
        const webhookRes = await fetch(`${process.env.EHR_URL.replace(/\/$/, '')}/api/webhook/intake-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: process.env.EMBED_SECRET,
            patientId: resolvedEhrPatientId,
            filename,
            pdf: pdfBuffer.toString('base64'),
          }),
        })
        if (!webhookRes.ok) {
          const msg = await webhookRes.text()
          console.error('[submit] EHR webhook failed:', webhookRes.status, msg)
        } else {
          console.log('[submit] PDF saved to EHR for patient', resolvedEhrPatientId)
        }
      } catch (webhookErr) {
        console.error('[submit] EHR webhook error:', webhookErr.message)
      }
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('[submit] error:', err)
    res.status(500).json({ message: 'Failed to process submission' })
  }
})

module.exports = router
