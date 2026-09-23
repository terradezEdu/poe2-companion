import {
  SUPPORTED_CAMPAIGN_SCHEMA_VERSION,
  type AreaKnowledge,
  type BossKnowledge,
  type CampaignConnection,
  type CampaignDataset,
  type DangerRating,
  type VerificationEvidence,
  type VerificationStatus,
} from '../domain/model.ts'
import {
  type Knowledge,
  type KnownOrUnknown,
  knownKnowledge,
  unknownKnowledge,
  verifiedAbsentKnowledge,
} from '../domain/knowledge.ts'

/** The seven locked fatal conditions. UI code maps any failure to one global error. */
export type CampaignStructuralErrorCode =
  | 'DATASET_UNPARSEABLE'
  | 'UNSUPPORTED_SCHEMA'
  | 'ACT_ONE_MISSING'
  | 'ACT_ONE_EMPTY'
  | 'DUPLICATE_REQUIRED_IDENTIFIER'
  | 'MISSING_STRUCTURAL_REFERENCE'
  | 'UNKNOWN_CONNECTION_AREA'

export interface CampaignStructuralError {
  readonly code: CampaignStructuralErrorCode
  readonly path: string
}

export type CampaignValidationResult =
  | Readonly<{ ok: true; dataset: CampaignDataset }>
  | Readonly<{ ok: false; errors: readonly CampaignStructuralError[] }>

type RawRecord = Record<string, unknown>

const dangerRatings = new Set<DangerRating>(['LOW', 'MEDIUM', 'HIGH', 'EXTREME', 'UNKNOWN'])
const verificationStatuses = new Set<VerificationStatus>(['VERIFIED', 'UNKNOWN'])

/**
 * The sole production boundary that admits bundled campaign information.
 * It accepts JSON text for the parse-failure contract and object input for
 * local bundling. Optional knowledge is normalised to explicit `unknown`.
 */
export function validateCampaignDataset(input: unknown): CampaignValidationResult {
  const parsed = parseInput(input)
  if (!parsed) return failure('DATASET_UNPARSEABLE', '$')

  if (parsed.schemaVersion !== SUPPORTED_CAMPAIGN_SCHEMA_VERSION) {
    return failure('UNSUPPORTED_SCHEMA', '$.schemaVersion')
  }

  const acts = asArray(parsed.acts)
  if (!acts) return failure('ACT_ONE_MISSING', '$.acts')
  const actOneCandidates = acts.filter((act): act is RawRecord => isRecord(act) && act.id === 'act-1')
  if (actOneCandidates.length === 0) return failure('ACT_ONE_MISSING', '$.acts')
  if (actOneCandidates.length > 1) return failure('DUPLICATE_REQUIRED_IDENTIFIER', '$.acts[id=act-1]')

  const rawAct = actOneCandidates[0]
  const rawAreas = asArray(rawAct.areas)
  if (!rawAreas || rawAreas.length === 0) return failure('ACT_ONE_EMPTY', '$.acts[id=act-1].areas')

  const areaRecords = rawAreas.filter(isRecord)
  if (areaRecords.length !== rawAreas.length) return failure('MISSING_STRUCTURAL_REFERENCE', '$.acts[id=act-1].areas')

  const missingAreaId = areaRecords.findIndex((area) => !nonEmptyString(area.id))
  if (missingAreaId !== -1) {
    return failure('MISSING_STRUCTURAL_REFERENCE', `$.acts[id=act-1].areas[${missingAreaId}].id`)
  }

  const areaIds = areaRecords.map((area) => area.id as string)
  if (new Set(areaIds).size !== areaIds.length) {
    return failure('DUPLICATE_REQUIRED_IDENTIFIER', '$.acts[id=act-1].areas[].id')
  }

  const rawConnections = asArray(parsed.connections)
  if (!rawConnections) return failure('MISSING_STRUCTURAL_REFERENCE', '$.connections')
  const connectionRecords = rawConnections.filter(isRecord)
  if (connectionRecords.length !== rawConnections.length) return failure('MISSING_STRUCTURAL_REFERENCE', '$.connections')

  const missingConnectionReference = connectionRecords.findIndex(
    (connection) => !nonEmptyString(connection.fromAreaId) || !nonEmptyString(connection.toAreaId),
  )
  if (missingConnectionReference !== -1) {
    return failure('MISSING_STRUCTURAL_REFERENCE', `$.connections[${missingConnectionReference}]`)
  }

  const unknownConnection = connectionRecords.findIndex(
    (connection) => !areaIds.includes(connection.fromAreaId as string) || !areaIds.includes(connection.toAreaId as string),
  )
  if (unknownConnection !== -1) return failure('UNKNOWN_CONNECTION_AREA', `$.connections[${unknownConnection}]`)

  return {
    ok: true,
    dataset: {
      schemaVersion: SUPPORTED_CAMPAIGN_SCHEMA_VERSION,
      gameVersion: normaliseKnownOrUnknown(parsed.gameVersion),
      act: {
        id: 'act-1',
        areas: areaRecords.map(normaliseArea),
      },
      connections: connectionRecords.map(normaliseConnection),
    },
  }
}

function parseInput(input: unknown): RawRecord | undefined {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      return isRecord(parsed) ? parsed : undefined
    } catch {
      return undefined
    }
  }
  return isRecord(input) ? input : undefined
}

function failure(code: CampaignStructuralErrorCode, path: string): CampaignValidationResult {
  return { ok: false, errors: [{ code, path }] }
}

function normaliseArea(raw: RawRecord): AreaKnowledge {
  return {
    id: raw.id as string,
    name: normaliseKnowledge(raw.name, asNonEmptyString),
    level: normaliseKnowledge(raw.level, asFiniteNumber),
    danger: dangerRatings.has(raw.danger as DangerRating) ? raw.danger as DangerRating : 'UNKNOWN',
    hardcoreWarning: normaliseKnowledge(raw.hardcoreWarning, asNonEmptyString),
    rewards: normaliseKnowledge(raw.rewards, asStringArray),
    pointsOfInterest: normaliseKnowledge(raw.pointsOfInterest, asStringArray),
    curiosities: normaliseKnowledge(raw.curiosities, asStringArray),
    bosses: normaliseKnowledge(raw.bosses, asBossArray),
    verification: normaliseVerification(raw.verification),
  }
}

function normaliseBoss(raw: RawRecord, index: number): BossKnowledge {
  return {
    // Boss IDs are local record IDs; they are not graph structure.
    id: nonEmptyString(raw.id) ? raw.id : `boss-${index + 1}`,
    name: normaliseKnowledge(raw.name, asNonEmptyString),
    description: normaliseKnowledge(raw.description, asNonEmptyString),
    damageTypes: normaliseKnowledge(raw.damageTypes, asStringArray),
    weaknesses: normaliseKnowledge(raw.weaknesses, asStringArray),
    resistances: normaliseKnowledge(raw.resistances, asStringArray),
    dangerousMechanics: normaliseKnowledge(raw.dangerousMechanics, asStringArray),
    rewards: normaliseKnowledge(raw.rewards, asStringArray),
    verification: normaliseVerification(raw.verification),
  }
}

function asBossArray(value: unknown): readonly BossKnowledge[] | undefined {
  const records = asArray(value)
  // An empty raw collection carries no established boss records. Treat it as
  // insufficient knowledge at the boundary; verified absence must be explicit.
  if (!records || records.length === 0 || !records.every(isRecord)) return undefined
  return records.map(normaliseBoss)
}

function normaliseConnection(raw: RawRecord): CampaignConnection {
  return {
    fromAreaId: raw.fromAreaId as string,
    toAreaId: raw.toAreaId as string,
    direction: raw.direction === 'DIRECTED' ? 'DIRECTED' : 'BIDIRECTIONAL',
  }
}

function normaliseVerification(value: unknown): VerificationEvidence {
  const raw = isRecord(value) ? value : {}
  const sources = asStringArray(raw.sources) ?? []
  const requestedStatus = verificationStatuses.has(raw.status as VerificationStatus)
    ? raw.status as VerificationStatus
    : 'UNKNOWN'
  return {
    // A source-less record cannot truthfully make the stronger verified claim.
    status: requestedStatus === 'VERIFIED' && sources.length === 0 ? 'UNKNOWN' : requestedStatus,
    sources,
    verifiedAt: normaliseKnownOrUnknown(raw.verifiedAt),
  }
}

function normaliseKnownOrUnknown(value: unknown): KnownOrUnknown<string> {
  const knowledge = normaliseKnowledge(value, asNonEmptyString)
  if (knowledge.state === 'known' || knowledge.state === 'unknown') return knowledge
  return { state: 'unknown' }
}

function normaliseKnowledge<T>(value: unknown, decodeKnown: (candidate: unknown) => T | undefined): Knowledge<T> {
  if (isRecord(value)) {
    if (value.state === 'verified-absent') return verifiedAbsentKnowledge<T>()
    if (value.state === 'unknown') return unknownKnowledge<T>()
    if (value.state === 'known') {
      const decoded = decodeKnown(value.value)
      return decoded === undefined ? unknownKnowledge<T>() : knownKnowledge(decoded)
    }
  }
  const decoded = decodeKnown(value)
  return decoded === undefined ? unknownKnowledge<T>() : knownKnowledge(decoded)
}

function asArray(value: unknown): readonly unknown[] | undefined {
  return Array.isArray(value) ? value : undefined
}

function asStringArray(value: unknown): readonly string[] | undefined {
  const values = asArray(value)
  return values && values.length > 0 && values.every(nonEmptyString) ? values as readonly string[] : undefined
}

function asNonEmptyString(value: unknown): string | undefined {
  return nonEmptyString(value) ? value : undefined
}

function asFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
