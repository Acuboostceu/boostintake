import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClinicSettings } from './ClinicSettings'
import { SocialSetup } from './SocialSetup'
import { API } from '../../lib/api'

const TABS = [
  { id: 'clinic', label: 'Clinic Settings' },
  { id: 'social', label: 'Social Marketing' },
]

export function SettingsPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'social' ? 'social' : 'clinic')
  const [socialSaved, setSocialSaved] = useState(false)
  const [socialInitial, setSocialInitial] = useState(null)
  const [socialInitialTone, setSocialInitialTone] = useState('friendly')
  const [socialLoaded, setSocialLoaded] = useState(false)

  function loadSocialSettings() {
    fetch(`${API}/api/social/settings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then(r => r.json())
      .then(data => {
        setSocialInitial(data?.focusAreas || [])
        setSocialInitialTone(data?.tone || 'friendly')
        setSocialLoaded(true)
      })
      .catch(() => { setSocialInitial([]); setSocialLoaded(true) })
  }

  // Auto-load if starting on social tab
  useEffect(() => { if (activeTab === 'social') loadSocialSettings() }, [])

  function handleTabChange(id) {
    setActiveTab(id)
    setSocialSaved(false)
    if (id === 'social' && !socialLoaded) loadSocialSettings()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'clinic' && <ClinicSettings />}

      {activeTab === 'social' && (
        socialLoaded ? (
          socialSaved ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
              ✓ Social marketing preferences saved!
            </div>
          ) : (
            <SocialSetup
              initial={socialInitial}
              initialTone={socialInitialTone}
              onSave={() => setSocialSaved(true)}
            />
          )
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        )
      )}
    </div>
  )
}
