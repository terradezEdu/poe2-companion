# Example Mapping — campaign-map v0.1

**Status:** LOCKED — v0.1
**Readiness:** Contract locked — ready for Planning
**Based on:** Locked `spec.md` and `visual-spec.md`
**Scope:** Observable v0.1 behaviour only

The names `Área A`, `Área B`, `Jefe Alfa`, and `Jefe Beta` are neutral
fixture labels. They do not assert facts about the Path of Exile 2 campaign.

Explicitly deferred capabilities and non-blocking visual latitude are not
covered.

## Status

LOCKED — v0.1
Contract locked — ready for Planning.

---

# Rule 1 — v0.1 has one fixed local Act 1 map

The application presents the single bundled Act 1 dataset. It has no Act
selector, dataset selector, runtime dataset switch, or remote-loading control.
No area is selected initially.

## Example 1 — Valid startup

**Context:** The bundled dataset has valid Act 1 structure and contains several
areas and direct transitions.  
**Action:** The player opens the application.  
**Expected outcome:**

- the complete available Act 1 map is presented;
- no other Act is presented;
- there is no Act or dataset selector;
- no area is selected;
- no area or boss details are presented as if selected;
- the interface prompts the player in Spanish to select an area.

---

# Rule 2 — Connections represent direct transitions

Connections represent direct in-game area transitions, are bidirectional by
default, and are one-way only when the bundled data explicitly says so. They do
not communicate route recommendation, quest dependency, or chronology.

## Example 1 — Default and directed connection semantics

| Fixture connection | Expected presentation |
|---|---|
| Área A is connected to Área B with no direction override | The connection communicates traversal in both directions. |
| Área B is connected to Área C with an explicit B-to-C direction | The connection has a distinct one-way treatment from Área B to Área C. |

## Example 2 — A branch is not a recommendation

**Context:** Área A has direct transitions to Área B and Área C. The dataset
does not separately encode route, quest, or chronological meaning.  
**Action:** The map is presented.  
**Expected outcome:** Both transitions are shown without marking either branch
as recommended, mandatory, quest-dependent, earlier, or later.

---

# Rule 3 — Selection and map navigation remain synchronized

At most one area is selected. Pointer selection updates the complete preview.
Pan and zoom do not change selection.

## Example 1 — Selecting and replacing an area

**Context:** No area is selected and Área A and Área B are visible.  
**Action:** The player clicks Área A and then clicks Área B.  
**Expected outcome:**

- after the first click, only Área A is selected and the preview belongs to
  Área A;
- after the second click, Área A is no longer selected;
- only Área B is selected;
- all area and boss preview content is replaced with the content belonging to
  Área B.

## Example 2 — Pan and zoom preserve selection

**Context:** Área A is selected and its preview is visible.  
**Action:** The player pans and zooms the map.  
**Expected outcome:** Área A remains selected and the preview continues to
belong to Área A.

---

# Rule 4 — Basic keyboard selection matches pointer selection

Every area is keyboard reachable, exposes an accessible name, has perceptible
focus, and can be activated without requiring spatial graph navigation.

## Example 1 — Focus and activation are separate

**Context:** No area is selected.  
**Action:** A keyboard user moves focus to Área A and then activates it.  
**Expected outcome:**

- Área A exposes an accessible name;
- focus is visibly perceptible;
- receiving focus alone does not select Área A;
- activating Área A makes it the only selected area;
- the resulting preview is the same observable preview produced by clicking
  Área A.

---

# Rule 5 — Selecting an area presents the approved preview

The preview separates area-level safety and general information from boss
information. Safety information precedes secondary information. Spoiler-bearing
content does not require a reveal step.

## Example 1 — Complete area preview hierarchy

**Context:** Área A has established name and level, an area danger rating, an HC
warning, general rewards, points of interest, curiosities, and one known boss.  
**Action:** The player selects Área A.  
**Expected outcome:**

1. Área A's name and level identify the preview.
2. The area danger rating and HC warning are presented as separate area-level
   values.
3. Area verification and available sources are associated with the area.
4. General rewards, points of interest, and curiosities remain area-level.
5. The known boss is presented in its own boss block.
6. Spoiler-bearing boss, mechanic, and reward information is available in the
   selected preview without a mandatory reveal interaction.
7. Area danger and the HC warning precede general rewards and points of
   interest.

---

# Rule 6 — Boss knowledge belongs to the individual boss

Every known boss has an independent block. Combat facts, boss-specific rewards,
verification, sources, and optional verification date remain associated with
that boss.

## Example 1 — Area with two bosses

**Context:** Área A contains Jefe Alfa and Jefe Beta. Jefe Alfa deals physical
damage and has Recompensa Alfa. Jefe Beta deals fire damage and has Recompensa
Beta. Each boss has independent verification and sources.  
**Action:** The player selects Área A.  
**Expected outcome:**

- two separate boss blocks are presented;
- physical damage and Recompensa Alfa appear only in Jefe Alfa's block;
- fire damage and Recompensa Beta appear only in Jefe Beta's block;
- each boss's dangerous mechanics precede its boss-specific reward;
- each boss's verification, sources, and optional verification date remain
  inside or clearly associated with that boss's block;
- no aggregated boss list loses the ownership of these facts.

---

# Rule 7 — Danger rating and HC warning are distinct area values

The danger rating is an area-level PoE2 Companion editorial value. The HC
warning is a separate area-level free-text explanation. Per-boss danger ratings
are not presented.

## Example 1 — Known high danger

**Context:** Área A has danger value `HIGH`, the HC warning “Daño físico
explosivo”, and two bosses.  
**Action:** The player selects Área A.  
**Expected outcome:**

- the area danger label is `Alto`;
- the HC warning is shown separately as `Daño físico explosivo`;
- the danger value is identifiable as area-level editorial guidance;
- neither boss receives its own danger rating.

## Example 2 — Unknown danger is not low danger

**Context:** Área B has danger value `UNKNOWN`.  
**Action:** The player selects Área B.  
**Expected outcome:** The area danger is displayed as `Desconocido`, not
`Bajo`, and its visual treatment cannot imply known low risk.

---

# Rule 8 — Known value, verified absence, and unknown knowledge differ

Every optional area or boss value preserves one of three meanings. A blank value
does not substitute for any of them.

## Example 1 — Established value

**Context:** Área A has an established notable reward called Recompensa A.  
**Action:** The player selects Área A.  
**Expected outcome:** Recompensa A is shown as a known area-level reward.

## Example 2 — Unknown knowledge

**Context:** Whether Área B has a boss has not been sufficiently established,
and its notable rewards are unresearched.  
**Action:** The player selects Área B.  
**Expected outcome:**

- the boss field displays `Jefe: Desconocido`;
- the rewards field displays `Recompensas: Desconocidas`;
- neither field is blank or presented as verified absence.

## Example 3 — Verified absence

**Context:** Área C has been checked and is known to have no boss and no notable
reward.  
**Action:** The player selects Área C.  
**Expected outcome:**

- the boss field displays `Jefe: Ninguno`;
- the rewards field displays `Recompensas: Ninguna`;
- neither field is displayed as `Desconocido`.

## Example 4 — Optional boss fact: unknown differs from verified absence

**Context:** Jefe Alfa's weaknesses have not been sufficiently established.
Jefe Beta's weaknesses have been checked and none are present.

**Action:** The player selects the area containing both bosses.
**Expected outcome:**

- Jefe Alfa's weaknesses display the appropriate plural form of
  `Desconocido`;
- Jefe Beta's weaknesses display the appropriate plural form of `Ninguno`;
- both fields remain visible rather than being blank; and
- neither boss's knowledge state changes the other boss's record or the
  area's usability.

---

# Rule 9 — Verification and sources are record-scoped

Area and boss records have independent verification status and sources. A
verified record may still contain an unknown optional value. No global badge
implies that the complete dataset is verified.

## Example 1 — Area and boss have different verification

**Context:** Área A is `VERIFIED` with an accepted area source. Jefe Alfa is
`UNKNOWN` and has not been sufficiently checked.  
**Action:** The player selects Área A.  
**Expected outcome:**

- Área A displays `Verificado` with its area source;
- Jefe Alfa independently displays `Sin verificar`;
- the area status does not make Jefe Alfa appear verified;
- no global `Verificado` badge claims that the complete dataset is verified.

## Example 2 — Verified boss with unknown weakness

**Context:** Jefe Alfa is `VERIFIED`, has an accepted source, and its weakness
value is `UNKNOWN`.  
**Action:** The player opens Jefe Alfa's block by selecting its area.  
**Expected outcome:**

- Jefe Alfa displays `Verificado`;
- its weakness displays `Desconocida`;
- the unknown weakness does not change the boss record to `Sin verificar`;
- the boss source remains associated with Jefe Alfa.

## Example 3 — Sources and dates do not cross record boundaries

**Context:** Área A and Jefe Alfa have different sources and different optional
verification dates.  
**Action:** The player selects Área A.  
**Expected outcome:** Each source and date is associated with its owning area or
boss record; neither is visually attributed to the other record.

## Example 4 — Source-less verification is normalized without changing knowledge

**Context:** Jefe Alfa declares `VERIFIED` without an accepted source, has an
`UNKNOWN` weakness, and has verified-absent rewards.

**Action:** The player selects the area containing Jefe Alfa.

**Expected outcome:**

- Jefe Alfa's verification is normalized to `UNKNOWN` and displays
  `Sin verificar`;
- the campaign map remains usable and Jefe Alfa remains available in its own
  boss block without a global dataset error;
- the weakness remains unknown and displays `Desconocida`; and
- the verified-absent rewards remain verified absent and display `Ninguna`.

---

# Rule 10 — Internal status values are localized in Spanish

Internal danger, knowledge, and verification identifiers are not exposed as
untranslated user-interface labels.

## Example 1 — Localization mapping

| Internal fixture value | Expected visible Spanish label |
|---|---|
| danger `LOW` | `Bajo` |
| danger `MEDIUM` | `Medio` |
| danger `HIGH` | `Alto` |
| danger `EXTREME` | `Extremo` |
| danger `UNKNOWN` | `Desconocido` |
| verification `VERIFIED` | `Verificado` |
| verification `UNKNOWN` | `Sin verificar` |
| unknown feminine plural knowledge | `Desconocidas` |
| verified-absent feminine singular knowledge | `Ninguna` |

The internal identifiers are not displayed alongside or instead of these
labels.

---

# Rule 11 — Structural errors suppress the entire map

v0.1 performs no partial structural recovery. Any approved structural error
produces one global Spanish dataset-error state and no campaign map.

## Example 1 — Structural-error equivalence set

For each fixture below, opening the application produces the same observable
result: a global dataset error is shown in Spanish, and no Act 1 map, area node,
connection, selected preview, empty-map state, or partial graph is rendered.

| Structurally invalid fixture |
|---|
| The bundled dataset cannot be parsed. |
| The bundled dataset uses an unsupported schema. |
| Act 1 is missing. |
| Act 1 contains no areas. |
| A required identifier is duplicated. |
| A required structural reference is missing. |
| A connection references an unknown area. |

---

# Rule 12 — Missing optional knowledge does not invalidate the map

Incomplete optional area or boss knowledge is different from invalid campaign
structure.

## Example 1 — Unknown boss fields preserve navigation

**Context:** The Act 1 structure is valid. Jefe Alfa's description and weakness
are unknown.  
**Action:** The player opens the map and selects Jefe Alfa's area.  
**Expected outcome:**

- the complete Act 1 map remains available;
- the area remains selectable;
- Jefe Alfa remains in its own boss block;
- description and weakness display their appropriate Spanish
  `Desconocido` forms;
- no global dataset error is shown.

---

# Rule 13 — The bundled game-data version remains available

The campaign-map experience exposes the game-data version without introducing
runtime dataset selection.

## Example 1 — Established version

**Context:** The bundled dataset has an established game-data version.  
**Action:** The player opens and navigates the campaign map.  
**Expected outcome:** That version remains available in the campaign-map
experience, and no version or dataset selector is presented.

## Example 2 — Unknown version

**Context:** The bundled dataset's game-data version is not established.  
**Action:** The player opens the campaign map.  
**Expected outcome:** The version value is displayed as `Desconocido`; the
application does not invent a version or offer remote loading.

---

# Rule 14 — Required visual meaning remains legible during desktop use

Visual treatment is flexible, but it cannot obscure required meaning or make
interaction unusable.

## Example 1 — Visual semantics survive styling

**Context:** The approved Act 1 data includes selected, focused, bidirectional,
directed, `Bajo`, and `Desconocido` states.  
**Action:** A reviewer inspects the default and selected visual states.  
**Expected outcome:**

- selected area and keyboard focus are distinguishable;
- bidirectional and directed connections communicate different directionality;
- danger includes its Spanish text label and does not depend only on colour;
- `Bajo`, `Desconocido`, and `Ninguno` remain distinguishable;
- decoration does not obscure labels, connections, safety information, trust
  metadata, or actions;
- preview information is not available only through hover;
- the presentation has an original RPG campaign-map character without
  pixel-perfect reproduction of the game UI or assets.

## Example 2 — Normal desktop interaction remains usable

**Context:** The complete curated Act 1 map is open in a normal desktop browser.  
**Action:** The player repeatedly pans, zooms, selects Área A, and then selects
Área B.  
**Expected outcome:** The map continues to provide visible interaction feedback,
selection and preview stay synchronized, and the experience does not become
visually unresponsive. No numeric timing threshold is asserted.

---

# Invariants for later acceptance evidence

- At most one area is selected.
- Selected node and preview always identify the same area.
- Every rendered connection joins known Act 1 areas and uses the declared
  directionality.
- Any structural error implies no rendered campaign map.
- Unknown optional knowledge never implies a structural error.
- Unknown knowledge, verified absence, and known value remain distinct.
- `Desconocido` danger never means `Bajo`.
- Boss facts never move between boss records or into an aggregate area list.
- Area and boss verification remain independent.
- A record may be `Verificado` while an optional field is
  `Desconocido`.
- Internal status identifiers never replace their approved Spanish labels.

---

# Remaining questions

None. The approved specification determines the expected v0.1 outcomes needed
for Acceptance Mapping.
