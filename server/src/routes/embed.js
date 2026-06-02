const express = require('express')
const jwt = require('jsonwebtoken')
const { supabase } = require('../services/supabase')

const router = express.Router()

// GET /api/embed/ping — connectivity test
router.get('/ping', async (req, res) => {
  const clinicId = process.env.BOOSTINTAKE_CLINIC_ID
  const { data, error } = await supabase.from('clinics').select('id, name').eq('id', clinicId).single()
  res.json({
    ok: true,
    secret: !!process.env.EMBED_SECRET,
    clinicId,
    clinicFound: !!data,
    clinicName: data?.name || null,
    supabaseError: error?.message || null,
  })
})

// POST /api/embed/verify
// Called by EmbedSend / EmbedTablet on mount to exchange EHR token → BoostIntake session
router.post('/verify', async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ message: 'Token required' })

  let payload
  try {
    payload = jwt.verify(token, process.env.EMBED_SECRET)
  } catch (e) {
    console.error('[embed/verify] JWT error:', e.message, '| secret set:', !!process.env.EMBED_SECRET, '| token prefix:', token.slice(0, 20))
    return res.status(401).json({ message: 'Invalid or expired embed token', detail: e.message })
  }

  const clinicId = String(payload.clinicId || '').trim()
  console.log('[embed/verify] clinicId from JWT:', JSON.stringify(clinicId))

  const { data: clinic, error } = await supabase
    .from('clinics')
    .select('id, name, email, sms_template, phone_number, locations, subscription_status, trial_ends_at')
    .eq('id', clinicId)
    .single()

  console.log('[embed/verify] Supabase result — clinic:', clinic?.id, '| error:', error?.message, '| code:', error?.code)

  if (error || !clinic) return res.status(404).json({ message: 'Clinic not found', debug: { clinicId, supabaseError: error?.message } })

  // Issue a short-lived BoostIntake session token (embed-scoped, 2h)
  const biToken = jwt.sign(
    { clinicId: clinic.id, email: clinic.email, embed: true },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  )

  res.json({
    token: biToken,
    clinic: {
      id: clinic.id,
      name: clinic.name,
      smsTemplate: clinic.sms_template,
      phone: clinic.phone_number,
      locations: clinic.locations || [],
    },
    patient: payload.patient || null,
    action: payload.action,
  })
})

module.exports = router
