import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

export const FOCUS_AREAS = {
  acupuncture: {
    label: '침구 / 한의',
    areas: [
      { id: 'pain_mgmt', label: '통증관리', en: 'pain management' },
      { id: 'fertility', label: '불임 / 여성건강', en: 'fertility and women\'s health' },
      { id: 'digestive', label: '소화기', en: 'digestive health' },
      { id: 'sleep', label: '수면장애', en: 'sleep disorders' },
      { id: 'stress', label: '스트레스 / 불안', en: 'stress and anxiety' },
      { id: 'cosmetic', label: '피부미용', en: 'cosmetic acupuncture' },
    ],
  },
  chiropractic: {
    label: '카이로프랙틱',
    areas: [
      { id: 'disc', label: '허리 / 목 디스크', en: 'back and neck disc issues' },
      { id: 'posture', label: '자세교정', en: 'posture correction' },
      { id: 'sports_injury', label: '스포츠 부상', en: 'sports injuries' },
      { id: 'headache', label: '두통', en: 'headaches and migraines' },
      { id: 'postpartum', label: '산후 교정', en: 'postpartum chiropractic' },
      { id: 'pediatric', label: '소아 카이로', en: 'pediatric chiropractic' },
    ],
  },
  massage: {
    label: '마사지',
    areas: [
      { id: 'deep_tissue', label: '딥티슈', en: 'deep tissue massage' },
      { id: 'prenatal', label: '임산부', en: 'prenatal massage' },
      { id: 'sports_massage', label: '스포츠', en: 'sports massage' },
      { id: 'relaxation', label: '릴렉세이션', en: 'relaxation massage' },
      { id: 'lymphatic', label: '림프드레나쥐', en: 'lymphatic drainage' },
      { id: 'hot_stone', label: '핫스톤', en: 'hot stone massage' },
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
        <h1 className="text-2xl font-bold text-gray-900">소셜 마케팅 설정</h1>
        <p className="text-gray-500 mt-1">어떤 분야를 주로 다루시나요? 선택하면 캡션이 더 정확해져요.</p>
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
          {saving ? '저장 중...' : `저장하고 시작하기 (${selected.length}개 선택)`}
        </Button>
        {onSkip && (
          <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600 underline">
            나중에 설정하기
          </button>
        )}
      </div>
    </div>
  )
}
