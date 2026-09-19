# Feature Spec — campaign-map

**Status:** LOCKED — v0.1
**Readiness:** Contract locked — ready for Planning
**Evidence level:** E2
**Owner:** Human project owner

## Status

LOCKED — v0.1
Contract locked — ready for Planning.
---

# 0. Authority and specification basis

This specification follows:

1. `docs/vedd/constitution.md`;
2. `docs/vedd/specs/context/product-decisions.md`, authoritative for v0.1;
3. `docs/vedd/specs/context/domain.md`;
4. `docs/vedd/capability-map.md`;
5. `docs/vedd/specs/context/references.md`.

The seven blocking ambiguities from the latest Challenger review are resolved in
this specification. Deferred requirements remain outside v0.1 and do not block
Example Mapping.

---

# 1. Purpose

Provide a fast, desktop-first campaign map in Spanish that lets Path of Exile 2
players inspect Act 1 area transitions and review relevant area, boss, and
Hardcore information before entering an area or fighting a boss.

---

# 2. v0.1 product scope

## In scope

- A desktop-first Spanish web application.
- The complete campaign-map experience for Act 1 only.
- Exactly one curated Act 1 dataset bundled locally with the application.
- No runtime dataset selection and no remote dataset loading.
- Areas and direct in-game transitions within Act 1.
- Bidirectional connections by default and explicitly directed connections when
  stated by the bundled data.
- Pan, zoom, click, and basic keyboard area selection.
- No area selected initially.
- One selected area at a time.
- Area-level information:
  - area name;
  - area level;
  - Hardcore danger rating;
  - HC warning;
  - general notable rewards;
  - points of interest;
  - general curiosities;
  - area verification and sources.
- Boss information grouped separately for each boss:
  - name;
  - description;
  - damage types;
  - weaknesses;
  - resistances;
  - dangerous mechanics;
  - boss-specific rewards;
  - boss verification and sources.
- Explicit distinction between known values, verified absence, and unknown
  knowledge.
- A global error when the bundled campaign structure is invalid.
- Spoiler-bearing information displayed without requiring spoiler protection.

## Out of scope for v0.1

- Acts other than Act 1.
- An Act selector.
- Cross-Act connections.
- Multiple datasets, runtime dataset selection, or remote loading.
- Mobile support.
- Search and filtering.
- Player progress, completed areas, current-area detection, or account
  synchronisation.
- Recommended routes, walkthroughs, quest dependency, or chronological-order
  claims.
- Live game-client integration, telemetry, or overlays.
- User accounts, cloud persistence, collaborative editing, or a backend.
- Authoring or correcting campaign data from the map UI.
- Build advice, item recommendations, or trade information.
- Per-boss danger ratings.
- Advanced spatial keyboard navigation.
- A complete non-visual equivalent of the campaign graph.
- Automatic freshness rules, conflicting-source resolution, dataset migrations,
  formal performance budgets, and detailed danger-scoring methodology.
- Dedicated waypoint, quest, and optional-encounter sections not included in
  the approved preview.
- Pixel-perfect reproduction of Grinding Gear Games UI or assets.

---

# 3. Domain and presentation definitions

- **Act 1 map:** the complete v0.1 campaign map. v0.1 displays no other Act and
  provides no Act-selection control.
- **Area:** a selectable Act 1 campaign location.
- **Connection:** a direct in-game transition between two Act 1 areas. It does
  not mean recommended route, quest dependency, or chronological order.
- **Directed connection:** a direct transition explicitly identified by the
  bundled data as one-way.
- **Area knowledge record:** area-level knowledge and metadata, separate from
  boss knowledge.
- **Boss knowledge record:** knowledge and metadata for one individual boss.
- **Danger rating:** area-level editorial guidance produced by PoE2 Companion.
  It is not an official Path of Exile 2 statistic.
- **HC warning:** a short area-level free-text explanation of why the area may
  be dangerous for a Hardcore character. It may summarize boss or area
  mechanics.
- **Known value:** established information displayed to the user.
- **Verified absence:** established knowledge that the element is not present;
  displayed as the grammatically appropriate Spanish form of `Ninguno`.
- **Unknown knowledge:** information that is missing or insufficiently
  established; displayed as the grammatically appropriate Spanish form of
  `Desconocido`.

An empty value is never a substitute for verified absence or unknown knowledge.

---

# 4. Language and visible labels

The v0.1 user interface MUST be Spanish. Internal domain identifiers may remain
in English, but the UI MUST use these mappings:

## Danger rating

| Internal value | Spanish label |
|---|---|
| `LOW` | `Bajo` |
| `MEDIUM` | `Medio` |
| `HIGH` | `Alto` |
| `EXTREME` | `Extremo` |
| `UNKNOWN` | `Desconocido` |

## Verification status

| Internal value | Spanish label |
|---|---|
| `VERIFIED` | `Verificado` |
| `UNKNOWN` | `Sin verificar` |

## Knowledge presence

- Unknown knowledge uses `Desconocido`, `Desconocida`, or the corresponding
  plural form required by its Spanish field label.
- Verified absence uses `Ninguno`, `Ninguna`, or the corresponding plural
  form required by its Spanish field label.
- Canonical internal values are not displayed as untranslated UI labels.

---

# 5. Behaviour rules

1. **Fixed campaign scope.** The application MUST show the bundled Act 1 map and
   MUST NOT expose an Act selector, dataset selector, or runtime data-loading
   control.
2. **Connection meaning.** Every rendered connection MUST represent a direct
   in-game transition between two Act 1 areas.
3. **Connection direction.** A connection is bidirectional unless the bundled
   data explicitly identifies it as directed.
4. **No implied route.** Connections and layout MUST NOT be presented as a
   recommended route, quest dependency, or chronological order.
5. **Initial state.** No area is selected initially.
6. **Selection.** At most one area is selected. Selecting an area MUST identify
   the same area in the map and area preview.
7. **Area and boss separation.** Area-level knowledge and boss-level knowledge
   MUST be presented separately.
8. **Multiple bosses.** Each known boss MUST have its own block or card. Boss
   facts MUST remain associated with that boss and MUST NOT be flattened into
   an aggregated area-level list.
9. **Reward ownership.** A reward explicitly associated with a boss belongs in
   that boss's block. A general quest or area reward belongs to the area-level
   section.
10. **Area danger.** Danger rating applies to the selected area as a whole.
    Per-boss danger ratings MUST NOT be shown in v0.1.
11. **HC warning.** The HC warning is a separate area-level free-text value; it
    is not the danger rating and is not boss verification metadata.
12. **Safety priority.** Area danger and HC warning MUST precede rewards and
    points of interest. Within each boss block, damage types,
    weaknesses/resistances, and dangerous mechanics MUST precede boss-specific
    rewards.
13. **Knowledge state.** Every optional area or boss value MUST preserve one of
    three meanings:
    - known value;
    - verified absence;
    - unknown knowledge.
14. **Unknown display.** Missing or insufficiently established knowledge MUST be
    displayed as the appropriate Spanish form of `Desconocido`.
15. **Verified-absence display.** A value checked and known not to be present
    MUST be displayed as the appropriate Spanish form of `Ninguno`.
16. **No silent empty values.** A blank or omitted value MUST NOT silently mean
    unknown knowledge or verified absence.
17. **Spoilers.** Bosses, mechanics, rewards, and other spoiler-bearing preview
    information MAY be displayed without a reveal step.
18. **Record-scoped verification.** Verification belongs independently to the
    selected area's knowledge record and to each boss knowledge record. The UI
    MUST NOT show one global `Verificado` badge that implies the complete
    dataset is verified.
19. **Verification meaning.** `VERIFIED` means that the record was manually
    checked against at least one accepted source. `UNKNOWN` means the record
    has not been sufficiently verified.
20. **Verification does not imply completeness.** A `VERIFIED` record MAY
    contain optional values whose knowledge state is unknown. The UI MUST show
    both `Verificado` for the record and `Desconocido` for each such value.
21. **Sources.** Each area and boss record MUST associate its own available
    sources and optional verification date with that record. A `VERIFIED`
    record MUST have at least one accepted source.
22. **Game-data version.** The bundled dataset's game-data version MUST be
    available in the campaign-map experience. If its value is not established,
    it is displayed as `Desconocido`.
23. **Primary navigation.** Pointer users MUST be able to pan and zoom the Act 1
    map and click an area to select it.
24. **Basic keyboard access.** Keyboard users MUST be able to reach an area
    control, perceive focus, and activate it to obtain the same selection and
    preview as a pointer user.

---

# 6. Dataset validity and failure behaviour

v0.1 does not attempt partial structural recovery.

The following conditions make the bundled dataset structurally invalid:

- it cannot be parsed;
- its schema is unsupported;
- Act 1 is missing;
- Act 1 contains no areas;
- a required identifier is duplicated;
- a required structural reference is missing;
- a connection references an unknown area.

For any structural error:

- the application MUST show a global dataset error;
- the campaign map MUST NOT be rendered;
- no partially recovered graph is shown.

Missing optional area or boss knowledge is not a structural error. The map
remains usable, the area remains selectable, and the affected value is displayed
as `Desconocido`.

| Condition | Required observable result |
|---|---|
| Valid bundled Act 1 structure | Render the complete Act 1 map. |
| Any listed structural error | Show the global dataset error and render no campaign map. |
| Optional knowledge unknown | Keep the map usable and show the affected value as `Desconocido`. |
| Optional element verified absent | Keep the map usable and show the affected value as `Ninguno`. |
| Area or boss record is `VERIFIED` but an optional value is unknown | Show record status `Verificado` and the affected value as `Desconocido`. |
| Area or boss record verification is `UNKNOWN` | Show `Sin verificar` for that record. |

There are no separate empty-dataset, empty-Act, or partially recovered-map
states in v0.1; those structural conditions produce the global dataset error.

---

# 7. States

## Default

- The complete valid Act 1 map is available for pan and zoom.
- No area is selected.
- The preview contains no stale area or boss information.

## Area selected

- Exactly one area is selected.
- The area-level section and zero or more individual boss blocks correspond to
  that area.
- Known, absent, and unknown values use their required Spanish presentations.
- Area and boss verification are displayed independently.

## Dataset error

- A structural error has been detected.
- A global error is shown.
- The campaign map and partial graph are not rendered.

No additional empty or partial-graph state exists in v0.1.

---

# 8. Inputs

## Bundled campaign structure

- Supported schema.
- Game-data version.
- Act 1 with its required identifier.
- One or more areas with required identifiers.
- Direct connections referencing known Act 1 areas.
- Explicit direction only for one-way connections.

## Area knowledge record

- Area name.
- Area level.
- Area-level danger rating.
- Area-level HC warning.
- General notable rewards.
- Points of interest.
- General curiosities.
- Verification status.
- Zero or more sources.
- Optional verification date.
- Boss collection represented as known bosses, verified absence, or unknown
  knowledge.

## Boss knowledge record

- Boss name.
- Optional description.
- Optional damage types.
- Optional weaknesses.
- Optional resistances.
- Optional dangerous mechanics.
- Optional boss-specific rewards.
- Verification status.
- Zero or more sources.
- Optional verification date.

Every optional knowledge value preserves known, verified-absent, or unknown
meaning.

## User input

- Pan.
- Zoom.
- Pointer area selection.
- Basic keyboard focus and area activation.

---

# 9. Outputs

- The complete Act 1 map, when the bundled structure is valid.
- Direct connections with supported directionality.
- One selected area or no selected area.
- A Spanish area preview with separate area-level and per-boss information.
- Localized danger and verification labels.
- Explicit Spanish representations for unknown knowledge and verified absence.
- Area-scoped and boss-scoped verification, sources, and optional dates.
- The bundled game-data version.
- A global dataset error with no map when structure is invalid.

---

# 10. Dependencies and references

- One curated Act 1 dataset bundled locally.
- `PoE2DB` as the provided reference family for campaign areas, bosses, and
  boss statistics.
- `PoE2 Wiki` as the provided reference family for mechanics, quests, and
  rewards.
- Official Path of Exile 2 material as visual reference.
- PoE2 Companion editorial ownership of area-level Hardcore danger.

No backend, runtime dataset selection, or remote data source is required.

---

# 11. Integration boundaries

## Bundled campaign-data boundary

**Provides:** supported structure, game-data version, Act 1 areas, and direct
connections.  
**Failure contract:** any structural error produces the global dataset error;
there is no partial graph recovery.

## Area-knowledge boundary

**Provides:** area-level values, area verification, sources, optional
verification date, and boss collection.  
**Failure contract:** unknown optional knowledge is displayed as
`Desconocido`; verified absence is displayed as `Ninguno`; neither condition
invalidates the map.

## Boss-knowledge boundary

**Provides:** one record per boss with combat facts, boss-specific rewards,
verification, sources, and optional verification date.  
**Failure contract:** unknown optional boss knowledge is displayed within that
boss block and does not affect other boss or area records.

## Campaign-map experience boundary

**Consumes:** the bundled campaign structure and its area/boss knowledge.  
**Produces:** Act 1 pan/zoom navigation, area selection, localized preview,
record-scoped trust metadata, and the global structural-error state.  
**Does not own:** source verification, game facts, detailed danger-scoring
methodology, player progress, or route recommendations.

---

# 12. Non-functional requirements

- **Language:** user-facing v0.1 UI labels and statuses are Spanish.
- **Target:** desktop-first web application; mobile behaviour is not required.
- **Responsiveness:** the Act 1 map remains visually responsive during pan,
  zoom, and area selection in a normal desktop browser. A formal numeric
  performance budget is deferred.
- **Keyboard:** basic focus and activation are required; advanced spatial graph
  navigation is not.
- **Reliability:** structural corruption never produces a partial campaign map.
- **Knowledge integrity:** unknown information and verified absence remain
  visibly distinct.
- **Traceability:** area and boss records expose their own verification and
  available source metadata.
- **Network:** v0.1 performs no runtime dataset selection or remote dataset
  loading and requires no backend.

---

# 13. Invariants

- The only campaign content presented is the bundled Act 1 snapshot.
- No Act or dataset selector is present.
- No area is selected initially.
- At most one area is selected at a time.
- Selected node and preview always refer to the same area.
- Every rendered connection represents a direct transition between known Act 1
  areas.
- A connection is bidirectional unless explicitly directed by the data.
- Any structural error suppresses the entire campaign map.
- Unknown optional knowledge never suppresses a structurally valid map.
- Unknown knowledge is never equivalent to verified absence.
- `UNKNOWN` danger is never equivalent to `LOW`.
- Danger rating and HC warning are separate area-level values.
- Boss combat facts and boss-specific rewards remain associated with their
  individual boss.
- Area and boss verification are independent.
- A verified record may contain an unknown optional value.
- No global verification badge implies that the complete dataset is verified.
- All visible enum/status labels use the approved Spanish localization.

---

# 14. Non-blocking latitude and deferred decisions

The following do not block v0.1 Example Mapping:

- exact map composition, preview placement, typography, and decorative style,
  provided all visual invariants in `visual-spec.md` hold;
- exact pan and zoom limits or reset controls;
- behaviour for clicking empty map space, because no v0.1 behaviour is claimed
  for that action;
- exact sequential keyboard focus order, provided every area is reachable and
  activation matches pointer selection;
- formal WCAG conformance and a complete non-visual graph;
- the explicitly deferred items listed in
  `context/product-decisions.md#deferred-after-v01`.

No unresolved decision in this section changes the required observable v0.1
behaviour.

---

# 15. Resolution of the seven Challenger findings

| Challenger finding | Status | Authoritative specification section |
|---|---|---|
| Campaign and dataset scope conflict | **RESOLVED** | Sections 2 and 5: Spanish desktop application, Act 1 only, one bundled local dataset, no selectors or remote loading. |
| Spanish UI versus English status labels | **RESOLVED** | Section 4: complete internal-to-Spanish mappings and grammatical forms for unknown and absence. |
| Structural-invalid behaviour versus partial recovery | **RESOLVED** | Section 6: explicit structural-error list, global error, no map, and no partial recovery. |
| Missing information versus verified absence | **RESOLVED** | Sections 3, 5, and 6: three knowledge meanings with distinct Spanish output. |
| Danger rating versus HC warning | **RESOLVED** | Sections 3 and 5: two separate area-level concepts; no per-boss rating. |
| Boss facts associated with individual bosses | **RESOLVED** | Sections 2, 5, and 8: one boss block/record per boss; no aggregation across bosses. |
| Verification and source scope | **RESOLVED** | Sections 5, 8, and 11: independent area and boss records, sources, status, optional date, and no global verified badge. |

---

# 16. Acceptance summary

v0.1 is behaviourally correct when:

- a valid bundled dataset renders only the complete Act 1 map and exposes no Act
  or dataset selector;
- user-facing labels and statuses use the approved Spanish localization;
- any structural error produces a global dataset error and no campaign map;
- missing optional knowledge leaves the map usable and displays
  `Desconocido`;
- verified absence leaves the map usable and displays `Ninguno`;
- selecting an area shows separate area-level information and one independent
  block for each known boss;
- the area-level danger rating and HC warning remain separate;
- each area and boss exposes its own verification status and available sources;
- a verified record may visibly contain an unknown optional value;
- no area is selected initially, and pointer or keyboard activation selects
  exactly one matching area and preview;
- pan and zoom preserve selection;
- every connection represents a supported direct in-game transition.

Concrete examples and executable acceptance scenarios are the next VEDD phase
and remain intentionally unchanged in this reconciliation.

---

# 17. Human approval

**Approved by:** Pending  
**Date:** Pending  
**Notes:** Reconciled with all approved v0.1 blocking decisions and ready for
Example Mapping review.
