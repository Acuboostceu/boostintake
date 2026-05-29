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

export function SocialSetup({ initial = [], onSave, onSkip }) {
  const [selected, setSelected] = useState(initial)
  const [saving, setSaving] = useState(false)

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`${API}/api/social/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
      body: JSON.stringify({ focusAreas: selected }),
    })
    setSaving(false)
    onSave(selected)
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
