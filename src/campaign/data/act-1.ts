const VERIFIED_AT = '2026-09-22'

const unknown = { state: 'unknown' } as const
const verifiedAbsent = { state: 'verified-absent' } as const
const known = <T>(value: T) => ({ state: 'known', value } as const)

const areaSource = (slug: string) =>
  `PoE2DB (area record, Spanish locale): https://poe2db.tw/sp/${slug}`

const bossSource = (slugOrSource: string) => slugOrSource.startsWith('PoE2DB')
  ? slugOrSource
  : `PoE2DB (boss record, Spanish locale): https://poe2db.tw/sp/${slugOrSource}`

const verification = (source: string, additionalSources: readonly string[] = []) => ({
  status: 'VERIFIED',
  sources: [source, ...additionalSources],
  verifiedAt: VERIFIED_AT,
} as const)

const boss = (id: string, name: string, sourceSlug: string) => ({
  id,
  name,
  description: unknown,
  damageTypes: unknown,
  weaknesses: unknown,
  resistances: unknown,
  dangerousMechanics: unknown,
  rewards: unknown,
  verification: verification(bossSource(sourceSlug)),
})

type BossInput = ReturnType<typeof boss>

function area(
  id: string,
  name: string,
  level: number | typeof unknown,
  sourceSlug: string,
  bosses: readonly BossInput[] | typeof unknown | typeof verifiedAbsent,
  additionalSources: readonly string[] = [],
) {
  return {
    id,
    name,
    level,
    danger: 'UNKNOWN',
    hardcoreWarning: unknown,
    rewards: unknown,
    pointsOfInterest: unknown,
    curiosities: unknown,
    bosses: Array.isArray(bosses) ? known(bosses) : bosses,
    verification: verification(areaSource(sourceSlug), additionalSources),
  } as const
}

/**
 * The sole bundled Campaign Map v0.1 input snapshot.
 *
 * Facts not directly established by the accepted source families deliberately
 * remain `unknown`. In particular, monster statistics are not translated into
 * player-facing combat advice, and a missing boss field is not treated as proof
 * that an area has no boss.
 */
export const ACT_ONE_CAMPAIGN_INPUT = {
  schemaVersion: 'campaign-map/v0.1',
  gameVersion: known('0.5.4'),
  acts: [
    {
      id: 'act-1',
      areas: [
        area('riverbank', 'La orilla del río', 1, 'The_Riverbank', [
          boss('bloated-miller', 'El molinero hinchado', 'The_Bloated_Miller'),
        ]),
        area('clearfell-encampment', 'Campamento de Sierraclara', 15, 'Clearfell_Encampment', unknown),
        area('clearfell', 'Sierraclara', 2, 'Clearfell', [
          boss('beira', 'Beira, de la manada putrefacta', 'Beira_of_the_Rotten_Pack'),
        ]),
        area('mud-burrow', 'Lodazal', 3, 'Mud_Burrow', [
          boss('devourer', 'El devorador', 'The_Devourer'),
        ]),
        area('grelwood', 'El bosque singular', 4, 'The_Grelwood', [
          boss('brambleghast', 'El horror de espinas', 'The_Brambleghast'),
        ]),
        area('lost-catacombs', 'Catacumbas perdidas', 12, 'Lost_Catacombs', unknown),
        area('red-vale', 'El valle rojo', 5, 'The_Red_Vale', [
          boss('rust-king', 'El rey del óxido', 'The_Rust_King'),
        ]),
        area('grim-tangle', 'El enredo sombrío', 6, 'The_Grim_Tangle', [
          boss('rotten-druid-grim-tangle', 'El Druida putrefacto', 'The_Rotten_Druid'),
        ]),
        area('cemetery-of-the-eternals', 'Cementerio de los eternos', 7, 'Cemetery_of_the_Eternals', [
          boss('lachlann', 'Lachlann del lamento eterno', 'Lachlann_of_Endless_Lament'),
        ]),
        area('mausoleum-of-the-praetor', 'Mausoleo del pretor', unknown, 'Mausoleum_of_the_Praetor', [
          boss(
            'draven',
            'Draven, el Pretor eterno',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
          ),
        ]),
        area('tomb-of-the-consort', 'Tumba de la consorte', unknown, 'Tomb_of_the_Consort', [
          boss(
            'asinia',
            'Asinia, la consorte del pretor',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
          ),
        ]),
        area('root-hollow', 'Gruta enraizada', 15, 'Root_Hollow', [
          boss('rotten-druid-root-hollow', 'El Druida putrefacto', 'The_Rotten_Druid'),
        ]),
        area('hunting-grounds', 'Terrenos de caza', 10, 'Hunting_Grounds', [
          boss('crowbell', 'El cuervo repicador', 'The_Crowbell'),
        ]),
        area('freythorn', 'Villafrey', 11, 'Freythorn', [
          boss('king-in-the-mists', 'El rey de las nieblas', 'The_King_in_the_Mists'),
        ]),
        area('ogham-farmlands', 'Tierras de cultivo de Ogham', 12, 'Ogham_Farmlands', verifiedAbsent, [
          'PoE2DB Act 1 guide (explicit “Bosses: None”): https://poe2db.tw/us/Act_1',
        ]),
        area('ogham-village', 'Pueblo de Ogham', 13, 'Ogham_Village', [
          boss('executioner', 'El verdugo', 'The_Executioner'),
        ]),
        area('manor-ramparts', 'Las murallas de la mansión', 14, 'The_Manor_Ramparts', verifiedAbsent, [
          'PoE2DB Act 1 guide (explicit “Bosses: None”): https://poe2db.tw/us/Act_1',
        ]),
        area('ogham-manor', 'Mansión de Ogham', 15, 'Ogham_Manor', [
          boss(
            'candlemass',
            'Cirio, el Ritual viviente',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
          ),
          boss('count-geonor', 'El conde Geonor', 'Count_Geonor'),
        ]),
      ],
    },
  ],
  connections: [
    { fromAreaId: 'riverbank', toAreaId: 'clearfell-encampment' },
    { fromAreaId: 'clearfell-encampment', toAreaId: 'clearfell' },
    { fromAreaId: 'clearfell', toAreaId: 'mud-burrow' },
    { fromAreaId: 'clearfell', toAreaId: 'grelwood' },
    { fromAreaId: 'grelwood', toAreaId: 'lost-catacombs' },
    { fromAreaId: 'grelwood', toAreaId: 'red-vale' },
    { fromAreaId: 'grelwood', toAreaId: 'grim-tangle' },
    { fromAreaId: 'grelwood', toAreaId: 'root-hollow' },
    { fromAreaId: 'grim-tangle', toAreaId: 'cemetery-of-the-eternals' },
    { fromAreaId: 'cemetery-of-the-eternals', toAreaId: 'mausoleum-of-the-praetor' },
    { fromAreaId: 'cemetery-of-the-eternals', toAreaId: 'tomb-of-the-consort' },
    { fromAreaId: 'cemetery-of-the-eternals', toAreaId: 'hunting-grounds' },
    { fromAreaId: 'hunting-grounds', toAreaId: 'freythorn' },
    { fromAreaId: 'hunting-grounds', toAreaId: 'ogham-farmlands' },
    { fromAreaId: 'ogham-farmlands', toAreaId: 'ogham-village' },
    { fromAreaId: 'ogham-village', toAreaId: 'manor-ramparts', direction: 'DIRECTED' },
    { fromAreaId: 'manor-ramparts', toAreaId: 'ogham-manor' },
  ],
} as const
