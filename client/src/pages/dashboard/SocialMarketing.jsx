import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { FOCUS_AREAS } from './SocialSetup'

const PHOTO_TYPES = [
  { id: 'before_after', label: 'Before & After', emoji: '📷', sub: 'Treatment results and transformations' },
  { id: 'process', label: 'Treatment Process', emoji: '🎥', sub: 'Procedure video or reel' },
  { id: 'review', label: 'Patient Review', emoji: '💬', sub: 'Testimonials and success stories' },
  { id: 'health_tip', label: 'Health Tip / Education', emoji: '📚', sub: 'Wellness info, herbs, education' },
  { id: 'promo', label: 'Promotion / Event', emoji: '🎉', sub: 'Special offers and upcoming events' },
  { id: 'quote', label: 'Quote of the Day', emoji: '🌿', sub: 'Inspiring health & wellness quotes' },
]

const TONES = [
  { id: 'professional', label: 'Professional & Trustworthy', sub: 'Expert, informative, confident' },
  { id: 'friendly', label: 'Warm & Friendly', sub: 'Approachable, caring, conversational' },
]

const NUDGE_IDEAS = {
  pain_mgmt: ['Share how acupuncture helps relieve chronic back pain', 'Post a patient success story about pain relief'],
  fertility: ['Educate your audience on acupuncture and women\'s health', 'Share a fertility treatment success story'],
  digestive: ['Post about acupuncture points that support digestive health', 'Share tips for managing bloating naturally'],
  sleep: ['Share natural remedies for insomnia with acupuncture', 'Post about how acupuncture regulates sleep cycles'],
  stress: ['Explain how acupuncture reduces cortisol and stress', 'Share a relaxation tip for busy professionals'],
  cosmetic: ['Debunk myths about facial acupuncture', 'Show before & after results of cosmetic acupuncture'],
  disc: ['Share daily habits that protect your spine', 'Post about how chiropractic helps herniated discs'],
  posture: ['Share posture tips for remote workers', 'Post about the effects of poor posture on long-term health'],
  sports_injury: ['Show how chiropractic speeds up sports recovery', 'Post about common sports injuries you treat'],
  headache: ['Explain the link between neck alignment and headaches', 'Share natural headache relief tips'],
  postpartum: ['Explain how chiropractic helps postpartum recovery', 'Share tips for new moms on back pain relief'],
  pediatric: ['Share the benefits of chiropractic for kids\' development', 'Post about safe pediatric adjustments'],
  deep_tissue: ['Explain the benefits of deep tissue massage for muscle recovery', 'Share who benefits most from deep tissue work'],
  prenatal: ['Reassure expecting moms about the safety of prenatal massage', 'Share top benefits of massage during pregnancy'],
  sports_massage: ['Post a pre/post workout massage routine', 'Share how sports massage prevents injury'],
  relaxation: ['Share the stress-relief benefits of relaxation massage', 'Post a self-care reminder for your followers'],
  lymphatic: ['Educate on how lymphatic drainage reduces swelling', 'Share who benefits most from lymphatic massage'],
  hot_stone: ['Showcase the healing power of hot stone therapy', 'Post about the difference between hot stone and regular massage'],
}

function pickRandomNudge(areas) {
  if (!areas?.length) return null
  const randomId = areas[Math.floor(Math.random() * areas.length)]
  const ideas = NUDGE_IDEAS[randomId]
  if (!ideas) return null
  return { id: randomId, text: ideas[Math.floor(Math.random() * ideas.length)] }
}

export function SocialMarketing() {
  const navigate = useNavigate()
  const [photoTypes, setPhotoTypes] = useState([])
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('friendly')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showInstagramTip, setShowInstagramTip] = useState(false)

  const [focusAreas, setFocusAreas] = useState([])
  const [nudge, setNudge] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/social/settings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.focusAreas?.length) {
          setFocusAreas(data.focusAreas)
          setNudge(pickRandomNudge(data.focusAreas))
        }
      })
      .catch(() => {})
  }, [])

  function togglePhotoType(id) {
    setPhotoTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
    setCaption('')
  }

  async function handleGenerate() {
    if (!photoTypes.length) {
      setError('Please select at least one photo type.')
      return
    }
    setError('')
    setCaption('')
    setLoading(true)
    setCopied(false)
    setShowInstagramTip(false)

    try {
      const res = await fetch(`${API}/api/social/caption`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bi_token')}`,
        },
        body: JSON.stringify({ photoTypes, keywords, tone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Something went wrong.'); return }
      setCaption(data.caption)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(caption)
    setCopied(true)
    setShowInstagramTip(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const canGenerate = photoTypes.length > 0 && !loading

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Marketing</h1>
          <p className="text-gray-500 mt-1">Generate an Instagram caption in seconds — tailored to your clinic.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/settings?tab=social')}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>

      {/* Nudge card */}
      {nudge && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-blue-600 mb-1">Post idea for this week</p>
            <p className="text-sm text-gray-800 font-medium">{nudge.text}</p>
            <button
              onClick={() => {
                let enLabel = ''
                for (const spec of Object.values(FOCUS_AREAS)) {
                  const a = spec.areas.find(a => a.id === nudge.id)
                  if (a) { enLabel = a.en; break }
                }
                setKeywords(enLabel)
                setCaption('')
              }}
              className="mt-2 text-xs text-blue-600 font-medium hover:underline"
            >
              Use this idea →
            </button>
          </div>
          <button
            onClick={() => setNudge(pickRandomNudge(focusAreas))}
            className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0"
          >
            New idea →
          </button>
        </div>
      )}

      {/* Step 1 — Photo type */}
      <Card>
        <CardHeader
          title="Step 1 — What kind of photo are you posting?"
          subtitle="Select all that apply"
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PHOTO_TYPES.map(({ id, label, emoji, sub }) => {
              const selected = photoTypes.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePhotoType(id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{emoji} {label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* Step 2 — Keywords */}
      <Card>
        <CardHeader
          title="Step 2 — Any keywords or topics to highlight?"
          subtitle="Optional — a few words go a long way"
        />
        <CardBody>
          <input
            type="text"
            value={keywords}
            onChange={(e) => { setKeywords(e.target.value); setCaption('') }}
            placeholder="e.g. car accident pain, summer wellness, herniated disc"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
            maxLength={120}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            {keywords.length}/120 — AI will weave these into the caption naturally
          </p>
        </CardBody>
      </Card>

      {/* Step 3 — Tone */}
      <Card>
        <CardHeader title="Step 3 — Pick a tone" />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            {TONES.map(({ id, label, sub }) => {
              const selected = tone === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setTone(id); setCaption('') }}
                  className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    selected ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Generate button */}
      <Button size="lg" onClick={handleGenerate} disabled={!canGenerate}>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Writing your caption...
          </span>
        ) : caption ? '✨ Regenerate Caption' : '✨ Generate Caption'}
      </Button>

      {/* Result */}
      {caption && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader title="✨ Your Instagram Caption" subtitle="Personalized with your clinic name and location" />
          <CardBody className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-blue-100 px-5 py-4">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{caption}</p>
            </div>

            <Button size="md" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy Caption'}
            </Button>

            {showInstagramTip && (
              <div className="bg-white border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">📱</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Caption copied!</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Open Instagram, choose your photo, and paste this caption. You're all set!
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
