import assert from 'node:assert/strict'
import test from 'node:test'
import { ACT_ONE_CAMPAIGN_INPUT, ACT_ONE_SOURCE_AUDIT } from '../../src/campaign/data/index.ts'
import { validateCampaignDataset } from '../../src/campaign/validation/campaign-validator.ts'

const bossFields = [
  'description',
  'damageTypes',
  'weaknesses',
  'resistances',
  'dangerousMechanics',
  'rewards',
] as const

const expectedBossSourceUrls: Readonly<Record<string, readonly string[]>> = {
  'bloated-miller': [
    'https://poe2db.tw/sp/The_Bloated_Miller',
    'https://www.poe2wiki.net/wiki/The_Bloated_Miller',
  ],
  beira: [
    'https://poe2db.tw/sp/Beira_of_the_Rotten_Pack',
    'https://www.poe2wiki.net/wiki/Beira_of_the_Rotten_Pack',
    'https://www.poe2wiki.net/wiki/Head_of_the_Winter_Wolf',
  ],
  devourer: [
    'https://poe2db.tw/sp/The_Devourer',
    'https://www.poe2wiki.net/wiki/The_Devourer',
    'https://www.poe2wiki.net/wiki/Mud_Burrow',
    'https://www.poe2wiki.net/wiki/Treacherous_Ground',
  ],
  brambleghast: [
    'https://poe2db.tw/sp/The_Brambleghast',
    'https://www.poe2wiki.net/wiki/The_Brambleghast',
  ],
  'rust-king': [
    'https://poe2db.tw/sp/The_Rust_King',
    'https://www.poe2wiki.net/wiki/The_Rust_King',
  ],
  'rotten-druid-grim-tangle': ['https://poe2db.tw/sp/The_Rotten_Druid'],
  lachlann: [
    'https://poe2db.tw/sp/Lachlann_of_Endless_Lament',
    'https://www.poe2wiki.net/wiki/Lachlann_of_Endless_Lament',
  ],
  draven: [
    'https://poe2db.tw/sp/Act_1',
    'https://poe2db.tw/sp/Draven%2C_the_Eternal_Praetor',
    'https://www.poe2wiki.net/wiki/Draven%2C_the_Eternal_Praetor',
    'https://www.poe2wiki.net/wiki/Draven%27s_Memorial_Key_Piece',
  ],
  asinia: [
    'https://poe2db.tw/sp/Act_1',
    'https://poe2db.tw/sp/Asinia%2C_the_Praetors_Consort',
    'https://www.poe2wiki.net/wiki/Asinia%2C_the_Praetor%27s_Consort',
    'https://www.poe2wiki.net/wiki/Asinia%27s_Memorial_Key_Piece',
  ],
  'rotten-druid-root-hollow': ['https://poe2db.tw/sp/The_Rotten_Druid'],
  crowbell: [
    'https://poe2db.tw/sp/The_Crowbell',
    'https://www.poe2wiki.net/wiki/The_Crowbell',
  ],
  'king-in-the-mists': [
    'https://poe2db.tw/sp/The_King_in_the_Mists',
    'https://www.poe2wiki.net/wiki/The_King_in_the_Mists_%28Freythorn%29',
    'https://www.poe2wiki.net/wiki/Gembloom_Skull',
  ],
  executioner: [
    'https://poe2db.tw/sp/The_Executioner',
    'https://www.poe2wiki.net/wiki/The_Executioner',
    'https://www.poe2wiki.net/wiki/Ogham_Village',
    'https://www.poe2wiki.net/wiki/The_Trail_of_Corruption',
  ],
  candlemass: [
    'https://poe2db.tw/sp/Act_1',
    'https://poe2db.tw/sp/Candlemass%2C_the_Living_Rite',
    'https://www.poe2wiki.net/wiki/Candlemass%2C_the_Living_Rite',
    'https://www.poe2wiki.net/wiki/Candlemass%27_Essence',
  ],
  'count-geonor': [
    'https://poe2db.tw/sp/Count_Geonor',
    'https://www.poe2wiki.net/wiki/Count_Geonor',
    'https://www.poe2wiki.net/wiki/The_Mad_Wolf_of_Ogham',
  ],
}

const acceptedBossSourcePatterns = [
  /^PoE2DB \(boss (?:record|listing), Spanish locale\): https:\/\/poe2db\.tw\/sp\/[^\s]+$/,
  /^PoE2 Wiki \((?:boss|item|area|quest) record, English\): https:\/\/www\.poe2wiki\.net\/wiki\/[^\s]+$/,
]

function sourceUrl(source: string) {
  const match = source.match(/https:\/\/\S+$/)
  assert.ok(match, `source does not end in a well-formed HTTPS URL: ${source}`)
  return match[0]
}

function canonicalSourceKey(source: string) {
  const url = new URL(source)
  const path = url.hostname === 'poe2db.tw'
    ? url.pathname.replace(/^\/(?:sp|us)\//, '/')
    : url.pathname
  return `${url.hostname}${path}`
}

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
  let bossCount = 0

  for (const area of dataset.act.areas) {
    assert.equal(area.verification.status, 'VERIFIED')
    assert.ok(area.verification.sources.length >= 1)
    assert.match(area.verification.sources[0], /^PoE2DB \(area record, Spanish locale\): /)
    assert.deepEqual(area.verification.verifiedAt, { state: 'known', value: '2026-09-22' })

    if (area.bosses.state !== 'known') continue
    for (const boss of area.bosses.value) {
      bossCount += 1
      assert.equal(boss.verification.status, 'VERIFIED')
      assert.ok(boss.verification.sources.length >= 1 && boss.verification.sources.length <= 4)
      assert.match(boss.verification.sources[0], /^PoE2DB \(boss (record|listing), Spanish locale\): /)
      assert.notEqual(boss.verification.sources[0], area.verification.sources[0])
      assert.deepEqual(boss.verification.verifiedAt, { state: 'known', value: '2026-09-28' })

      const uniqueSources = new Set(boss.verification.sources)
      assert.equal(uniqueSources.size, boss.verification.sources.length, `${boss.id} has duplicate source entries`)
      for (const source of boss.verification.sources) {
        assert.equal(source, source.trim(), `${boss.id} has source whitespace`)
        assert.ok(
          acceptedBossSourcePatterns.some((pattern) => pattern.test(source)),
          `${boss.id} has a source outside the accepted source families: ${source}`,
        )
        assert.doesNotThrow(() => new URL(sourceUrl(source)))
      }

      assert.deepEqual(
        boss.verification.sources.map(sourceUrl),
        expectedBossSourceUrls[boss.id],
        `${boss.id} source provenance is not scoped to its accepted evidence`,
      )
    }
  }

  assert.equal(bossCount, 15)
  assert.equal(Object.keys(expectedBossSourceUrls).length, 15)
})

test('all boss enrichment fields agree with the 90-state source audit', () => {
  const dataset = validatedDataset()
  const productionBosses = new Map(dataset.act.areas.flatMap((area) =>
    area.bosses.state === 'known' ? area.bosses.value.map((boss) => [boss.id, boss] as const) : [],
  ))
  const auditBosses = new Map(ACT_ONE_SOURCE_AUDIT.bossFieldAudit.map((entry) => [entry.bossId, entry] as const))

  assert.equal(productionBosses.size, 15)
  assert.equal(auditBosses.size, 15)
  assert.deepEqual([...productionBosses.keys()].sort(), [...auditBosses.keys()].sort())

  let checkedFields = 0
  for (const [bossId, audit] of auditBosses) {
    const boss = productionBosses.get(bossId)
    assert.ok(boss, `missing production boss for audit entry ${bossId}`)

    const productionSourceKeys = new Set(boss.verification.sources.map(sourceUrl).map(canonicalSourceKey))
    for (const field of bossFields) {
      checkedFields += 1
      const auditedField = audit.fields[field]
      const productionField = boss[field]

      assert.ok(auditedField.sources.length >= 1, `${bossId}.${field} has no audit provenance`)
      for (const source of auditedField.sources) {
        const url = new URL(source)
        assert.equal(url.protocol, 'https:')
        assert.ok(url.hostname === 'poe2db.tw' || url.hostname === 'www.poe2wiki.net')
        assert.ok(
          productionSourceKeys.has(canonicalSourceKey(source)),
          `${bossId}.${field} audit source is absent from the boss record: ${source}`,
        )
      }

      if (auditedField.classification === 'SUPPORTED_FACT') {
        assert.equal(productionField.state, 'known', `${bossId}.${field} lost a supported fact`)
        if (productionField.state === 'known') assert.deepEqual(productionField.value, auditedField.value)
      } else {
        assert.equal(
          productionField.state,
          'unknown',
          `${bossId}.${field} must remain UNKNOWN for ${auditedField.classification}`,
        )
      }
    }
  }

  assert.equal(checkedFields, 90)
})

test('human data decisions and unresolved conflicts survive validation without inference', () => {
  const dataset = validatedDataset()
  const bosses = new Map(dataset.act.areas.flatMap((area) =>
    area.bosses.state === 'known' ? area.bosses.value.map((boss) => [boss.id, boss] as const) : [],
  ))
  const boss = (id: string) => {
    const record = bosses.get(id)
    assert.ok(record, `missing boss ${id}`)
    return record
  }

  assert.deepEqual(boss('beira').weaknesses, { state: 'known', value: ['Fuego'] })
  assert.deepEqual(boss('rust-king').weaknesses, { state: 'known', value: ['Rayo'] })
  assert.deepEqual(boss('rust-king').resistances, { state: 'known', value: ['Fuego'] })
  assert.equal(boss('beira').dangerousMechanics.state, 'known')
  assert.deepEqual(boss('devourer').rewards, {
    state: 'known',
    value: [
      'Gema de habilidad sin tallar de nivel 2 que deja caer el jefe.',
      'Gema de asistencia sin tallar de nivel 1 y 100 de oro por completar Terreno traicionero tras derrotarlo.',
    ],
  })

  assert.equal(boss('lachlann').damageTypes.state, 'unknown')
  assert.equal(boss('draven').damageTypes.state, 'unknown')
  assert.equal(boss('asinia').dangerousMechanics.state, 'unknown')
  assert.equal(boss('rotten-druid-grim-tangle').damageTypes.state, 'unknown')

  assert.deepEqual(boss('executioner').resistances, { state: 'known', value: ['Fuego'] })
  assert.deepEqual(boss('king-in-the-mists').resistances, { state: 'known', value: ['Caos'] })
  assert.deepEqual(boss('count-geonor').resistances, { state: 'known', value: ['Frío'] })
  for (const id of ['executioner', 'king-in-the-mists', 'count-geonor']) {
    const resistances = boss(id).resistances
    assert.equal(resistances.state, 'known')
    if (resistances.state === 'known') assert.ok(resistances.value.every((value) => !value.includes('%')))
  }

  assert.deepEqual(boss('count-geonor').description, { state: 'known', value: 'Jefe final del Acto 1.' })
  assert.deepEqual(
    ACT_ONE_SOURCE_AUDIT.unresolvedSourceConflicts.map(({ subject }) => subject),
    [
      'lachlann-damage-types',
      'executioner-fire-resistance-magnitude',
      'king-in-the-mists-chaos-resistance-magnitude',
      'count-geonor-cold-resistance-magnitude',
      'count-geonor-campaign-location-name',
    ],
  )
  assert.deepEqual(
    ACT_ONE_SOURCE_AUDIT.semanticInferenceDecisions.map(({ id, status }) => [id, status]),
    [
      ['resistance-values-to-weakness', 'REJECTED_BY_HUMAN_DATA_DECISION'],
      ['skill-damage-to-boss-damage-types', 'REJECTED_BY_HUMAN_DATA_DECISION_FOR_THIS_CYCLE'],
      ['encounter-list-to-dangerous-mechanics', 'APPROVED_BY_HUMAN_DATA_DECISION_WITH_CONSTRAINTS'],
      ['kill-or-quest-outcome-to-boss-reward', 'APPROVED_BY_HUMAN_DATA_DECISION_WITH_CONSTRAINTS'],
    ],
  )
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
