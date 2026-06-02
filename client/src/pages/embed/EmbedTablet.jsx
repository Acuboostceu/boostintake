import { useEmbedAuth, EmbedShell } from './EmbedLoader'
import { TabletMode } from '../dashboard/TabletMode'

export function EmbedTablet() {
  const { ready, error } = useEmbedAuth()
  return (
    <EmbedShell ready={ready} error={error}>
      <TabletMode />
    </EmbedShell>
  )
}
