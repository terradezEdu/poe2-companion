import { useState } from 'react'
import type { CampaignConnection } from '../campaign/domain/model.ts'
import { validateCampaignDataset } from '../campaign/validation/index.ts'
import { campaignFixtures } from './campaign-fixtures.ts'
import { CampaignMap } from '../campaign/map/index.ts'
import './campaign-map-surface.css'

const interactionAreas = [
  createArea('area-a', 'Área A'), createArea('area-b', 'Área B'), createArea('area-c', 'Área C'),
]
const interactionConnections: readonly CampaignConnection[] = [
  { fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'BIDIRECTIONAL' },
  { fromAreaId: 'area-b', toAreaId: 'area-c', direction: 'DIRECTED' },
]
const crossingAreas = 'abcdefghi'.split('').map((letter) =>
  createArea(`area-${letter}`, letter === 'f'
    ? 'La extensa región de los antiguos pretorianos corrompidos'
    : `Área ${letter.toUpperCase()}`),
)
const crossingConnections: readonly CampaignConnection[] = [
  { fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'BIDIRECTIONAL' },
  { fromAreaId: 'area-a', toAreaId: 'area-i', direction: 'DIRECTED' },
]
const interactionDataset = validateFixture(interactionAreas, interactionConnections)
const crossingDataset = validateFixture(crossingAreas, crossingConnections)

/**
 * This is only reachable through VITE_CAMPAIGN_TEST_MODE and exists to test
 * Issue #7's controlled surface. It is not bundled campaign data and it does
 * not render the preview owned by Issue #6.
 */
export default function CampaignMapSurfaceTestAdapter({ fixture }: { readonly fixture: string }) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const isCrossingFixture = fixture === campaignFixtures.mapLayoutCrossing
  const dataset = isCrossingFixture ? crossingDataset : interactionDataset

  return (
    <main className="campaign-map-test-surface">
      <h1>Mapa de campaña — fixture de prueba</h1>
      <CampaignMap
        areas={dataset.act.areas}
        connections={dataset.connections}
        selectedAreaId={selectedAreaId}
        onAreaSelect={setSelectedAreaId}
      />
      <output data-testid="selected-area-id">{selectedAreaId ?? 'sin selección'}</output>
    </main>
  )
}

function validateFixture(areas: readonly unknown[], connections: readonly CampaignConnection[]) {
  const result = validateCampaignDataset({
    schemaVersion: 'campaign-map/v0.1',
    gameVersion: '0.1.0',
    acts: [{ id: 'act-1', areas }],
    connections,
  })
  if (!result.ok) throw new Error(`Invalid Campaign Map test fixture: ${result.errors.map((error) => error.code).join(', ')}`)
  return result.dataset
}

function createArea(id: string, name: string) {
  return {
    id,
    name,
    level: 1,
    danger: 'LOW',
    hardcoreWarning: { state: 'known', value: '' },
    rewards: { state: 'verified-absent' },
    pointsOfInterest: { state: 'verified-absent' },
    curiosities: { state: 'verified-absent' },
    bosses: [],
    verification: { status: 'UNKNOWN', sources: [], verifiedAt: { state: 'unknown' } },
  }
}
