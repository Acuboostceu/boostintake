const express = require('express')
const multer = require('multer')
const { requireAuth } = require('../middleware/auth')
const { supabase } = require('../services/supabase')
const { uploadLogo } = require('../services/storage')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// Tablet PIN verification — no auth required (clinic_id comes from localStorage)
router.post('/tablet-verify-pin', async (req, res) => {
  const { clinicId, pin } = req.body
  if (!clinicId || !pin) return res.status(400).json({ ok: false })

  const { data, error } = await supabase
    .from('clinics')
    .select('pin_hash')
    .eq('id', clinicId)
    .single()

  if (error || !data?.pin_hash) return res.json({ ok: false })

  const bcrypt = require('bcryptjs')
  const match = await bcrypt.compare(pin, data.pin_hash)
  res.json({ ok: match })
})

router.get('/settings', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('clinics')
    .select('name, address, phone, emails, cancel_hours, no_show_fee, check_fee, pin_hash, logo_url, sms_template, specialty, locations')
    .eq('id', req.user.clinicId)
    .single()

  if (error) return res.status(500).json({ message: 'Failed to load settings' })
  res.json(data)
})

router.post('/settings', requireAuth, upload.single('logo'), async (req, res) => {
  const { clinicName, address, phone, emails, cancelHours, noShowFee, checkFee, pin, smsTemplate, specialty, locations } = req.body

  let logoUrl
  if (req.file) {
    try {
      logoUrl = await uploadLogo(req.user.clinicId, req.file)
    } catch (err) {
      console.error('[settings] logo upload failed:', err.message)
      return res.status(500).json({ message: 'Logo upload failed' })
    }
  }

  const updates = {
    name: clinicName,
    address,
    phone,
    emails: JSON.parse(emails || '[]'),
    cancel_hours: parseInt(cancelHours),
    no_show_fee: parseInt(noShowFee),
    check_fee: parseInt(checkFee) || 35,
    sms_template: smsTemplate || null,
    specialty: specialty || 'acupuncture',
    locations: locations ? JSON.parse(locations) : [],
    updated_at: new Date().toISOString(),
  }

  if (pin) {
    const bcrypt = require('bcryptjs')
    updates.pin_hash = await bcrypt.hash(pin, 10)
  }

  if (logoUrl) updates.logo_url = logoUrl

  const { error } = await supabase
    .from('clinics')
    .update(updates)
    .eq('id', req.user.clinicId)

  if (error) {
    console.error('Save settings error:', error)
    return res.status(500).json({ message: 'Failed to save settings' })
  }
  res.json({ ok: true, logoUrl: logoUrl || null })
})

// Stats: sent + completed counts
router.get('/stats', requireAuth, async (req, res) => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [sentToday, sentWeek, sentMonth, completedToday, completedWeek, completedMonth] = await Promise.all([
    supabase.from('intake_tokens').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('created_at', todayStart),
    supabase.from('intake_tokens').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('created_at', weekStart),
    supabase.from('intake_tokens').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('created_at', monthStart),
    supabase.from('submission_logs').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('submitted_at', todayStart),
    supabase.from('submission_logs').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('submitted_at', weekStart),
    supabase.from('submission_logs').select('id', { count: 'exact', head: true }).eq('clinic_id', req.user.clinicId).gte('submitted_at', monthStart),
  ])

  res.json({
    sent: { today: sentToday.count || 0, week: sentWeek.count || 0, month: sentMonth.count || 0 },
    completed: { today: completedToday.count || 0, week: completedWeek.count || 0, month: completedMonth.count || 0 },
  })
})

// List: sent or completed
router.get('/list/:type', requireAuth, async (req, res) => {
  const { type } = req.params
  const { range = 'today' } = req.query

  const now = new Date()
  const starts = {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    week: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    month: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  }
  const start = starts[range] || starts.today

  if (type === 'sent') {
    const { data } = await supabase
      .from('intake_tokens')
      .select('first_name, last_name, created_at, used')
      .eq('clinic_id', req.user.clinicId)
      .gte('created_at', start)
      .order('created_at', { ascending: false })

    return res.json(data || [])
  }

  if (type === 'completed') {
    const { data } = await supabase
      .from('submission_logs')
      .select('patient_name, submitted_at, source, email_sent')
      .eq('clinic_id', req.user.clinicId)
      .gte('submitted_at', start)
      .order('submitted_at', { ascending: false })

    return res.json(data || [])
  }

  res.status(400).json({ message: 'Invalid type' })
})

module.exports = router
