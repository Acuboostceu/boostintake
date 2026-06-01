const express = require('express')
const { requireAuth, requireSubscription } = require('../middleware/auth')
const { supabase } = require('../services/supabase')
const router = express.Router()

const PHOTO_TYPE_LABELS = {
  before_after: 'before and after treatment results',
  process: 'treatment process or procedure video/reel',
  review: 'patient review or testimonial',
  health_tip: 'health tips, education, or wellness information',
  promo: 'promotion, special offer, or upcoming event',
  quote: 'inspiring health and wellness quote',
}

const TONE_LABELS = {
  professional: 'professional and trustworthy — like an expert sharing valuable knowledge',
  friendly: 'warm and friendly — like a caring friend who happens to be a health expert',
}

const FOCUS_AREAS = {
  acupuncture: {
    areas: [
      { id: 'pain_mgmt', en: 'pain management' },
      { id: 'fertility', en: 'fertility and women\'s health' },
      { id: 'digestive', en: 'digestive health' },
      { id: 'sleep', en: 'sleep disorders' },
      { id: 'stress', en: 'stress and anxiety' },
      { id: 'cosmetic', en: 'cosmetic acupuncture' },
    ],
  },
  chiropractic: {
    areas: [
      { id: 'disc', en: 'back and neck disc issues' },
      { id: 'posture', en: 'posture correction' },
      { id: 'sports_injury', en: 'sports injuries' },
      { id: 'headache', en: 'headaches and migraines' },
      { id: 'postpartum', en: 'postpartum chiropractic' },
      { id: 'pediatric', en: 'pediatric chiropractic' },
    ],
  },
  massage: {
    areas: [
      { id: 'deep_tissue', en: 'deep tissue massage' },
      { id: 'prenatal', en: 'prenatal massage' },
      { id: 'sports_massage', en: 'sports massage' },
      { id: 'relaxation', en: 'relaxation massage' },
      { id: 'lymphatic', en: 'lymphatic drainage' },
      { id: 'hot_stone', en: 'hot stone massage' },
    ],
  },
}

// GET /api/social/settings — load social settings
router.get('/settings', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('clinics')
    .select('social_settings')
    .eq('id', req.user.clinicId)
    .single()
  res.json(data?.social_settings || null)
})

// POST /api/social/settings — save social settings
router.post('/settings', requireAuth, async (req, res) => {
  const { focusAreas, tone } = req.body
  const { error } = await supabase
    .from('clinics')
    .update({ social_settings: { focusAreas, tone: tone || 'friendly' } })
    .eq('id', req.user.clinicId)
  if (error) return res.status(500).json({ message: 'Failed to save' })
  res.json({ ok: true })
})

// GET /api/social/nudge — AI-generated post idea based on clinic specialty
router.get('/nudge', requireAuth, requireSubscription, async (req, res) => {
  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, specialty, social_settings')
    .eq('id', req.user.clinicId)
    .single()

  const specialty = clinic?.specialty || 'acupuncture'
  const focusAreaIds = clinic?.social_settings?.focusAreas || []
  const focusHint = focusAreaIds.length > 0
    ? `The clinic specializes in: ${focusAreaIds.map(id => {
        for (const spec of Object.values(FOCUS_AREAS)) {
          const a = spec.areas.find(a => a.id === id)
          if (a) return a.en
        }
        return id
      }).filter(Boolean).join(', ')}.`
    : `General ${specialty} clinic.`

  const prompt = `You are a social media coach for a ${specialty} clinic called "${clinic?.name || 'the clinic'}".
${focusHint}

Generate ONE specific, actionable Instagram post idea for this clinic. It should be fresh, creative, and directly relevant to the specialty.
- One sentence only
- Be specific (not generic like "share a tip")
- Make it something a busy clinic owner can act on today
- Do NOT include hashtags
- Output ONLY the idea text, nothing else`

  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set')

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 1.0,
        max_tokens: 80,
      }),
    })
    const json = await apiRes.json()
    const idea = json.choices?.[0]?.message?.content?.trim()
    if (!idea) throw new Error('Empty response')
    res.json({ idea })
  } catch (err) {
    console.error('[social/nudge] error:', err.message)
    res.status(500).json({ message: 'Failed to generate idea' })
  }
})

router.post('/caption', requireAuth, requireSubscription, async (req, res) => {
  const { photoTypes, keywords, tone: bodyTone } = req.body

  if (!photoTypes?.length) {
    return res.status(400).json({ message: 'Photo type is required' })
  }

  // Get clinic info for personalization
  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, address, specialty, social_settings')
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

  // Get focus areas for personalized prompt
  const focusAreaIds = clinic?.social_settings?.focusAreas || []
  const tone = bodyTone || clinic?.social_settings?.tone || 'friendly'
  const focusHint = focusAreaIds.length > 0
    ? `\nThis clinic specializes in: ${focusAreaIds.map(id => {
        for (const spec of Object.values(FOCUS_AREAS)) {
          const a = spec.areas.find(a => a.id === id)
          if (a) return a.en
        }
        return id
      }).filter(Boolean).join(', ')}.`
    : ''

  const photoDesc = photoTypes
    .map((t) => PHOTO_TYPE_LABELS[t] || t)
    .join(' and ')

  const toneDesc = TONE_LABELS[tone] || tone

  const locationHint = city ? ` in ${city}` : ''
  const keywordHint = keywords?.trim() ? `The caption should naturally weave in these themes: ${keywords}.` : ''

  const prompt = `You are a social media expert for a ${specialty} clinic called "${clinicName}"${locationHint}.${focusHint}

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
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set in environment')

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 400,
      }),
    })
    const json = await apiRes.json()
    if (!apiRes.ok) {
      console.error('[social/caption] OpenAI HTTP', apiRes.status, JSON.stringify(json))
      throw new Error(json.error?.message || `OpenAI API error ${apiRes.status}`)
    }
    const caption = json.choices?.[0]?.message?.content?.trim()
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
