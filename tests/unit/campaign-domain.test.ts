import assert from 'node:assert/strict'
import test from 'node:test'
import { SUPPORTED_CAMPAIGN_SCHEMA_VERSION } from '../../src/campaign/domain/model.ts'
import { localizeDanger, localizeKnowledgeState, localizeVerification } from '../../src/campaign/localization/es.ts'
import { validateCampaignDataset } from '../../src/campaign/validation/campaign-validator.ts'

/** Deliberately untyped external input: the validator, not the fixture, owns decoding. */
function validDataset(): Record<string, any> {
  return {
    schemaVersion: SUPPORTED_CAMPAIGN_SCHEMA_VERSION,
    gameVersion: '0.1.0',
    acts: [
      {
        id: 'act-1',
        areas: [
          {
            id: 'area-a',
            name: 'Área A',
            level: 1,
            danger: 'HIGH',
            hardcoreWarning: 'Daño físico explosivo',
            rewards: ['Recompensa A'],
            bosses: [
              {
                id: 'boss-alfa',
                name: 'Jefe Alfa',
                verification: { status: 'VERIFIED', sources: ['Fuente Alfa'], verifiedAt: '2025-01-01' },
              },
            ],
            verification: { status: 'VERIFIED', sources: ['Fuente Área'], verifiedAt: '2025-02-01' },
          },
          { id: 'area-b' },
        ],
      },
    ],
    connections: [{ fromAreaId: 'area-a', toAreaId: 'area-b' }],
  }
}

function expectFailure(input: unknown, code: string) {
  const result = validateCampaignDataset(input)
  assert.equal(result.ok, false)
  if (!result.ok) assert.deepEqual(result.errors.map((error) => error.code), [code])
}

test('rejects every locked structural condition and no partial dataset escapes', () => {
  expectFailure('{', 'DATASET_UNPARSEABLE')

  const unsupportedSchema = validDataset()
  unsupportedSchema.schemaVersion = 'other-schema'
  expectFailure(unsupportedSchema, 'UNSUPPORTED_SCHEMA')

  const missingAct = validDataset()
  missingAct.acts = [{ id: 'act-2', areas: [] }]
  expectFailure(missingAct, 'ACT_ONE_MISSING')

  const emptyAct = validDataset()
  emptyAct.acts[0].areas = []
  expectFailure(emptyAct, 'ACT_ONE_EMPTY')

  const duplicateArea = validDataset()
  duplicateArea.acts[0].areas[1].id = 'area-a'
  expectFailure(duplicateArea, 'DUPLICATE_REQUIRED_IDENTIFIER')

  const missingReference = validDataset()
  missingReference.connections = [{ fromAreaId: 'area-a' }]
  expectFailure(missingReference, 'MISSING_STRUCTURAL_REFERENCE')

  const unknownArea = validDataset()
  unknownArea.connections = [{ fromAreaId: 'area-a', toAreaId: 'not-an-area' }]
  expectFailure(unknownArea, 'UNKNOWN_CONNECTION_AREA')
})

test('normalises omitted optional knowledge without invalidating a structurally valid map', () => {
  const input = validDataset()
  delete input.acts[0].areas[0].bosses[0].description
  delete input.acts[0].areas[0].bosses[0].weaknesses
  delete input.acts[0].areas[1].rewards
  const result = validateCampaignDataset(input)

  assert.equal(result.ok, true)
  if (!result.ok) return
  const [areaA, areaB] = result.dataset.act.areas
  assert.equal(areaA.bosses.state, 'known')
  if (areaA.bosses.state === 'known') {
    assert.equal(areaA.bosses.value[0].description.state, 'unknown')
    assert.equal(areaA.bosses.value[0].weaknesses.state, 'unknown')
  }
  assert.equal(areaB.rewards.state, 'unknown')
})

test('preserves known, unknown, and verified-absent facts independently', () => {
  const input = validDataset()
  input.acts[0].areas[0].rewards = { state: 'verified-absent' }
  input.acts[0].areas[0].bosses[0].weaknesses = { state: 'unknown' }
  const result = validateCampaignDataset(input)

  assert.equal(result.ok, true)
  if (!result.ok) return
  const area = result.dataset.act.areas[0]
  assert.equal(area.rewards.state, 'verified-absent')
  assert.equal(area.bosses.state, 'known')
  if (area.bosses.state === 'known') assert.equal(area.bosses.value[0].weaknesses.state, 'unknown')
})

test('does not admit an empty raw boss collection as known empty knowledge', () => {
  const input = validDataset()
  input.acts[0].areas[0].bosses = []
  input.acts[0].areas[1].bosses = { state: 'known', value: [] }
  const result = validateCampaignDataset(input)

  assert.equal(result.ok, true)
  if (!result.ok) return
  const [areaA, areaB] = result.dataset.act.areas
  assert.equal(areaA.bosses.state, 'unknown')
  assert.equal(areaB.bosses.state, 'unknown')

  const explicitAbsence = validDataset()
  explicitAbsence.acts[0].areas[0].bosses = { state: 'verified-absent' }
  const absentResult = validateCampaignDataset(explicitAbsence)
  assert.equal(absentResult.ok, true)
  if (!absentResult.ok) return
  assert.equal(absentResult.dataset.act.areas[0].bosses.state, 'verified-absent')
})

test('keeps connection direction and verification evidence record-scoped', () => {
  const input = validDataset()
  input.connections[0].direction = 'DIRECTED'
  const result = validateCampaignDataset(input)

  assert.equal(result.ok, true)
  if (!result.ok) return
  const area = result.dataset.act.areas[0]
  assert.equal(result.dataset.connections[0].direction, 'DIRECTED')
  assert.equal(area.verification.sources[0], 'Fuente Área')
  assert.equal(area.bosses.state, 'known')
  if (area.bosses.state === 'known') {
    assert.equal(area.bosses.value[0].verification.sources[0], 'Fuente Alfa')
    assert.equal(area.bosses.value[0].verification.verifiedAt.state, 'known')
  }
})

test('normalises source-less verification without changing optional knowledge', () => {
  const input = validDataset()
  const boss = input.acts[0].areas[0].bosses[0]
  boss.verification = { status: 'VERIFIED', sources: [] }
  boss.weaknesses = { state: 'unknown' }
  boss.rewards = { state: 'verified-absent' }
  const result = validateCampaignDataset(input)

  assert.equal(result.ok, true)
  if (!result.ok) return
  const area = result.dataset.act.areas[0]
  assert.equal(area.bosses.state, 'known')
  if (area.bosses.state === 'known') {
    const normalisedBoss = area.bosses.value[0]
    assert.equal(normalisedBoss.verification.status, 'UNKNOWN')
    assert.equal(localizeVerification(normalisedBoss.verification.status), 'Sin verificar')
    assert.equal(normalisedBoss.weaknesses.state, 'unknown')
    assert.equal(normalisedBoss.rewards.state, 'verified-absent')
  }
})

test('maps all controlled values and grammatical unknown/absence forms to Spanish', () => {
  assert.deepEqual(
    ['LOW', 'MEDIUM', 'HIGH', 'EXTREME', 'UNKNOWN'].map((value) => localizeDanger(value as Parameters<typeof localizeDanger>[0])),
    ['Bajo', 'Medio', 'Alto', 'Extremo', 'Desconocido'],
  )
  assert.equal(localizeVerification('VERIFIED'), 'Verificado')
  assert.equal(localizeVerification('UNKNOWN'), 'Sin verificar')
  assert.equal(localizeKnowledgeState('unknown', 'feminine', 'plural'), 'Desconocidas')
  assert.equal(localizeKnowledgeState('verified-absent', 'feminine', 'singular'), 'Ninguna')
})
