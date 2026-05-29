const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { supabase } = require('../services/supabase')
const router = express.Router()

const PHOTO_TYPE_LABELS = {
  treatment: 'acupuncture/chiropractic treatment or procedure',
  clinic: 'clinic interior or ambiance',
  health: 'health tips, herbs, or wellness information',
  review: 'patient review or testimonial',
}

const TONE_LABELS = {
  professional: 'professional and trustworthy — like an expert sharing valuable knowledge',
  friendly: 'warm and friendly — like a caring friend who happens to be a health expert',
}

// Temporary: list available Gemini models for this API key
router.get('/models', requireAuth, async (req, res) => {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`)
  const json = await r.json()
  res.json(json)
})

router.post('/caption', requireAuth, async (req, res) => {
  const { photoTypes, keywords, tone } = req.body

  if (!photoTypes?.length || !tone) {
    return res.status(400).json({ message: 'Photo type and tone are required' })
  }

  // Get clinic info for personalization
  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, address, specialty')
    .eq('id', req.user.clinicId)
    .single()

  const clinicName = clinic?.name || 'our clinic'
  const specialty = clinic?.specialty === 'chiropractic' ? 'chiropractic' : 'acupuncture'

  // Extract city from address (best effort)
  let city = ''
  if (clinic?.address) {
    const parts = clinic.address.split(',')
    if (parts.length >= 2) city = parts[parts.length - 2].trim()
  }

  const photoDesc = photoTypes
    .map((t) => PHOTO_TYPE_LABELS[t] || t)
    .join(' and ')

  const toneDesc = TONE_LABELS[tone] || tone

  const locationHint = city ? ` in ${city}` : ''
  const keywordHint = keywords?.trim() ? `The caption should naturally weave in these themes: ${keywords}.` : ''

  const prompt = `You are a social media expert for a ${specialty} clinic called "${clinicName}"${locationHint}.

Write a compelling Instagram caption for a photo showing: ${photoDesc}.
${keywordHint}

Tone: ${toneDesc}.

Requirements:
- 3–5 sentences of engaging caption text
- Naturally mention the clinic name "${clinicName}" once
- ${city ? `Include "${city}" in a natural way` : 'Include a subtle location reference if natural'}
- End with 8–12 relevant hashtags on a new line
- Hashtags should mix: specialty-specific (#acupuncture or #chiropractic), health/wellness, location (if city known), and clinic-branded
- Write in English only
- Do NOT use quotation marks around the caption
- Output ONLY the caption text and hashtags, nothing else`

  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in environment')

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const json = await apiRes.json()
    if (!apiRes.ok) {
      console.error('[social/caption] Gemini HTTP', apiRes.status, JSON.stringify(json))
      throw new Error(json.error?.message || `Gemini API error ${apiRes.status}`)
    }
    const caption = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!caption) {
      console.error('[social/caption] empty response:', JSON.stringify(json))
      throw new Error('Empty response from AI')
    }

    res.json({ caption })
  } catch (err) {
    console.error('[social/caption] error:', err.message)
    res.status(500).json({ message: err.message || 'Failed to generate caption. Please try again.' })
  }
})

module.exports = router
