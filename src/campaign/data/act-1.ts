const AREA_VERIFIED_AT = '2026-09-22'
const BOSS_VERIFIED_AT = '2026-09-28'

const unknown = { state: 'unknown' } as const
const verifiedAbsent = { state: 'verified-absent' } as const
const known = <T>(value: T) => ({ state: 'known', value } as const)

const areaSource = (slug: string) =>
  `PoE2DB (area record, Spanish locale): https://poe2db.tw/sp/${slug}`

const bossSource = (slugOrSource: string) => slugOrSource.startsWith('PoE2DB')
  ? slugOrSource
  : `PoE2DB (boss record, Spanish locale): https://poe2db.tw/sp/${slugOrSource}`

const wikiBossSource = (slug: string) =>
  `PoE2 Wiki (boss record, English): https://www.poe2wiki.net/wiki/${slug}`

const wikiItemSource = (slug: string) =>
  `PoE2 Wiki (item record, English): https://www.poe2wiki.net/wiki/${slug}`

const wikiAreaSource = (slug: string) =>
  `PoE2 Wiki (area record, English): https://www.poe2wiki.net/wiki/${slug}`

const wikiQuestSource = (slug: string) =>
  `PoE2 Wiki (quest record, English): https://www.poe2wiki.net/wiki/${slug}`

const verification = (source: string, verifiedAt: string, additionalSources: readonly string[] = []) => ({
  status: 'VERIFIED',
  sources: [source, ...additionalSources],
  verifiedAt,
} as const)

interface BossFacts {
  readonly description: typeof unknown | ReturnType<typeof known<string>>
  readonly damageTypes: typeof unknown | ReturnType<typeof known<readonly string[]>>
  readonly weaknesses: typeof unknown | ReturnType<typeof known<readonly string[]>>
  readonly resistances: typeof unknown | ReturnType<typeof known<readonly string[]>>
  readonly dangerousMechanics: typeof unknown | ReturnType<typeof known<readonly string[]>>
  readonly rewards: typeof unknown | ReturnType<typeof known<readonly string[]>>
}

const boss = (
  id: string,
  name: string,
  sourceSlug: string,
  facts: BossFacts,
  additionalSources: readonly string[] = [],
) => ({
  id,
  name,
  description: facts.description,
  damageTypes: facts.damageTypes,
  weaknesses: facts.weaknesses,
  resistances: facts.resistances,
  dangerousMechanics: facts.dangerousMechanics,
  rewards: facts.rewards,
  verification: verification(bossSource(sourceSlug), BOSS_VERIFIED_AT, additionalSources),
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
    verification: verification(areaSource(sourceSlug), AREA_VERIFIED_AT, additionalSources),
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
          boss('bloated-miller', 'El molinero hinchado', 'The_Bloated_Miller', {
            description: known('Monstruo único que se encuentra en La orilla del río.'),
            damageTypes: known(['Físico']),
            weaknesses: unknown,
            resistances: unknown,
            dangerousMechanics: known([
              'Carga a corta distancia que no se puede bloquear.',
              'Golpe con tronco precedido de una preparación que genera una onda de choque frontal.',
              'Rugido que invoca varios Ahogados.',
            ]),
            rewards: known(['Experiencia suficiente para alcanzar el nivel 2 si se derrota antes de ese nivel.']),
          }, [wikiBossSource('The_Bloated_Miller')]),
        ]),
        area('clearfell-encampment', 'Campamento de Sierraclara', 15, 'Clearfell_Encampment', unknown),
        area('clearfell', 'Sierraclara', 2, 'Clearfell', [
          boss('beira', 'Beira, de la manada putrefacta', 'Beira_of_the_Rotten_Pack', {
            description: known('Monstruo único que se encuentra en Sierraclara.'),
            damageTypes: known(['Físico', 'Frío']),
            weaknesses: known(['Fuego']),
            resistances: known(['Frío']),
            dangerousMechanics: known([
              'Círculos mágicos que explotan tras una demora e infligen daño de frío intenso.',
              'Invoca lobos no muertos durante el encuentro.',
              'Canaliza una nova de escarcha que se expande lentamente.',
              'Círculos rúnicos anticipan la aparición de púas de hielo.',
            ]),
            rewards: known(['Objeto de misión que otorga permanentemente +10 % a la resistencia al frío.']),
          }, [
            wikiBossSource('Beira_of_the_Rotten_Pack'),
            wikiItemSource('Head_of_the_Winter_Wolf'),
          ]),
        ]),
        area('mud-burrow', 'Lodazal', 3, 'Mud_Burrow', [
          boss('devourer', 'El devorador', 'The_Devourer', {
            description: known('Devorador único que se encuentra en Lodazal.'),
            damageTypes: known(['Físico', 'Caos']),
            weaknesses: unknown,
            resistances: known(['Físico']),
            dangerousMechanics: known([
              'Proyectiles verdes que aplican veneno y un proyectil de mortero dirigido a los pies del jugador.',
              'Un área roja anticipa su salida del subsuelo, que también genera Larvas de carne.',
              'Excava continuamente por la arena; solo la cabeza y la cola pueden recibir daño directo.',
            ]),
            rewards: known([
              'Gema de habilidad sin tallar de nivel 2 que deja caer el jefe.',
              'Gema de asistencia sin tallar de nivel 1 y 100 de oro por completar Terreno traicionero tras derrotarlo.',
            ]),
          }, [
            wikiBossSource('The_Devourer'),
            wikiAreaSource('Mud_Burrow'),
            wikiQuestSource('Treacherous_Ground'),
          ]),
        ]),
        area('grelwood', 'El bosque singular', 4, 'The_Grelwood', [
          boss('brambleghast', 'El horror de espinas', 'The_Brambleghast', {
            description: known('Monstruo único que se encuentra en El bosque singular.'),
            damageTypes: known(['Físico']),
            weaknesses: known(['Fuego']),
            resistances: known(['Físico', 'Frío']),
            dangerousMechanics: known([
              'Lanza un orbe morado que dispara proyectiles en círculo mientras se desplaza.',
              'Invoca varias Enredaderas feroces que atacan con barridos o estocadas.',
            ]),
            rewards: unknown,
          }, [wikiBossSource('The_Brambleghast')]),
        ]),
        area('lost-catacombs', 'Catacumbas perdidas', 12, 'Lost_Catacombs', unknown),
        area('red-vale', 'El valle rojo', 5, 'The_Red_Vale', [
          boss('rust-king', 'El rey del óxido', 'The_Rust_King', {
            description: known('Monstruo único que se encuentra en El valle rojo.'),
            damageTypes: known(['Físico']),
            weaknesses: known(['Rayo']),
            resistances: known(['Fuego']),
            dangerousMechanics: unknown,
            rewards: known(['Tercer objeto de misión necesario para avanzar Secretos en la oscuridad.']),
          }, [wikiBossSource('The_Rust_King')]),
        ]),
        area('grim-tangle', 'El enredo sombrío', 6, 'The_Grim_Tangle', [
          boss('rotten-druid-grim-tangle', 'El Druida putrefacto', 'The_Rotten_Druid', {
            description: known('Monstruo único no muerto que aparece en El enredo sombrío y Gruta enraizada.'),
            damageTypes: unknown,
            weaknesses: unknown,
            resistances: unknown,
            dangerousMechanics: unknown,
            rewards: unknown,
          }),
        ]),
        area('cemetery-of-the-eternals', 'Cementerio de los eternos', 7, 'Cemetery_of_the_Eternals', [
          boss('lachlann', 'Lachlann del lamento eterno', 'Lachlann_of_Endless_Lament', {
            description: known('Monstruo único que se encuentra en el Cementerio de los eternos.'),
            damageTypes: unknown,
            weaknesses: unknown,
            resistances: known(['Físico']),
            dangerousMechanics: known(['Varias formas de golpes cuerpo a cuerpo contra el suelo.']),
            rewards: known(['Anillo del conde Lachlann, necesario para completar una misión.']),
          }, [wikiBossSource('Lachlann_of_Endless_Lament')]),
        ]),
        area('mausoleum-of-the-praetor', 'Mausoleo del pretor', unknown, 'Mausoleum_of_the_Praetor', [
          boss(
            'draven',
            'Draven, el Pretor eterno',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
            {
              description: known('Monstruo único que se encuentra en el Mausoleo del pretor.'),
              damageTypes: unknown,
              weaknesses: unknown,
              resistances: known(['Fuego']),
              dangerousMechanics: known([
                'Los fantasmas de la arena dejan círculos verdes al desaparecer.',
                'Si un fantasma desaparece junto al cadáver de un Caballero eterno, el caballero reaparece.',
              ]),
              rewards: known(['Pieza de llave conmemorativa necesaria para avanzar la misión.']),
            },
            [
              bossSource('Draven%2C_the_Eternal_Praetor'),
              wikiBossSource('Draven%2C_the_Eternal_Praetor'),
              wikiItemSource('Draven%27s_Memorial_Key_Piece'),
            ],
          ),
        ]),
        area('tomb-of-the-consort', 'Tumba de la consorte', unknown, 'Tomb_of_the_Consort', [
          boss(
            'asinia',
            'Asinia, la consorte del pretor',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
            {
              description: known('Monstruo único que se encuentra en la Tumba de la consorte.'),
              damageTypes: unknown,
              weaknesses: unknown,
              resistances: known(['Frío']),
              dangerousMechanics: unknown,
              rewards: known(['Pieza de llave conmemorativa necesaria para avanzar la misión.']),
            },
            [
              bossSource('Asinia%2C_the_Praetors_Consort'),
              wikiBossSource('Asinia%2C_the_Praetor%27s_Consort'),
              wikiItemSource('Asinia%27s_Memorial_Key_Piece'),
            ],
          ),
        ]),
        area('root-hollow', 'Gruta enraizada', 15, 'Root_Hollow', [
          boss('rotten-druid-root-hollow', 'El Druida putrefacto', 'The_Rotten_Druid', {
            description: known('Monstruo único no muerto que aparece en El enredo sombrío y Gruta enraizada.'),
            damageTypes: unknown,
            weaknesses: unknown,
            resistances: unknown,
            dangerousMechanics: unknown,
            rewards: unknown,
          }),
        ]),
        area('hunting-grounds', 'Terrenos de caza', 10, 'Hunting_Grounds', [
          boss('crowbell', 'El cuervo repicador', 'The_Crowbell', {
            description: known('Monstruo único que se encuentra en los Terrenos de caza.'),
            damageTypes: known(['Físico']),
            weaknesses: unknown,
            resistances: unknown,
            dangerousMechanics: known([
              'El combate avanza por tres zonas: huye dos veces y derriba una puerta con la campana antes de la tercera arena.',
            ]),
            rewards: known(['Dos puntos de habilidad pasiva de conjunto de armas la primera vez que se derrota.']),
          }, [wikiBossSource('The_Crowbell')]),
        ]),
        area('freythorn', 'Villafrey', 11, 'Freythorn', [
          boss('king-in-the-mists', 'El rey de las nieblas', 'The_King_in_the_Mists', {
            description: known('Monstruo único que se encuentra en Villafrey.'),
            damageTypes: known(['Físico', 'Frío', 'Caos']),
            weaknesses: unknown,
            resistances: known(['Caos']),
            dangerousMechanics: unknown,
            rewards: known(['Objeto de misión que otorga permanentemente +30 al espíritu máximo y una gema de espíritu sin tallar de nivel 4.']),
          }, [
            wikiBossSource('The_King_in_the_Mists_%28Freythorn%29'),
            wikiItemSource('Gembloom_Skull'),
          ]),
        ]),
        area('ogham-farmlands', 'Tierras de cultivo de Ogham', 12, 'Ogham_Farmlands', verifiedAbsent, [
          'PoE2DB Act 1 guide (explicit “Bosses: None”): https://poe2db.tw/us/Act_1',
        ]),
        area('ogham-village', 'Pueblo de Ogham', 13, 'Ogham_Village', [
          boss('executioner', 'El verdugo', 'The_Executioner', {
            description: known('Monstruo único que se encuentra en el Pueblo de Ogham.'),
            damageTypes: known(['Físico', 'Fuego']),
            weaknesses: unknown,
            resistances: known(['Fuego']),
            dangerousMechanics: known(['El golpe de guillotina tiene una señalización previa específica.']),
            rewards: known(['Gema de habilidad sin tallar de nivel 5 al completar El rastro de corrupción tras derrotarlo.']),
          }, [
            wikiBossSource('The_Executioner'),
            wikiAreaSource('Ogham_Village'),
            wikiQuestSource('The_Trail_of_Corruption'),
          ]),
        ]),
        area('manor-ramparts', 'Las murallas de la mansión', 14, 'The_Manor_Ramparts', verifiedAbsent, [
          'PoE2DB Act 1 guide (explicit “Bosses: None”): https://poe2db.tw/us/Act_1',
        ]),
        area('ogham-manor', 'Mansión de Ogham', 15, 'Ogham_Manor', [
          boss(
            'candlemass',
            'Cirio, el Ritual viviente',
            'PoE2DB (boss listing, Spanish locale): https://poe2db.tw/sp/Act_1',
            {
              description: known('Monstruo único que se encuentra en la primera planta de la Mansión de Ogham.'),
              damageTypes: known(['Físico', 'Fuego']),
              weaknesses: unknown,
              resistances: known(['Físico', 'Fuego', 'Frío']),
              dangerousMechanics: known([
                'Onda de fuego lanzada con la espada que aplica quemadura al golpear.',
                'Salto con impacto que genera pequeñas ondas de choque en línea.',
              ]),
              rewards: known(['Objeto de misión que otorga permanentemente +20 a la vida máxima.']),
            },
            [
              bossSource('Candlemass%2C_the_Living_Rite'),
              wikiBossSource('Candlemass%2C_the_Living_Rite'),
              wikiItemSource('Candlemass%27_Essence'),
            ],
          ),
          boss('count-geonor', 'El conde Geonor', 'Count_Geonor', {
            description: known('Jefe final del Acto 1.'),
            damageTypes: known(['Físico', 'Frío']),
            weaknesses: unknown,
            resistances: known(['Frío']),
            dangerousMechanics: known([
              'Combate por fases con transformaciones a lobo y a forma monstruosa; al comenzar la segunda fase recupera toda la vida.',
              'Los círculos rúnicos alrededor de Agnar congelan al pisarlos y, si no se consumen, liberan una gran onda de daño de frío.',
              'El tajo de hielo de la primera fase y el golpe sangriento de la forma monstruosa no se pueden bloquear y se anticipan con destello rojo; el aliento de hielo deja suelo enfriado.',
              'Al 25 % de vida, haces de sangre aplican Sangre corrompida y continúan cayendo periódicamente durante el resto del combate.',
              'En la subfase de niebla no puede recibir daño y realiza seis embestidas desde la niebla, anticipadas por versos del poema.',
            ]),
            rewards: known(['Gema de asistencia sin tallar de nivel 1 al completar El lobo loco de Ogham tras derrotarlo.']),
          }, [
            wikiBossSource('Count_Geonor'),
            wikiQuestSource('The_Mad_Wolf_of_Ogham'),
          ]),
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
