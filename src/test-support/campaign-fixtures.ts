/**
 * Browser-test fixture IDs for the locked campaign-map acceptance contract.
 *
 * These are test inputs, not production data and not a runtime dataset
 * selection capability. The normal browser path must continue to use the
 * bundled campaign data. A future test adapter may accept an ID only when its
 * explicit test-mode flag is enabled by the Playwright web server.
 */
export const campaignFixtures = {
  mapInteraction: 'map-interaction',
  mapLayoutCrossing: 'map-layout-crossing',
  connectionBidirectional: 'connection-bidirectional',
  connectionDirected: 'connection-directed',
  branch: 'branch',
  areaAComplete: 'area-a-complete',
  areaATwoBosses: 'area-a-two-bosses',
  dangerHigh: 'danger-high',
  dangerUnknown: 'danger-unknown',
  knowledgeKnown: 'knowledge-known',
  knowledgeUnknown: 'knowledge-unknown',
  knowledgeVerifiedAbsence: 'knowledge-verified-absence',
  bossKnowledgeIndependent: 'boss-knowledge-independent',
  areaBossVerificationIndependent: 'area-boss-verification-independent',
  verifiedBossUnknownWeakness: 'verified-boss-unknown-weakness',
  optionalKnowledgeMissing: 'optional-knowledge-missing',
  versionKnown: 'version-known',
  versionUnknown: 'version-unknown',
  dangerLow: 'danger-low',
  dangerMedium: 'danger-medium',
  dangerExtreme: 'danger-extreme',
  verificationVerified: 'verification-verified',
  verificationUnknown: 'verification-unknown',
  knowledgeUnknownFemininePlural: 'knowledge-unknown-feminine-plural',
  knowledgeVerifiedAbsentFeminineSingular: 'knowledge-verified-absent-feminine-singular',
  structurallyInvalidParse: 'structurally-invalid-parse',
  structurallyInvalidSchema: 'structurally-invalid-schema',
  structurallyInvalidMissingAct1: 'structurally-invalid-missing-act-1',
  structurallyInvalidEmptyAct1: 'structurally-invalid-empty-act-1',
  structurallyInvalidDuplicateId: 'structurally-invalid-duplicate-id',
  structurallyInvalidMissingReference: 'structurally-invalid-missing-reference',
  structurallyInvalidUnknownConnectionArea: 'structurally-invalid-unknown-connection-area',
} as const

export type CampaignFixture = (typeof campaignFixtures)[keyof typeof campaignFixtures]

export const structuralInvalidFixtures = [
  ['cannot be parsed', campaignFixtures.structurallyInvalidParse],
  ['uses an unsupported schema version', campaignFixtures.structurallyInvalidSchema],
  ['does not contain Act 1', campaignFixtures.structurallyInvalidMissingAct1],
  ['contains no areas in Act 1', campaignFixtures.structurallyInvalidEmptyAct1],
  ['repeats a required identifier', campaignFixtures.structurallyInvalidDuplicateId],
  ['omits a required structural reference', campaignFixtures.structurallyInvalidMissingReference],
  ['contains a connection to an area that does not exist', campaignFixtures.structurallyInvalidUnknownConnectionArea],
] as const

export const controlledValueFixtures = [
  ['danger LOW', campaignFixtures.dangerLow, 'Bajo'],
  ['danger MEDIUM', campaignFixtures.dangerMedium, 'Medio'],
  ['danger HIGH', campaignFixtures.dangerHigh, 'Alto'],
  ['danger EXTREME', campaignFixtures.dangerExtreme, 'Extremo'],
  ['danger UNKNOWN', campaignFixtures.dangerUnknown, 'Desconocido'],
  ['verification VERIFIED', campaignFixtures.verificationVerified, 'Verificado'],
  ['verification UNKNOWN', campaignFixtures.verificationUnknown, 'Sin verificar'],
  ['unknown feminine plural knowledge', campaignFixtures.knowledgeUnknownFemininePlural, 'Desconocidas'],
  ['verified-absent feminine singular knowledge', campaignFixtures.knowledgeVerifiedAbsentFeminineSingular, 'Ninguna'],
] as const

export const knowledgeFixtures = [
  ['known', campaignFixtures.knowledgeKnown, 'Jefe Alfa', 'Recompensa A'],
  ['unknown', campaignFixtures.knowledgeUnknown, 'Jefe: Desconocido', 'Recompensas: Desconocidas'],
  ['verified absence', campaignFixtures.knowledgeVerifiedAbsence, 'Jefe: Ninguno', 'Recompensas: Ninguna'],
] as const

export const versionFixtures = [
  ['0.1.0', campaignFixtures.versionKnown, '0.1.0'],
  ['unknown', campaignFixtures.versionUnknown, 'Desconocido'],
] as const

/** Expected rendered values for the synthetic two-boss ownership fixture. */
export const twoBossFixtureValues = {
  alfa: {
    damage: 'Daño físico',
    weaknesses: 'Débil al frío',
    mechanics: 'Golpe de onda',
    reward: 'Recompensa Alfa',
    source: 'Fuente Alfa',
    verifiedAt: '2025-01-01',
  },
  beta: {
    damage: 'Daño de fuego',
    weaknesses: 'Débil al rayo',
    mechanics: 'Lluvia de fuego',
    reward: 'Recompensa Beta',
    source: 'Fuente Beta',
    verifiedAt: '2025-01-02',
  },
} as const

/** Expected rendered values for the record-scoped verification fixture. */
export const recordVerificationFixtureValues = {
  area: {
    verification: 'Verificado',
    source: 'Fuente Área',
    verifiedAt: '2025-02-01',
  },
  boss: {
    verification: 'Sin verificar',
    source: 'Fuente Jefe',
    verifiedAt: '2025-02-02',
  },
} as const

export function fixtureUrl(fixture: CampaignFixture) {
  return `/?__campaignFixture=${fixture}`
}
