import { useEmbedAuth, EmbedShell } from './EmbedLoader'
import { SendPatient } from '../dashboard/SendPatient'

export function EmbedSend() {
  const { ready, patient, error } = useEmbedAuth()
  return (
    <EmbedShell ready={ready} error={error}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
        <SendPatient embedPrefill={patient} />
      </div>
    </EmbedShell>
  )
}
