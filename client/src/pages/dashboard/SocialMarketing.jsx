import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

const PHOTO_TYPES = [
  { id: 'treatment', label: 'Patient Treatment / Procedure', emoji: '🫁', sub: 'Acupuncture, chiropractic, cupping...' },
  { id: 'clinic', label: 'Clinic Vibe / Interior', emoji: '🏡', sub: 'Space, ambiance, behind the scenes' },
  { id: 'health', label: 'Health Tips / Herbs', emoji: '🌿', sub: 'Wellness info, herbs, education' },
  { id: 'review', label: 'Patient Review / Story', emoji: '⭐', sub: 'Testimonials, success stories' },
]

const TONES = [
  { id: 'professional', label: 'Professional & Trustworthy', sub: 'Expert, informative, confident' },
  { id: 'friendly', label: 'Warm & Friendly', sub: 'Approachable, caring, conversational' },
]

export function SocialMarketing() {
  const [photoTypes, setPhotoTypes] = useState([])
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('friendly')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showInstagramTip, setShowInstagramTip] = useState(false)

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Marketing</h1>
        <p className="text-gray-500 mt-1">Generate an Instagram caption in seconds — tailored to your clinic.</p>
      </div>

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
