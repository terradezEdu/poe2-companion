const poe2dbBoss = (slug: string) => `https://poe2db.tw/us/${slug}`
const wikiBoss = (slug: string) => `https://www.poe2wiki.net/wiki/${slug}`
const wikiItem = (slug: string) => `https://www.poe2wiki.net/wiki/${slug}`
const wikiArea = (slug: string) => `https://www.poe2wiki.net/wiki/${slug}`
const wikiQuest = (slug: string) => `https://www.poe2wiki.net/wiki/${slug}`

const supported = <T>(value: T, sources: readonly string[]) => ({
  classification: 'SUPPORTED_FACT',
  value,
  sources,
} as const)

const unsupported = (reason: string, sources: readonly string[] = []) => ({
  classification: 'UNSUPPORTED',
  reason,
  sources,
} as const)

const rejectedInference = (decisionId: string, reason: string, sources: readonly string[]) => ({
  classification: 'REJECTED_BY_HUMAN_DATA_DECISION',
  decisionId,
  reason,
  sources,
} as const)

const sourceConflict = (conflictId: string, sources: readonly string[]) => ({
  classification: 'SOURCE_CONFLICT',
  conflictId,
  sources,
} as const)

const explicitWeaknesses = {
  beira: supported(['Fuego'], [wikiBoss('Beira_of_the_Rotten_Pack'), poe2dbBoss('Beira_of_the_Rotten_Pack')]),
  brambleghast: supported(['Fuego'], [poe2dbBoss('The_Brambleghast')]),
  rustKing: supported(['Rayo'], [wikiBoss('The_Rust_King'), poe2dbBoss('The_Rust_King')]),
} as const

const inferredWeakness = (source: string) => rejectedInference(
  'resistance-values-to-weakness',
  'Los valores brutos de resistencia no se transforman en debilidades; falta una declaración explícita de una fuente aceptada.',
  [source],
)

const skillDamage = (source: string) => rejectedInference(
  'skill-damage-to-boss-damage-types',
  'Los tipos de daño de habilidades individuales no se agregan como tipos de daño del jefe en este ciclo.',
  [source],
)

export const ACT_ONE_SOURCE_AUDIT = {
  curatedAt: '2026-09-28',
  gameVersion: {
    value: '0.5.4',
    source: 'PoE2 Wiki version history: https://www.poe2wiki.net/wiki/Version_history',
  },
  verifiedAbsences: [
    ['ogham-farmlands', 'bosses', 'https://poe2db.tw/us/Act_1'],
    ['manor-ramparts', 'bosses', 'https://poe2db.tw/us/Act_1'],
  ],
  bossFieldAudit: [
    {
      bossId: 'bloated-miller',
      fields: {
        description: supported('Monstruo único que se encuentra en La orilla del río.', [wikiBoss('The_Bloated_Miller')]),
        damageTypes: supported(['Físico'], [wikiBoss('The_Bloated_Miller')]),
        weaknesses: inferredWeakness(poe2dbBoss('The_Bloated_Miller')),
        resistances: unsupported(
          'Los valores elementales a 0 % no establecen ausencia de toda resistencia; la fuente aceptada no declara una resistencia del jefe.',
          [poe2dbBoss('The_Bloated_Miller')],
        ),
        dangerousMechanics: supported(
          [
            'Carga a corta distancia que no se puede bloquear.',
            'Golpe con tronco precedido de una preparación que genera una onda de choque frontal.',
            'Rugido que invoca varios Ahogados.',
          ],
          [wikiBoss('The_Bloated_Miller')],
        ),
        rewards: supported(
          ['Experiencia suficiente para alcanzar el nivel 2 si se derrota antes de ese nivel.'],
          [wikiBoss('The_Bloated_Miller')],
        ),
      },
    },
    {
      bossId: 'beira',
      fields: {
        description: supported('Monstruo único que se encuentra en Sierraclara.', [wikiBoss('Beira_of_the_Rotten_Pack')]),
        damageTypes: supported(['Físico', 'Frío'], [wikiBoss('Beira_of_the_Rotten_Pack')]),
        weaknesses: explicitWeaknesses.beira,
        resistances: supported(['Frío'], [wikiBoss('Beira_of_the_Rotten_Pack'), poe2dbBoss('Beira_of_the_Rotten_Pack')]),
        dangerousMechanics: supported(
          [
            'Círculos mágicos que explotan tras una demora e infligen daño de frío intenso.',
            'Invoca lobos no muertos durante el encuentro.',
            'Canaliza una nova de escarcha que se expande lentamente.',
            'Círculos rúnicos anticipan la aparición de púas de hielo.',
          ],
          [wikiBoss('Beira_of_the_Rotten_Pack')],
        ),
        rewards: supported(
          ['Objeto de misión que otorga permanentemente +10 % a la resistencia al frío.'],
          [wikiBoss('Beira_of_the_Rotten_Pack'), wikiItem('Head_of_the_Winter_Wolf')],
        ),
      },
    },
    {
      bossId: 'devourer',
      fields: {
        description: supported('Devorador único que se encuentra en Lodazal.', [wikiBoss('The_Devourer')]),
        damageTypes: supported(['Físico', 'Caos'], [wikiBoss('The_Devourer')]),
        weaknesses: inferredWeakness(poe2dbBoss('The_Devourer')),
        resistances: supported(['Físico'], [wikiBoss('The_Devourer')]),
        dangerousMechanics: supported(
          [
            'Proyectiles verdes que aplican veneno y un proyectil de mortero dirigido a los pies del jugador.',
            'Un área roja anticipa su salida del subsuelo, que también genera Larvas de carne.',
            'Excava continuamente por la arena; solo la cabeza y la cola pueden recibir daño directo.',
          ],
          [wikiBoss('The_Devourer')],
        ),
        rewards: supported(
          [
            'Gema de habilidad sin tallar de nivel 2 que deja caer el jefe.',
            'Gema de asistencia sin tallar de nivel 1 y 100 de oro por completar Terreno traicionero tras derrotarlo.',
          ],
          [wikiArea('Mud_Burrow'), wikiQuest('Treacherous_Ground')],
        ),
      },
    },
    {
      bossId: 'brambleghast',
      fields: {
        description: supported('Monstruo único que se encuentra en El bosque singular.', [wikiBoss('The_Brambleghast')]),
        damageTypes: supported(['Físico'], [wikiBoss('The_Brambleghast')]),
        weaknesses: explicitWeaknesses.brambleghast,
        resistances: supported(['Físico', 'Frío'], [wikiBoss('The_Brambleghast'), poe2dbBoss('The_Brambleghast')]),
        dangerousMechanics: supported(
          [
            'Lanza un orbe morado que dispara proyectiles en círculo mientras se desplaza.',
            'Invoca varias Enredaderas feroces que atacan con barridos o estocadas.',
          ],
          [wikiBoss('The_Brambleghast')],
        ),
        rewards: unsupported(
          'Las fuentes aceptadas auditadas no atribuyen una recompensa específica a este jefe.',
          [wikiBoss('The_Brambleghast')],
        ),
      },
    },
    {
      bossId: 'rust-king',
      fields: {
        description: supported('Monstruo único que se encuentra en El valle rojo.', [wikiBoss('The_Rust_King')]),
        damageTypes: supported(['Físico'], [wikiBoss('The_Rust_King')]),
        weaknesses: explicitWeaknesses.rustKing,
        resistances: supported(['Fuego'], [poe2dbBoss('The_Rust_King')]),
        dangerousMechanics: unsupported(
          'La fuente aceptada no documenta una mecánica concreta más allá de ataques predeterminados sin describir.',
          [wikiBoss('The_Rust_King')],
        ),
        rewards: supported(
          ['Tercer objeto de misión necesario para avanzar Secretos en la oscuridad.'],
          [wikiBoss('The_Rust_King')],
        ),
      },
    },
    {
      bossId: 'rotten-druid-grim-tangle',
      fields: {
        description: supported(
          'Monstruo único no muerto que aparece en El enredo sombrío y Gruta enraizada.',
          [poe2dbBoss('The_Rotten_Druid')],
        ),
        damageTypes: skillDamage(poe2dbBoss('The_Rotten_Druid')),
        weaknesses: inferredWeakness(poe2dbBoss('The_Rotten_Druid')),
        resistances: unsupported('La fuente aceptada no declara una resistencia del jefe.', [poe2dbBoss('The_Rotten_Druid')]),
        dangerousMechanics: unsupported('Las fuentes aceptadas auditadas no describen el encuentro.', [poe2dbBoss('The_Rotten_Druid')]),
        rewards: unsupported(
          'Las fuentes aceptadas auditadas no atribuyen una recompensa específica a este jefe.',
          [poe2dbBoss('The_Rotten_Druid')],
        ),
      },
    },
    {
      bossId: 'lachlann',
      fields: {
        description: supported('Monstruo único que se encuentra en el Cementerio de los eternos.', [wikiBoss('Lachlann_of_Endless_Lament')]),
        damageTypes: sourceConflict('lachlann-damage-types', [wikiBoss('Lachlann_of_Endless_Lament')]),
        weaknesses: inferredWeakness(poe2dbBoss('Lachlann_of_Endless_Lament')),
        resistances: supported(['Físico'], [wikiBoss('Lachlann_of_Endless_Lament')]),
        dangerousMechanics: supported(
          ['Varias formas de golpes cuerpo a cuerpo contra el suelo.'],
          [wikiBoss('Lachlann_of_Endless_Lament')],
        ),
        rewards: supported(
          ['Anillo del conde Lachlann, necesario para completar una misión.'],
          [wikiBoss('Lachlann_of_Endless_Lament')],
        ),
      },
    },
    {
      bossId: 'draven',
      fields: {
        description: supported('Monstruo único que se encuentra en el Mausoleo del pretor.', [wikiBoss('Draven%2C_the_Eternal_Praetor')]),
        damageTypes: skillDamage(poe2dbBoss('Draven%2C_the_Eternal_Praetor')),
        weaknesses: inferredWeakness(poe2dbBoss('Draven%2C_the_Eternal_Praetor')),
        resistances: supported(['Fuego'], [poe2dbBoss('Draven%2C_the_Eternal_Praetor')]),
        dangerousMechanics: supported(
          [
            'Los fantasmas de la arena dejan círculos verdes al desaparecer.',
            'Si un fantasma desaparece junto al cadáver de un Caballero eterno, el caballero reaparece.',
          ],
          [wikiBoss('Draven%2C_the_Eternal_Praetor')],
        ),
        rewards: supported(
          ['Pieza de llave conmemorativa necesaria para avanzar la misión.'],
          [wikiItem('Draven%27s_Memorial_Key_Piece')],
        ),
      },
    },
    {
      bossId: 'asinia',
      fields: {
        description: supported('Monstruo único que se encuentra en la Tumba de la consorte.', [wikiBoss('Asinia%2C_the_Praetor%27s_Consort')]),
        damageTypes: skillDamage(poe2dbBoss('Asinia%2C_the_Praetors_Consort')),
        weaknesses: inferredWeakness(poe2dbBoss('Asinia%2C_the_Praetors_Consort')),
        resistances: supported(['Frío'], [poe2dbBoss('Asinia%2C_the_Praetors_Consort')]),
        dangerousMechanics: unsupported(
          'La sección de encuentro de la fuente aceptada no describe ninguna mecánica.',
          [wikiBoss('Asinia%2C_the_Praetor%27s_Consort')],
        ),
        rewards: supported(
          ['Pieza de llave conmemorativa necesaria para avanzar la misión.'],
          [wikiItem('Asinia%27s_Memorial_Key_Piece')],
        ),
      },
    },
    {
      bossId: 'rotten-druid-root-hollow',
      fields: {
        description: supported(
          'Monstruo único no muerto que aparece en El enredo sombrío y Gruta enraizada.',
          [poe2dbBoss('The_Rotten_Druid')],
        ),
        damageTypes: skillDamage(poe2dbBoss('The_Rotten_Druid')),
        weaknesses: inferredWeakness(poe2dbBoss('The_Rotten_Druid')),
        resistances: unsupported('La fuente aceptada no declara una resistencia del jefe.', [poe2dbBoss('The_Rotten_Druid')]),
        dangerousMechanics: unsupported('Las fuentes aceptadas auditadas no describen el encuentro.', [poe2dbBoss('The_Rotten_Druid')]),
        rewards: unsupported(
          'Las fuentes aceptadas auditadas no atribuyen una recompensa específica a este jefe.',
          [poe2dbBoss('The_Rotten_Druid')],
        ),
      },
    },
    {
      bossId: 'crowbell',
      fields: {
        description: supported('Monstruo único que se encuentra en los Terrenos de caza.', [wikiBoss('The_Crowbell')]),
        damageTypes: supported(['Físico'], [wikiBoss('The_Crowbell')]),
        weaknesses: inferredWeakness(poe2dbBoss('The_Crowbell')),
        resistances: unsupported(
          'Los valores elementales a 0 % no establecen ausencia de toda resistencia; la fuente aceptada no declara una resistencia del jefe.',
          [poe2dbBoss('The_Crowbell')],
        ),
        dangerousMechanics: supported(
          ['El combate avanza por tres zonas: huye dos veces y derriba una puerta con la campana antes de la tercera arena.'],
          [wikiBoss('The_Crowbell')],
        ),
        rewards: supported(
          ['Dos puntos de habilidad pasiva de conjunto de armas la primera vez que se derrota.'],
          [wikiBoss('The_Crowbell')],
        ),
      },
    },
    {
      bossId: 'king-in-the-mists',
      fields: {
        description: supported('Monstruo único que se encuentra en Villafrey.', [wikiBoss('The_King_in_the_Mists_%28Freythorn%29')]),
        damageTypes: supported(['Físico', 'Frío', 'Caos'], [wikiBoss('The_King_in_the_Mists_%28Freythorn%29')]),
        weaknesses: inferredWeakness(poe2dbBoss('The_King_in_the_Mists')),
        resistances: supported(['Caos'], [wikiBoss('The_King_in_the_Mists_%28Freythorn%29'), poe2dbBoss('The_King_in_the_Mists')]),
        dangerousMechanics: unsupported(
          'Las fuentes aceptadas auditadas no describen el encuentro de Villafrey.',
          [wikiBoss('The_King_in_the_Mists_%28Freythorn%29')],
        ),
        rewards: supported(
          ['Objeto de misión que otorga permanentemente +30 al espíritu máximo y una gema de espíritu sin tallar de nivel 4.'],
          [wikiBoss('The_King_in_the_Mists_%28Freythorn%29'), wikiItem('Gembloom_Skull')],
        ),
      },
    },
    {
      bossId: 'executioner',
      fields: {
        description: supported('Monstruo único que se encuentra en el Pueblo de Ogham.', [wikiBoss('The_Executioner')]),
        damageTypes: supported(['Físico', 'Fuego'], [wikiBoss('The_Executioner')]),
        weaknesses: inferredWeakness(poe2dbBoss('The_Executioner')),
        resistances: supported(['Fuego'], [wikiBoss('The_Executioner'), poe2dbBoss('The_Executioner')]),
        dangerousMechanics: supported(
          ['El golpe de guillotina tiene una señalización previa específica.'],
          [wikiBoss('The_Executioner')],
        ),
        rewards: supported(
          ['Gema de habilidad sin tallar de nivel 5 al completar El rastro de corrupción tras derrotarlo.'],
          [wikiQuest('The_Trail_of_Corruption')],
        ),
      },
    },
    {
      bossId: 'candlemass',
      fields: {
        description: supported('Monstruo único que se encuentra en la primera planta de la Mansión de Ogham.', [wikiBoss('Candlemass%2C_the_Living_Rite')]),
        damageTypes: supported(['Físico', 'Fuego'], [wikiBoss('Candlemass%2C_the_Living_Rite')]),
        weaknesses: inferredWeakness(poe2dbBoss('Candlemass%2C_the_Living_Rite')),
        resistances: supported(['Físico', 'Fuego', 'Frío'], [wikiBoss('Candlemass%2C_the_Living_Rite')]),
        dangerousMechanics: supported(
          [
            'Onda de fuego lanzada con la espada que aplica quemadura al golpear.',
            'Salto con impacto que genera pequeñas ondas de choque en línea.',
          ],
          [wikiBoss('Candlemass%2C_the_Living_Rite')],
        ),
        rewards: supported(
          ['Objeto de misión que otorga permanentemente +20 a la vida máxima.'],
          [wikiBoss('Candlemass%2C_the_Living_Rite'), wikiItem('Candlemass%27_Essence')],
        ),
      },
    },
    {
      bossId: 'count-geonor',
      fields: {
        description: supported('Jefe final del Acto 1.', [wikiBoss('Count_Geonor')]),
        damageTypes: supported(['Físico', 'Frío'], [wikiBoss('Count_Geonor')]),
        weaknesses: inferredWeakness(poe2dbBoss('Count_Geonor')),
        resistances: supported(['Frío'], [wikiBoss('Count_Geonor'), poe2dbBoss('Count_Geonor')]),
        dangerousMechanics: supported(
          [
            'Combate por fases con transformaciones a lobo y a forma monstruosa; al comenzar la segunda fase recupera toda la vida.',
            'Los círculos rúnicos alrededor de Agnar congelan al pisarlos y, si no se consumen, liberan una gran onda de daño de frío.',
            'El tajo de hielo de la primera fase y el golpe sangriento de la forma monstruosa no se pueden bloquear y se anticipan con destello rojo; el aliento de hielo deja suelo enfriado.',
            'Al 25 % de vida, haces de sangre aplican Sangre corrompida y continúan cayendo periódicamente durante el resto del combate.',
            'En la subfase de niebla no puede recibir daño y realiza seis embestidas desde la niebla, anticipadas por versos del poema.',
          ],
          [wikiBoss('Count_Geonor')],
        ),
        rewards: supported(
          ['Gema de asistencia sin tallar de nivel 1 al completar El lobo loco de Ogham tras derrotarlo.'],
          [wikiQuest('The_Mad_Wolf_of_Ogham')],
        ),
      },
    },
  ],
  semanticInferenceDecisions: [
    {
      id: 'resistance-values-to-weakness',
      status: 'REJECTED_BY_HUMAN_DATA_DECISION',
      sourceFactAvailable: 'PoE2DB publica valores brutos de resistencia elemental para cada registro de jefe.',
      proposedUserFacingTransformation: 'Etiquetar como debilidad el tipo con resistencia más baja, nula o negativa aunque la fuente no muestre el indicador Weak.',
      alternativeConservativeRepresentation: 'Mantener Debilidades como UNKNOWN salvo cuando PoE2DB o PoE2 Wiki declaren explícitamente Weak/Weakness.',
      appliedRule: 'Solo una declaración explícita de debilidad de una fuente aceptada puede poblar el campo; los demás valores permanecen UNKNOWN.',
    },
    {
      id: 'skill-damage-to-boss-damage-types',
      status: 'REJECTED_BY_HUMAN_DATA_DECISION_FOR_THIS_CYCLE',
      sourceFactAvailable: 'PoE2DB enumera habilidades y tipos de daño individuales de Draven, Asinia y las dos apariciones del Druida putrefacto.',
      proposedUserFacingTransformation: 'Agregar todos los tipos observados en las habilidades al campo agregado Daño del jefe.',
      alternativeConservativeRepresentation: 'Mantener Daño como UNKNOWN hasta que una fuente aceptada declare el conjunto a nivel de jefe o se apruebe la agregación.',
      appliedRule: 'Draven, Asinia y las dos apariciones del Druida putrefacto conservan Daño como UNKNOWN; Lachlann también permanece UNKNOWN por conflicto.',
    },
    {
      id: 'encounter-list-to-dangerous-mechanics',
      status: 'APPROVED_BY_HUMAN_DATA_DECISION_WITH_CONSTRAINTS',
      sourceFactAvailable: 'PoE2 Wiki documenta ataques, fases, señales, propiedades y mecánicas de arena para diez registros con detalle suficiente; la sección de Asinia no contiene una descripción.',
      proposedUserFacingTransformation: 'Seleccionar y resumir parte de esas listas como Mecánicas peligrosas.',
      alternativeConservativeRepresentation: 'Mantener Mecánicas peligrosas como UNKNOWN; las listas de encuentro no se presentan como una priorización de peligro.',
      appliedRule: 'Solo se conservan resúmenes factuales descritos por la fuente: ataques y señales explícitas, fases, acumulación de frío/congelación y peligros o propiedades de la arena. No se añaden tácticas, rankings ni severidad inferida.',
    },
    {
      id: 'kill-or-quest-outcome-to-boss-reward',
      status: 'APPROVED_BY_HUMAN_DATA_DECISION_WITH_CONSTRAINTS',
      sourceFactAvailable: 'Las fuentes vinculan derrotar al Molinero hinchado, al Devorador, al Verdugo y al conde Geonor con experiencia, botín directo o recompensas de sus misiones.',
      proposedUserFacingTransformation: 'Mostrar esos resultados de misión o experiencia como Recompensas del jefe.',
      alternativeConservativeRepresentation: 'Mantener Recompensas como UNKNOWN salvo para objetos o bonificaciones que la fuente atribuye directamente al jefe o a su arena.',
      appliedRule: 'Solo se incorporan resultados que la fuente aceptada vincula causalmente con derrotar o completar el encuentro del jefe; se excluyen recompensas genéricas de área y misiones no relacionadas.',
    },
  ],
  unresolvedSourceConflicts: [
    {
      subject: 'lachlann-damage-types',
      claims: [
        ['PoE2 Wiki MonsterBox', 'Physical', wikiBoss('Lachlann_of_Endless_Lament')],
        ['PoE2 Wiki Encounter', 'Chilled ground that deals cold damage over time', wikiBoss('Lachlann_of_Endless_Lament')],
      ],
      curationAction: 'Por decisión humana, Daño permanece UNKNOWN; no se elige ni se agrega un conjunto de tipos.',
    },
    {
      subject: 'executioner-fire-resistance-magnitude',
      claims: [
        ['PoE2DB unique-monster value', '45%', poe2dbBoss('The_Executioner')],
        ['PoE2 Wiki campaign boss value', '30%', wikiBoss('The_Executioner')],
      ],
      curationAction: 'No se conserva el porcentaje; solo el tipo Fuego, en el que ambas fuentes coinciden.',
    },
    {
      subject: 'king-in-the-mists-chaos-resistance-magnitude',
      claims: [
        ['PoE2DB unique-monster value', '60%', poe2dbBoss('The_King_in_the_Mists')],
        ['PoE2 Wiki Freythorn value', '50%', wikiBoss('The_King_in_the_Mists_%28Freythorn%29')],
      ],
      curationAction: 'No se conserva el porcentaje; solo el tipo Caos, en el que ambas fuentes coinciden.',
    },
    {
      subject: 'count-geonor-cold-resistance-magnitude',
      claims: [
        ['PoE2DB unique-monster value', '45%', poe2dbBoss('Count_Geonor')],
        ['PoE2 Wiki campaign boss value', '30%', wikiBoss('Count_Geonor')],
      ],
      curationAction: 'No se conserva el porcentaje; solo el tipo Frío, en el que ambas fuentes coinciden.',
    },
    {
      subject: 'count-geonor-campaign-location-name',
      claims: [
        ['PoE2 Wiki MonsterBox', 'The Iron Manor', wikiBoss('Count_Geonor')],
        ['PoE2 Wiki prose and bundled accepted area record', 'Ogham Manor', wikiBoss('Count_Geonor')],
      ],
      curationAction: 'La descripción curada omite la ubicación y conserva únicamente el hecho no conflictivo de que es el jefe final del Acto 1.',
    },
  ],
  resolvedSourceConflicts: [
    {
      subject: 'grelwood-root-hollow',
      status: 'RESOLVED_BY_HUMAN_DATA_DECISION',
      evidence: [
        'https://poe2db.tw/us/Root_Hollow',
        'https://poe2db.tw/us/The_Grelwood',
        'https://poe2db.tw/us/Act_1',
      ],
      decision: 'Included as BIDIRECTIONAL. Root Hollow explicitly identifies The Grelwood as Connected; the opposite/aggregate omission is not evidence of a one-way transition.',
    },
    {
      subject: 'grelwood-lost-catacombs',
      status: 'RESOLVED_BY_HUMAN_DATA_DECISION',
      evidence: [
        'https://poe2db.tw/us/Lost_Catacombs',
        'https://poe2db.tw/us/The_Grelwood',
        'https://poe2db.tw/us/Act_1',
      ],
      decision: 'Included as BIDIRECTIONAL. Both individual area records identify the connection; the aggregate progression-diagram omission does not override them.',
    },
    {
      subject: 'ogham-village-manor-ramparts',
      status: 'RESOLVED_BY_HUMAN_DATA_DECISION',
      evidence: [
        'https://poe2db.tw/us/Ogham_Village',
        'https://poe2db.tw/us/The_Manor_Ramparts',
        'https://poe2db.tw/us/Act_1',
      ],
      decision: 'Included as DIRECTED from Ogham Village to The Manor Ramparts. Connected fields establish adjacency; the Act 1 progression representation establishes direction.',
    },
    {
      subject: 'mausoleum-tomb-area-levels',
      status: 'RESOLVED_BY_HUMAN_DATA_DECISION',
      evidence: [
        'https://poe2db.tw/us/Mausoleum_of_the_Praetor',
        'https://poe2db.tw/us/Tomb_of_the_Consort',
        'https://www.poe2wiki.net/wiki/Act_1',
      ],
      decision: 'Both Campaign Map area levels are UNKNOWN because the schema cannot faithfully represent the accepted conditional 8/9 value.',
      deferredDomainKnowledge: 'Mausoleum of the Praetor and Tomb of the Consort have dynamic level 8/9 behavior depending on instance/order.',
    },
  ],
  transitions: [
    ['riverbank', 'clearfell-encampment', 'BIDIRECTIONAL', 'https://poe2db.tw/us/The_Riverbank'],
    ['clearfell-encampment', 'clearfell', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Clearfell_Encampment'],
    ['clearfell', 'mud-burrow', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Clearfell'],
    ['clearfell', 'grelwood', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Clearfell'],
    ['grelwood', 'lost-catacombs', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Lost_Catacombs'],
    ['grelwood', 'red-vale', 'BIDIRECTIONAL', 'https://poe2db.tw/us/The_Red_Vale'],
    ['grelwood', 'grim-tangle', 'BIDIRECTIONAL', 'https://poe2db.tw/us/The_Grim_Tangle'],
    ['grelwood', 'root-hollow', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Root_Hollow'],
    ['grim-tangle', 'cemetery-of-the-eternals', 'BIDIRECTIONAL', 'https://poe2db.tw/us/The_Grim_Tangle'],
    ['cemetery-of-the-eternals', 'mausoleum-of-the-praetor', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Cemetery_of_the_Eternals'],
    ['cemetery-of-the-eternals', 'tomb-of-the-consort', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Cemetery_of_the_Eternals'],
    ['cemetery-of-the-eternals', 'hunting-grounds', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Cemetery_of_the_Eternals'],
    ['hunting-grounds', 'freythorn', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Hunting_Grounds'],
    ['hunting-grounds', 'ogham-farmlands', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Hunting_Grounds'],
    ['ogham-farmlands', 'ogham-village', 'BIDIRECTIONAL', 'https://poe2db.tw/us/Ogham_Farmlands'],
    ['ogham-village', 'manor-ramparts', 'DIRECTED', 'https://poe2db.tw/us/Act_1'],
    ['manor-ramparts', 'ogham-manor', 'BIDIRECTIONAL', 'https://poe2db.tw/us/The_Manor_Ramparts'],
  ],
} as const
