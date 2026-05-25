import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

export function ClinicSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    clinicName: '',
    address: '',
    phone: '',
    emails: [''],
    cancelHours: 24,
    noShowFee: 50,
    checkFee: 35,
    pin: '',
    logo: null,
    logoPreview: null,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileRef = useRef()

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API}/api/clinic/settings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setSettings((s) => ({
          ...s,
          clinicName: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          emails: data.emails?.length ? data.emails : [''],
          cancelHours: data.cancel_hours ?? 24,
          noShowFee: data.no_show_fee ?? 50,
          checkFee: data.check_fee ?? 35,
          logoPreview: data.logo_url || null,
        }))
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  function formatPhone(raw) {
    const d = raw.replace(/\D/g, '').slice(0, 10)
    if (d.length > 6) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
    if (d.length > 3) return `(${d.slice(0,3)}) ${d.slice(3)}`
    if (d.length > 0) return `(${d}`
    return ''
  }

  function updateEmail(i, value) {
    const emails = [...settings.emails]
    emails[i] = value
    update('emails', emails)
  }

  function addEmail() {
    update('emails', [...settings.emails, ''])
  }

  function removeEmail(i) {
    update('emails', settings.emails.filter((_, idx) => idx !== i))
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setSettings((s) => ({ ...s, logo: file, logoPreview: preview }))
    setSaved(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const form = new FormData()
      form.append('clinicName', settings.clinicName)
      form.append('address', settings.address)
      form.append('phone', settings.phone)
      form.append('emails', JSON.stringify(settings.emails.filter(Boolean)))
      form.append('cancelHours', settings.cancelHours)
      form.append('noShowFee', settings.noShowFee)
      form.append('checkFee', settings.checkFee)
      form.append('pin', settings.pin)
      if (settings.logo) form.append('logo', settings.logo)

      const res = await fetch(`${API}/api/clinic/settings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
        body: form,
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch {
      alert('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
        <p className="text-gray-500 mt-1">Configure your clinic information and policies</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Logo */}
        <Card>
          <CardHeader title="Clinic Logo" subtitle="Appears on the top of every PDF" />
          <CardBody>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-teal-400 overflow-hidden bg-gray-50"
                onClick={() => fileRef.current?.click()}
              >
                {settings.logoPreview
                  ? <img src={settings.logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  : <span className="text-3xl text-gray-300">+</span>
                }
              </div>
              <div>
                <button type="button" className="text-sm text-teal-600 font-medium hover:underline" onClick={() => fileRef.current?.click()}>
                  {settings.logoPreview ? 'Change logo' : 'Upload logo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB. Recommended: 400×400px.</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </CardBody>
        </Card>

        {/* Clinic info */}
        <Card>
          <CardHeader title="Clinic Information" />
          <CardBody className="flex flex-col gap-4">
            <Input label="Clinic Name" value={settings.clinicName} onChange={(e) => update('clinicName', e.target.value)} placeholder="Sunrise Acupuncture Clinic" required />
            <Input label="Address" value={settings.address} onChange={(e) => update('address', e.target.value)} placeholder="123 Main St, Los Angeles, CA 90001" />
            <Input label="Phone Number" type="tel" value={settings.phone} onChange={(e) => update('phone', formatPhone(e.target.value))} placeholder="(555) 000-0000" />
          </CardBody>
        </Card>

        {/* Recipient emails */}
        <Card>
          <CardHeader title="PDF Recipient Emails" subtitle="Completed intake PDFs will be sent to these addresses" />
          <CardBody className="flex flex-col gap-3">
            {settings.emails.map((email, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(i, e.target.value)}
                  placeholder="office@clinic.com"
                  className="flex-1"
                />
                {settings.emails.length > 1 && (
                  <button type="button" onClick={() => removeEmail(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addEmail} className="text-sm text-teal-600 font-medium hover:underline self-start">
              + Add another email
            </button>
          </CardBody>
        </Card>

        {/* Financial policy */}
        <Card>
          <CardHeader title="Financial Policy" subtitle="These values appear in the Financial Policy form" />
          <CardBody className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">Cancellation Notice (hours)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={settings.cancelHours}
                    onChange={(e) => update('cancelHours', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  />
                  <span className="text-gray-500 text-sm whitespace-nowrap">hours</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">No-Show / Late Cancel Fee</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    min={0}
                    value={settings.noShowFee}
                    onChange={(e) => update('noShowFee', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Returned Check Fee</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min={0}
                  value={settings.checkFee}
                  onChange={(e) => update('checkFee', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tablet PIN */}
        <Card>
          <CardHeader title="Tablet Mode PIN" subtitle="Staff enter this PIN to unlock the tablet after a patient completes their forms" />
          <CardBody>
            <Input
              label="PIN (4–6 digits)"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={settings.pin}
              onChange={(e) => update('pin', e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
            />
          </CardBody>
        </Card>

        <Button type="submit" size="lg" disabled={saving || loading}>
          {loading ? 'Loading...' : saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}
