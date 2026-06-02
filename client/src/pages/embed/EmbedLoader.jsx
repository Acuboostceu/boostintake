// Shared hook: verifies EHR embed token → sets localStorage → returns { ready, patient, error }
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API } from '../../lib/api'

export function useEmbedAuth() {
  const [searchParams] = useSearchParams()
  const [ready, setReady] = useState(false)
  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setError('No embed token provided.'); return }

    fetch(`${API}/api/embed/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.message) { setError(data.message); return }

        localStorage.setItem('bi_token', data.token)
        localStorage.setItem('bi_clinic', JSON.stringify({
          id: data.clinic.id,
          name: data.clinic.name,
          smsTemplate: data.clinic.smsTemplate,
          phone: data.clinic.phone,
          locations: data.clinic.locations,
        }))

        setPatient(data.patient || null)
        setReady(true)
      })
      .catch(() => setError('Failed to verify embed token.'))
  }, [])

  return { ready, patient, error }
}

export function EmbedShell({ children, error, ready }) {
  if (error) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#ef4444', fontFamily: 'sans-serif' }}>
      <p>⚠️ {error}</p>
    </div>
  )
  if (!ready) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
      <p>Loading…</p>
    </div>
  )
  return children
}
