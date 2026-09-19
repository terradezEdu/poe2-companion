import type { Knowledge, KnownOrUnknown } from './knowledge.ts'

/** The single local schema admitted by the v0.1 campaign-data boundary. */
export const SUPPORTED_CAMPAIGN_SCHEMA_VERSION = 'campaign-map/v0.1' as const

export type DangerRating = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' | 'UNKNOWN'
export type VerificationStatus = 'VERIFIED' | 'UNKNOWN'
export type ConnectionDirection = 'BIDIRECTIONAL' | 'DIRECTED'

export interface VerificationEvidence {
  readonly status: VerificationStatus
  readonly sources: readonly string[]
  readonly verifiedAt: KnownOrUnknown<string>
}

export interface BossKnowledge {
  /** Stable local identity; boss facts never belong to the enclosing area. */
  readonly id: string
  readonly name: Knowledge<string>
  readonly description: Knowledge<string>
  readonly damageTypes: Knowledge<readonly string[]>
  readonly weaknesses: Knowledge<readonly string[]>
  readonly resistances: Knowledge<readonly string[]>
  readonly dangerousMechanics: Knowledge<readonly string[]>
  readonly rewards: Knowledge<readonly string[]>
  readonly verification: VerificationEvidence
}

export interface AreaKnowledge {
  /** Stable graph identity. It is intentionally separate from display name. */
  readonly id: string
  readonly name: Knowledge<string>
  readonly level: Knowledge<number>
  /** Danger is area editorial guidance, never a boss property. */
  readonly danger: DangerRating
  readonly hardcoreWarning: Knowledge<string>
  readonly rewards: Knowledge<readonly string[]>
  readonly pointsOfInterest: Knowledge<readonly string[]>
  readonly curiosities: Knowledge<readonly string[]>
  readonly bosses: Knowledge<readonly BossKnowledge[]>
  readonly verification: VerificationEvidence
}

export interface ActOne {
  readonly id: 'act-1'
  readonly areas: readonly AreaKnowledge[]
}

export interface CampaignConnection {
  readonly fromAreaId: string
  readonly toAreaId: string
  /** Omitted direction in input is normalised to this explicit value. */
  readonly direction: ConnectionDirection
}

/**
 * The validated, application-facing representation of the single bundled
 * Act 1 snapshot. It contains no data-loading or dataset-selection capability.
 */
export interface CampaignDataset {
  readonly schemaVersion: typeof SUPPORTED_CAMPAIGN_SCHEMA_VERSION
  readonly gameVersion: KnownOrUnknown<string>
  readonly act: ActOne
  readonly connections: readonly CampaignConnection[]
}
