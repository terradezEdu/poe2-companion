import { useState } from 'react'
import { knownKnowledge } from '../campaign/domain/knowledge.ts'
import type { AreaKnowledge, CampaignConnection } from '../campaign/domain/model.ts'
import { CampaignMap } from '../campaign/map/index.ts'
import './campaign-map-surface.css'

const areas: readonly AreaKnowledge[] = [
  createArea('area-a', 'Área A'),
  createArea('area-b', 'Área B'),
  createArea('area-c', 'Área C'),
]

const connections: readonly CampaignConnection[] = [
  { fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'BIDIRECTIONAL' },
  { fromAreaId: 'area-b', toAreaId: 'area-c', direction: 'DIRECTED' },
]

/**
 * This is only reachable through VITE_CAMPAIGN_TEST_MODE and exists to test
 * Issue #7's controlled surface. It is not bundled campaign data and it does
 * not render the preview owned by Issue #6.
 */
export default function CampaignMapSurfaceTestAdapter() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)

  return (
    <main className="campaign-map-test-surface">
      <h1>Mapa de campaña — superficie de prueba</h1>
      <CampaignMap
        areas={areas}
        connections={connections}
        selectedAreaId={selectedAreaId}
        onAreaSelect={setSelectedAreaId}
      />
      <output data-testid="selected-area-id">{selectedAreaId ?? 'sin selección'}</output>
    </main>
  )
}

function createArea(id: string, name: string): AreaKnowledge {
  return {
    id,
    name: knownKnowledge(name),
    level: knownKnowledge(1),
    danger: 'LOW',
    hardcoreWarning: knownKnowledge(''),
    rewards: knownKnowledge([]),
    pointsOfInterest: knownKnowledge([]),
    curiosities: knownKnowledge([]),
    bosses: knownKnowledge([]),
    verification: { status: 'UNKNOWN', sources: [], verifiedAt: { state: 'known', value: '' } },
  }
}
