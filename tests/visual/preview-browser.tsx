import { createRoot } from 'react-dom/client'
import { SelectedAreaPreview } from '../../src/campaign/preview/index.ts'
import { SUPPORTED_CAMPAIGN_SCHEMA_VERSION } from '../../src/campaign/domain/model.ts'
import { validateCampaignDataset } from '../../src/campaign/validation/campaign-validator.ts'

const state = new URLSearchParams(location.search).get('state')
const knownBoss = {
  id: 'boss-alfa', name: 'Jefe Alfa', description: 'Un jefe feroz.', damageTypes: ['Daño físico'],
  weaknesses: ['Frío'], resistances: ['Fuego'], dangerousMechanics: ['Golpe de onda'],
  rewards: ['Recompensa Alfa'],
  verification: { status: 'VERIFIED', sources: ['Fuente Alfa'], verifiedAt: '2025-01-01' },
}

function validatedArea() {
  const bosses = state === 'two-bosses' ? [knownBoss, {
    id: 'boss-beta', name: 'Jefe Beta', description: 'Un jefe ígneo.', damageTypes: ['Daño de fuego'],
    weaknesses: { state: 'verified-absent' }, resistances: ['Frío'], dangerousMechanics: ['Lluvia de fuego'],
    rewards: ['Recompensa Beta'],
    verification: { status: 'UNKNOWN', sources: ['Fuente Beta'], verifiedAt: '2025-01-02' },
  }] : [knownBoss]
  const result = validateCampaignDataset({
    schemaVersion: SUPPORTED_CAMPAIGN_SCHEMA_VERSION,
    acts: [{ id: 'act-1', areas: [{
      id: 'area-a', name: 'Área A', level: 12, danger: 'HIGH', hardcoreWarning: 'Daño físico explosivo',
      rewards: state === 'unknown' || state === 'verified-absent' ? { state } : ['Recompensa A'],
      pointsOfInterest: ['Punto A'], curiosities: ['Curiosidad A'],
      bosses: state === 'unknown' || state === 'verified-absent' ? { state } : bosses,
      verification: { status: 'VERIFIED', sources: ['Fuente Área'], verifiedAt: '2025-02-01' },
    }] }],
    connections: [],
  })
  if (!result.ok) throw new Error('Visual fixture did not validate.')
  return result.dataset.act.areas[0]
}

createRoot(document.getElementById('root')!).render(
  <SelectedAreaPreview area={state === 'default' ? undefined : validatedArea()} />,
)
