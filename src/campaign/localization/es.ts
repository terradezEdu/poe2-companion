import type { DangerRating, VerificationStatus } from '../domain/model.ts'
import type { Knowledge } from '../domain/knowledge.ts'

export type SpanishGender = 'masculine' | 'feminine'
export type SpanishNumber = 'singular' | 'plural'

const dangerLabels: Readonly<Record<DangerRating, string>> = {
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  EXTREME: 'Extremo',
  UNKNOWN: 'Desconocido',
}

const verificationLabels: Readonly<Record<VerificationStatus, string>> = {
  VERIFIED: 'Verificado',
  UNKNOWN: 'Sin verificar',
}

const unknownLabels = {
  masculine: { singular: 'Desconocido', plural: 'Desconocidos' },
  feminine: { singular: 'Desconocida', plural: 'Desconocidas' },
} as const

const absenceLabels = {
  masculine: { singular: 'Ninguno', plural: 'Ningunos' },
  feminine: { singular: 'Ninguna', plural: 'Ningunas' },
} as const

export function localizeDanger(value: DangerRating): string {
  return dangerLabels[value]
}

export function localizeVerification(value: VerificationStatus): string {
  return verificationLabels[value]
}

/** Localizes the two non-value states; callers render known values themselves. */
export function localizeKnowledgeState(
  state: Exclude<Knowledge<never>['state'], 'known'>,
  gender: SpanishGender,
  number: SpanishNumber,
): string {
  return state === 'unknown' ? unknownLabels[gender][number] : absenceLabels[gender][number]
}

export function localizeKnowledge<T>(
  knowledge: Knowledge<T>,
  grammar: Readonly<{ gender: SpanishGender; number: SpanishNumber }>,
  renderKnown: (value: T) => string,
): string {
  if (knowledge.state === 'known') return renderKnown(knowledge.value)
  return localizeKnowledgeState(knowledge.state, grammar.gender, grammar.number)
}
