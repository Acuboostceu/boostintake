const express = require('express')
const { requireAuth, requireSubscription } = require('../middleware/auth')
const { supabase } = require('../services/supabase')

const router = express.Router()

// Get clinic's enabled forms + custom forms
router.get('/', requireAuth, async (req, res) => {
  const [{ data: enabled }, { data: custom }] = await Promise.all([
    supabase.from('clinic_forms').select('*').eq('clinic_id', req.user.clinicId).order('sort_order'),
    supabase.from('custom_forms').select('*').eq('clinic_id', req.user.clinicId).order('created_at'),
  ])
  res.json({ enabled: enabled || [], custom: custom || [] })
})

// Save enabled forms selection
router.post('/selection', requireAuth, requireSubscription, async (req, res) => {
  const { formIds } = req.body // array of form_id strings in order
  if (!Array.isArray(formIds)) return res.status(400).json({ message: 'formIds must be an array' })

  // Upsert all selected forms
  const rows = formIds.map((form_id, i) => ({
    clinic_id: req.user.clinicId,
    form_id,
    enabled: true,
    sort_order: i,
  }))

  // Delete existing and re-insert
  await supabase.from('clinic_forms').delete().eq('clinic_id', req.user.clinicId)
  if (rows.length > 0) {
    const { error } = await supabase.from('clinic_forms').insert(rows)
    if (error) { console.error(error); return res.status(500).json({ message: 'Failed to save' }) }
  }

  res.json({ ok: true })
})

// Create custom form
router.post('/custom', requireAuth, requireSubscription, async (req, res) => {
  const { title, sections, requiresSignature, signatureLabel } = req.body
  if (!title) return res.status(400).json({ message: 'Title required' })

  const { data, error } = await supabase.from('custom_forms').insert({
    clinic_id: req.user.clinicId,
    title,
    sections: sections || [],
    requires_signature: !!requiresSignature,
    signature_label: signatureLabel || 'Signature',
  }).select('*').single()

  if (error) { console.error(error); return res.status(500).json({ message: 'Failed to create' }) }
  res.status(201).json(data)
})

// Update custom form
router.put('/custom/:id', requireAuth, async (req, res) => {
  const { title, sections, requiresSignature, signatureLabel } = req.body

  const { error } = await supabase.from('custom_forms')
    .update({
      title,
      sections: sections || [],
      requires_signature: !!requiresSignature,
      signature_label: signatureLabel || 'Signature',
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .eq('clinic_id', req.user.clinicId)

  if (error) { console.error(error); return res.status(500).json({ message: 'Failed to update' }) }
  res.json({ ok: true })
})

// Delete custom form
router.delete('/custom/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const clinicId = req.user.clinicId

  // Remove from enabled list first (avoid FK constraint issues)
  await supabase.from('clinic_forms')
    .delete()
    .eq('clinic_id', clinicId)
    .eq('form_id', id)

  const { error } = await supabase.from('custom_forms')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId)

  if (error) { console.error(error); return res.status(500).json({ message: 'Failed to delete' }) }
  res.json({ ok: true })
})

module.exports = router
