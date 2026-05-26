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
    .select('name, address, phone, emails, cancel_hours, no_show_fee, check_fee, pin_hash, logo_url, sms_template')
    .eq('id', req.user.clinicId)
    .single()

  if (error) return res.status(500).json({ message: 'Failed to load settings' })
  res.json(data)
})

router.post('/settings', requireAuth, upload.single('logo'), async (req, res) => {
  const { clinicName, address, phone, emails, cancelHours, noShowFee, checkFee, pin, smsTemplate } = req.body

  let logoUrl
  if (req.file) {
    logoUrl = await uploadLogo(req.user.clinicId, req.file)
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
  res.json({ ok: true })
})

module.exports = router
