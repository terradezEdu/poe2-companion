import assert from 'node:assert/strict'
import test from 'node:test'
import { ACT_ONE_CAMPAIGN_INPUT, ACT_ONE_SOURCE_AUDIT } from '../../src/campaign/data/index.ts'
import { validateCampaignDataset } from '../../src/campaign/validation/campaign-validator.ts'

function validatedDataset() {
  const result = validateCampaignDataset(ACT_ONE_CAMPAIGN_INPUT)
  assert.equal(result.ok, true)
  if (!result.ok) throw new Error(JSON.stringify(result.errors))
  return result.dataset
}

test('the sole production snapshot satisfies the locked campaign validator', () => {
  const dataset = validatedDataset()

  assert.equal(dataset.schemaVersion, 'campaign-map/v0.1')
  assert.deepEqual(dataset.gameVersion, { state: 'known', value: '0.5.4' })
  assert.equal(dataset.act.id, 'act-1')
  assert.equal(dataset.act.areas.length, 18)
  assert.equal(dataset.connections.length, 17)
})

test('all direct transitions retain audited endpoints and directionality', () => {
  const dataset = validatedDataset()
  const actual = dataset.connections.map(({ fromAreaId, toAreaId, direction }) => [fromAreaId, toAreaId, direction])
  const audited = ACT_ONE_SOURCE_AUDIT.transitions.map(([from, to, direction]) => [from, to, direction])

  assert.deepEqual(actual, audited)
  assert.equal(dataset.connections.filter(({ direction }) => direction === 'DIRECTED').length, 1)
  assert.deepEqual(
    dataset.connections.find(({ direction }) => direction === 'DIRECTED'),
    { fromAreaId: 'ogham-village', toAreaId: 'manor-ramparts', direction: 'DIRECTED' },
  )
  assert.deepEqual(
    dataset.connections.find(({ fromAreaId, toAreaId }) => fromAreaId === 'grelwood' && toAreaId === 'root-hollow'),
    { fromAreaId: 'grelwood', toAreaId: 'root-hollow', direction: 'BIDIRECTIONAL' },
  )
  assert.deepEqual(
    dataset.connections.find(({ fromAreaId, toAreaId }) => fromAreaId === 'grelwood' && toAreaId === 'lost-catacombs'),
    { fromAreaId: 'grelwood', toAreaId: 'lost-catacombs', direction: 'BIDIRECTIONAL' },
  )
  assert.ok(ACT_ONE_SOURCE_AUDIT.transitions.every(([, , , source]) => source.startsWith('https://poe2db.tw/')))
  assert.deepEqual(
    ACT_ONE_SOURCE_AUDIT.resolvedSourceConflicts.map(({ subject }) => subject),
    [
      'grelwood-root-hollow',
      'grelwood-lost-catacombs',
      'ogham-village-manor-ramparts',
      'mausoleum-tomb-area-levels',
    ],
  )
  assert.ok(ACT_ONE_SOURCE_AUDIT.resolvedSourceConflicts.every(({ status }) => status === 'RESOLVED_BY_HUMAN_DATA_DECISION'))
  const levelResolution = ACT_ONE_SOURCE_AUDIT.resolvedSourceConflicts.find(({ subject }) => subject === 'mausoleum-tomb-area-levels')
  assert.ok(levelResolution && 'deferredDomainKnowledge' in levelResolution)
  if (levelResolution && 'deferredDomainKnowledge' in levelResolution) {
    assert.match(levelResolution.deferredDomainKnowledge, /dynamic level 8\/9 behavior depending on instance\/order/)
  }
})

test('area and boss evidence stays record-scoped and accepted-source backed', () => {
  const dataset = validatedDataset()

  for (const area of dataset.act.areas) {
    assert.equal(area.verification.status, 'VERIFIED')
    assert.ok(area.verification.sources.length >= 1)
    assert.match(area.verification.sources[0], /^PoE2DB \(area record, Spanish locale\): /)
    assert.deepEqual(area.verification.verifiedAt, { state: 'known', value: '2026-09-22' })

    if (area.bosses.state !== 'known') continue
    for (const boss of area.bosses.value) {
      assert.equal(boss.verification.status, 'VERIFIED')
      assert.equal(boss.verification.sources.length, 1)
      assert.match(boss.verification.sources[0], /^PoE2DB \(boss (record|listing), Spanish locale\): /)
      assert.notEqual(boss.verification.sources[0], area.verification.sources[0])
    }
  }
})

test('known, unknown, and verified absence remain distinct in production data', () => {
  const dataset = validatedDataset()
  const byId = new Map(dataset.act.areas.map((area) => [area.id, area]))

  assert.equal(byId.get('riverbank')?.bosses.state, 'known')
  assert.equal(byId.get('clearfell-encampment')?.bosses.state, 'unknown')
  assert.equal(byId.get('lost-catacombs')?.bosses.state, 'unknown')
  assert.equal(byId.get('mausoleum-of-the-praetor')?.level.state, 'unknown')
  assert.equal(byId.get('tomb-of-the-consort')?.level.state, 'unknown')
  assert.equal(byId.get('ogham-farmlands')?.bosses.state, 'verified-absent')
  assert.equal(byId.get('manor-ramparts')?.bosses.state, 'verified-absent')
  assert.deepEqual(
    ACT_ONE_SOURCE_AUDIT.verifiedAbsences.map(([areaId, field]) => [areaId, field]),
    [['ogham-farmlands', 'bosses'], ['manor-ramparts', 'bosses']],
  )
  assert.ok(dataset.act.areas.every((area) => area.danger === 'UNKNOWN'))
  assert.ok(dataset.act.areas.every((area) => area.hardcoreWarning.state === 'unknown'))
})

test('the Act 1 snapshot includes branches and keeps both Ogham Manor bosses separate', () => {
  const dataset = validatedDataset()
  const branchTargets = dataset.connections
    .filter(({ fromAreaId }) => fromAreaId === 'grelwood')
    .map(({ toAreaId }) => toAreaId)
    .sort()
  assert.deepEqual(branchTargets, ['grim-tangle', 'lost-catacombs', 'red-vale', 'root-hollow'])

  const manor = dataset.act.areas.find(({ id }) => id === 'ogham-manor')
  assert.equal(manor?.bosses.state, 'known')
  if (manor?.bosses.state === 'known') {
    assert.deepEqual(manor.bosses.value.map(({ id }) => id), ['candlemass', 'count-geonor'])
  }
})
