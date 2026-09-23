export const ACT_ONE_SOURCE_AUDIT = {
  curatedAt: '2026-09-22',
  gameVersion: {
    value: '0.5.4',
    source: 'PoE2 Wiki version history: https://www.poe2wiki.net/wiki/Version_history',
  },
  verifiedAbsences: [
    ['ogham-farmlands', 'bosses', 'https://poe2db.tw/us/Act_1'],
    ['manor-ramparts', 'bosses', 'https://poe2db.tw/us/Act_1'],
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
