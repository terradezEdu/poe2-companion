import { campaignFixtures, recordVerificationFixtureValues, twoBossFixtureValues } from './campaign-fixtures.ts'

type FixtureKnowledge = { state: 'known' | 'unknown' | 'verified-absent'; value?: unknown }
const known = (value: unknown): FixtureKnowledge => ({ state: 'known', value })
const unknown = (): FixtureKnowledge => ({ state: 'unknown' })
const absent = (): FixtureKnowledge => ({ state: 'verified-absent' })

function boss(id: string, name: string) {
  return {
    id, name, description: known(`${name}: descripción`), damageTypes: known(['Daño físico']),
    weaknesses: known(['Débil al frío']), resistances: absent(),
    dangerousMechanics: known(['Golpe de onda']), rewards: known(['Recompensa Alfa']),
    verification: { status: 'VERIFIED', sources: ['Fuente Alfa'], verifiedAt: '2025-01-01' },
  }
}

function baseInput() {
  return {
    schemaVersion: 'campaign-map/v0.1', gameVersion: '0.1.0',
    acts: [{ id: 'act-1', areas: [
      {
        id: 'area-a', name: 'Área A', level: 3, danger: 'MEDIUM',
        hardcoreWarning: known('Precaución en el área'), rewards: known(['Recompensa A']),
        pointsOfInterest: known(['Punto A']), curiosities: known(['Curiosidad A']),
        bosses: known([boss('boss-alfa', 'Jefe Alfa')]),
        verification: { status: 'VERIFIED', sources: ['Fuente Área'], verifiedAt: '2025-02-01' },
      },
      {
        id: 'area-b', name: 'Área B', level: 4, danger: 'UNKNOWN',
        hardcoreWarning: unknown(), rewards: unknown(), pointsOfInterest: unknown(),
        curiosities: unknown(), bosses: unknown(),
        verification: { status: 'UNKNOWN', sources: [], verifiedAt: unknown() },
      },
      {
        id: 'area-c', name: 'Área C', level: 5, danger: 'LOW',
        hardcoreWarning: absent(), rewards: absent(), pointsOfInterest: absent(),
        curiosities: absent(), bosses: absent(),
        verification: { status: 'UNKNOWN', sources: [], verifiedAt: unknown() },
      },
    ] }],
    connections: [
      { fromAreaId: 'area-a', toAreaId: 'area-b' },
      { fromAreaId: 'area-b', toAreaId: 'area-c', direction: 'DIRECTED' },
      { fromAreaId: 'area-a', toAreaId: 'area-c' },
    ],
  }
}

export function campaignExperienceFixture(fixture: string): unknown {
  const input = baseInput()
  const area = input.acts[0].areas[0]
  const alfa = boss('boss-alfa', 'Jefe Alfa')
  const beta = boss('boss-beta', 'Jefe Beta')
  beta.damageTypes = known([twoBossFixtureValues.beta.damage])
  beta.weaknesses = known([twoBossFixtureValues.beta.weaknesses])
  beta.dangerousMechanics = known([twoBossFixtureValues.beta.mechanics])
  beta.rewards = known([twoBossFixtureValues.beta.reward])
  beta.verification = { status: 'UNKNOWN', sources: [twoBossFixtureValues.beta.source], verifiedAt: twoBossFixtureValues.beta.verifiedAt }
  alfa.damageTypes = known([twoBossFixtureValues.alfa.damage])
  alfa.weaknesses = known([twoBossFixtureValues.alfa.weaknesses])
  alfa.dangerousMechanics = known([twoBossFixtureValues.alfa.mechanics])
  alfa.rewards = known([twoBossFixtureValues.alfa.reward])
  alfa.verification = { status: 'VERIFIED', sources: [twoBossFixtureValues.alfa.source], verifiedAt: twoBossFixtureValues.alfa.verifiedAt }

  switch (fixture) {
    case campaignFixtures.areaATwoBosses:
      area.bosses = known([alfa, beta])
      break
    case campaignFixtures.dangerHigh:
      area.danger = 'HIGH'
      area.hardcoreWarning = known('Daño físico explosivo')
      area.bosses = known([alfa, beta])
      break
    case campaignFixtures.dangerLow: area.danger = 'LOW'; break
    case campaignFixtures.dangerMedium: area.danger = 'MEDIUM'; break
    case campaignFixtures.dangerExtreme: area.danger = 'EXTREME'; break
    case campaignFixtures.dangerUnknown: area.danger = 'UNKNOWN'; break
    case campaignFixtures.knowledgeUnknown:
      area.bosses = unknown(); area.rewards = unknown(); break
    case campaignFixtures.knowledgeUnknownFemininePlural:
      area.rewards = unknown(); break
    case campaignFixtures.knowledgeVerifiedAbsence:
      area.bosses = absent(); area.rewards = absent(); break
    case campaignFixtures.knowledgeVerifiedAbsentFeminineSingular:
      area.rewards = absent(); break
    case campaignFixtures.bossKnowledgeIndependent:
      alfa.weaknesses = unknown(); beta.weaknesses = absent(); area.bosses = known([alfa, beta]); break
    case campaignFixtures.areaBossVerificationIndependent:
      area.verification = { status: 'VERIFIED', sources: [recordVerificationFixtureValues.area.source], verifiedAt: recordVerificationFixtureValues.area.verifiedAt }
      alfa.verification = { status: 'UNKNOWN', sources: [recordVerificationFixtureValues.boss.source], verifiedAt: recordVerificationFixtureValues.boss.verifiedAt }
      area.bosses = known([alfa]); break
    case campaignFixtures.verifiedBossUnknownWeakness:
      alfa.weaknesses = unknown(); area.bosses = known([alfa]); break
    case campaignFixtures.optionalKnowledgeMissing:
      alfa.description = unknown(); alfa.weaknesses = unknown(); area.bosses = known([alfa]); break
    case campaignFixtures.verificationUnknown:
      area.verification = { status: 'UNKNOWN', sources: [], verifiedAt: unknown() }; break
    case campaignFixtures.versionUnknown:
      return { ...input, gameVersion: unknown() }
    case campaignFixtures.structurallyInvalidParse: return '{ invalid json'
    case campaignFixtures.structurallyInvalidSchema: return { ...input, schemaVersion: 'unsupported' }
    case campaignFixtures.structurallyInvalidMissingAct1: return { ...input, acts: [] }
    case campaignFixtures.structurallyInvalidEmptyAct1: return { ...input, acts: [{ id: 'act-1', areas: [] }] }
    case campaignFixtures.structurallyInvalidDuplicateId:
      return { ...input, acts: [{ id: 'act-1', areas: [area, area] }] }
    case campaignFixtures.structurallyInvalidMissingReference:
      return { ...input, connections: [{ fromAreaId: 'area-a' }] }
    case campaignFixtures.structurallyInvalidUnknownConnectionArea:
      return { ...input, connections: [{ fromAreaId: 'area-a', toAreaId: 'missing' }] }
  }
  return input
}
