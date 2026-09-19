/**
 * Explicitly represents what is known about a value. A missing property is
 * never a domain value: it is normalised to `unknown` at the validation
 * boundary before this type reaches application code.
 */
export type Knowledge<T> =
  | Readonly<{ state: 'known'; value: T }>
  | Readonly<{ state: 'unknown' }>
  | Readonly<{ state: 'verified-absent' }>

/** A value that can be established or unknown, but cannot be absent. */
export type KnownOrUnknown<T> = Exclude<Knowledge<T>, { state: 'verified-absent' }>

export const unknownKnowledge = <T>(): Knowledge<T> => ({ state: 'unknown' })

export const knownKnowledge = <T>(value: T): Knowledge<T> => ({ state: 'known', value })

export const verifiedAbsentKnowledge = <T>(): Knowledge<T> => ({ state: 'verified-absent' })
