import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

export const FOCUS_AREAS = {
  acupuncture: {
    label: 'Acupuncture / Oriental Medicine',
    areas: [
      { id: 'pain_mgmt', label: 'Pain Management', en: 'pain management' },
      { id: 'fertility', label: 'Fertility & Women\'s Health', en: 'fertility and women\'s health' },
      { id: 'digestive', label: 'Digestive Health', en: 'digestive health' },
      { id: 'sleep', label: 'Sleep Disorders', en: 'sleep disorders' },
      { id: 'stress', label: 'Stress & Anxiety', en: 'stress and anxiety' },
      { id: 'cosmetic', label: 'Cosmetic Acupuncture', en: 'cosmetic acupuncture' },
    ],
  },
  chiropractic: {
    label: 'Chiropractic',
    areas: [
      { id: 'disc', label: 'Back & Neck Disc', en: 'back and neck disc issues' },
      { id: 'posture', label: 'Posture Correction', en: 'posture correction' },
      { id: 'sports_injury', label: 'Sports Injuries', en: 'sports injuries' },
      { id: 'headache', label: 'Headaches & Migraines', en: 'headaches and migraines' },
      { id: 'postpartum', label: 'Postpartum Care', en: 'postpartum chiropractic' },
      { id: 'pediatric', label: 'Pediatric Chiropractic', en: 'pediatric chiropractic' },
    ],
  },
  massage: {
    label: 'Massage Therapy',
    areas: [
      { id: 'deep_tissue', label: 'Deep Tissue', en: 'deep tissue massage' },
      { id: 'prenatal', label: 'Prenatal', en: 'prenatal massage' },
      { id: 'sports_massage', label: 'Sports Massage', en: 'sports massage' },
      { id: 'relaxation', label: 'Relaxation', en: 'relaxation massage' },
      { id: 'lymphatic', label: 'Lymphatic Drainage', en: 'lymphatic drainage' },
      { id: 'hot_stone', label: 'Hot Stone', en: 'hot stone massage' },
    ],
  },
}

const TONES = [
  { id: 'friendly', label: 'Warm & Friendly', sub: 'Approachable, caring, conversational' },
  { id: 'professional', label: 'Professional & Trustworthy', sub: 'Expert, informative, confident' },
]

export function SocialSetup({ initial = [], initialTone = 'friendly', onSave, onSkip }) {
  const [selected, setSelected] = useState(initial)
  const [tone, setTone] = useState(initialTone)
  const [saving, setSaving] = useState(false)

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`${API}/api/social/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
      body: JSON.stringify({ focusAreas: selected, tone }),
    })
    setSaving(false)
    onSave(selected, tone)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Set Up Social Marketing</h1>
        <p className="text-gray-500 mt-1">What specialties does your clinic offer? We'll tailor caption suggestions to your practice.</p>
      </div>

      {Object.entries(FOCUS_AREAS).map(([specKey, spec]) => (
        <Card key={specKey}>
          <CardHeader title={spec.label} />
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {spec.areas.map(area => {
                const isSelected = selected.includes(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggle(area.id)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {area.label}
                  </button>
                )
              })}
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Tone */}
      <Card>
        <CardHeader title="Default Caption Tone" subtitle="You can change this anytime per post" />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            {TONES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  tone === t.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  tone === t.id ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {tone === t.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col items-center gap-3">
        <Button size="lg" onClick={handleSave} disabled={selected.length === 0 || saving} className="w-full">
          {saving ? 'Saving...' : `Save & Continue (${selected.length} selected)`}
        </Button>
        {onSkip && (
          <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600 underline">
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
