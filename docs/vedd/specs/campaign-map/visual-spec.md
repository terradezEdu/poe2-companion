# Visual Spec — campaign-map

**Status:** LOCKED — v0.1
**Readiness:** Contract locked — ready for Planning
**Owner:** Human project owner

## Status

LOCKED — v0.1
Contract locked — ready for Planning.

---

# 0. Authority and visual basis

- `docs/vedd/specs/context/product-decisions.md` is authoritative for v0.1.
- `docs/vedd/specs/context/domain.md` defines Acts, areas, bosses, and direct
  area transitions.
- Official Path of Exile 2 material is the supplied visual-reference family.
- The constitution requires an RPG campaign-map feeling and prohibits
  pixel-perfect reproduction of Grinding Gear Games UI or assets.
- No exact official screenshot, composition, or asset is mandatory for v0.1.
  Visual design remains flexible within the stable rules below.

---

# 1. Purpose

Let a desktop player pan and zoom through the complete Act 1 map, select an area,
and quickly read Spanish area, boss, and Hardcore information before entering
the area or fighting a boss.

---

# 2. v0.1 visual model

- The application displays one map: the bundled Act 1 snapshot.
- There is no Act selector or dataset selector.
- The complete visible campaign-map content corresponds to Act 1.
- Areas are selectable map nodes.
- Lines between areas represent direct in-game transitions.
- A normal connection communicates bidirectional traversal.
- A connection explicitly directed by the data has a distinct one-way
  treatment.
- The map is the primary navigation surface.
- Pan and zoom navigate the map; click selects an area.
- No area is selected when the map first opens.
- The selected-area preview separates:
  1. area identity and area-level safety information;
  2. area-level rewards, points of interest, and curiosities;
  3. one independent block or card per boss;
  4. area and boss trust metadata at their respective record scope.
- The interface and visible status labels are Spanish.
- The design targets a normal desktop browser. Mobile layout is outside v0.1.

The exact placement of the preview relative to the map is visual-design
latitude, provided selection, hierarchy, and record ownership remain
unambiguous.

---

# 3. Stable visual rules

- Act 1 is identifiable without offering navigation to another Act.
- Area nodes and transition lines cannot be confused with decoration.
- The map does not visually claim recommended route, quest dependency, or
  chronological order.
- Selected area and keyboard focus are visually distinguishable.
- The preview names the selected area and shows its area level.
- Area danger rating and HC warning are separate area-level elements.
- The danger rating includes its approved Spanish text label:
  `Bajo`, `Medio`, `Alto`, `Extremo`, or `Desconocido`.
- The HC warning is short free text and does not look like a rating or a boss
  verification status.
- Every known boss has its own block or card.
- Boss damage types, weaknesses, resistances, dangerous mechanics, and
  boss-specific rewards remain inside the corresponding boss block.
- General rewards, points of interest, and curiosities remain in the area-level
  section.
- Area and boss verification are shown independently as `Verificado` or
  `Sin verificar`.
- Sources and optional verification date are associated visually with the area
  or boss record they describe.
- A single global `Verificado` badge MUST NOT imply that all campaign
  information is verified.
- Unknown knowledge is visible as the grammatically appropriate form of
  `Desconocido`.
- Verified absence is visible as the grammatically appropriate form of
  `Ninguno`.
- Empty space, an omitted value, and `Ninguno` cannot be used to mean
  `Desconocido`.
- `Desconocido` danger cannot look equivalent to `Bajo`.
- Spoiler-bearing information may be visible without a reveal interaction.
- Visual atmosphere cannot reduce the legibility of area names, transitions,
  directionality, safety information, knowledge state, focus, or trust
  metadata.
- The design may derive mood from official Path of Exile 2 material but cannot
  copy game UI, typography, icons, maps, or assets pixel-for-pixel.

---

# 4. States

## Default

- The valid complete Act 1 map is available for pan and zoom.
- No area is selected.
- No area or boss preview from a previous selection is visible.
- The preview surface prompts the user in Spanish to select an area.

## Area selected

- Exactly one area has selected styling.
- The preview names that same area and displays, in this information hierarchy:
  1. area name and level;
  2. area danger rating and HC warning;
  3. area verification, sources, and optional verification date;
  4. area-level notable rewards, points of interest, and curiosities;
  5. one block per known boss.
- Each boss block keeps its own name, optional description, combat knowledge,
  boss-specific rewards, verification, sources, and optional verification date.
- Selecting another area removes the previous selected styling and replaces all
  area and boss preview content.

## Known value

- The established value is shown in the relevant area or boss section.
- Its owning record's verification and source metadata remain associated with
  that section.

## Verified absence

- The field remains visible.
- The value is the grammatically appropriate Spanish form of `Ninguno`.
- It does not look like unknown knowledge.

Examples:

- `Jefe: Ninguno`
- `Recompensas: Ninguna`

## Unknown knowledge

- The field remains visible.
- The value is the grammatically appropriate Spanish form of `Desconocido`.
- It does not look like verified absence or a known low-risk value.

Examples:

- `Jefe: Desconocido`
- `Recompensas: Desconocidas`

## Record verified with an unknown optional value

- The area or boss record displays `Verificado`.
- Its unknown optional field independently displays `Desconocido`.
- The visual treatment does not imply that `Verificado` makes every optional
  value known.

## Record not sufficiently verified

- The affected area or boss record displays `Sin verificar`.
- Other records preserve and display their own independent verification state.

## Dataset error

- The application presents one global Spanish dataset-error state.
- The Act 1 map is not rendered.
- No partial graph, area node, connection, or area preview is presented.

Missing Act 1, an Act 1 with no areas, and every other approved structural error
use this same state. There is no empty-map, empty-Act, or partially recovered-map
state in v0.1.

## Panned / zoomed

- Pan or zoom changes the visible region or scale without changing selection.
- The selected node and preview remain synchronized.

---

# 5. Interactions

| Action | Required result |
|---|---|
| Open a valid v0.1 dataset | Show the complete Act 1 map with no selected area. |
| Pan the map | Move the visible map region without changing selection. |
| Zoom the map | Change map scale without changing selection. |
| Click an area | Make that area the only selected area and show its matching preview. |
| Click a different area | Move selection and replace the complete area/boss preview. |
| Reach an area through basic keyboard navigation | Give the area visible focus without selecting it merely because it received focus. |
| Activate a focused area | Produce the same selection and preview as clicking it. |
| Encounter unknown optional knowledge | Keep the owning area or boss record usable and show `Desconocido` for that field. |
| Encounter verified absence | Keep the field visible and show `Ninguno` instead of `Desconocido`. |
| Encounter multiple bosses | Show a separate block for each boss and keep each boss's facts and trust metadata inside its block. |
| Encounter a structural dataset error | Replace the map experience with the global dataset-error state; show no partial map. |

Advanced spatial keyboard navigation is not required in v0.1.

No v0.1 acceptance behaviour is claimed for clicking empty map space, exact
pan/zoom limits, or reset/fit controls.

---

# 6. Visual invariants

- Only the Act 1 map is presented.
- No Act or dataset selector is visible.
- No area appears selected initially.
- At most one area appears selected.
- Selected node and preview always refer to the same area.
- A line styled as a connection represents a direct in-game transition.
- Bidirectional and explicitly directed connections communicate different
  directionality.
- Connection styling never claims route recommendation, quest dependency, or
  chronology.
- Any structural error suppresses the complete map.
- Area danger and HC warning remain separate.
- Area-level information and boss-level information remain separate.
- Each boss's combat facts and boss-specific rewards remain inside that boss's
  block.
- Area and boss verification remain independent.
- `Verificado` may coexist with an optional `Desconocido` value in the same
  record.
- No global badge claims that the complete dataset is verified.
- `Desconocido` and `Ninguno` remain visibly distinct.
- `Desconocido` danger and `Bajo` remain visibly distinct.
- Internal English enum values are not shown as untranslated UI labels.
- Focus remains perceptible when an area is selected.
- Decorative art does not obscure required information or actions.

---

# 7. v0.1 accessibility and usability

- Every selectable area can receive keyboard focus.
- Focus is visibly perceptible.
- Activating a focused area produces the same observable result as clicking it.
- Area controls expose an accessible name.
- Danger values include the approved Spanish text label and do not depend only
  on colour.
- Preview information is not available exclusively through hover.
- The Act 1 map remains visually responsive during pan, zoom, and area
  selection in a normal desktop browser.
- Mobile interaction, advanced spatial keyboard navigation, a complete
  non-visual graph, and a formal performance budget are outside v0.1.

---

# 8. Non-blocking visual latitude

The following are not v0.1 product requirements and do not block Example
Mapping:

- exact map-node geometry and decorative treatment;
- exact preview placement;
- exact typography, iconography, and animation;
- exact pan/zoom limits and optional reset controls;
- clicking empty map space;
- exact sequential keyboard focus order, provided every area is reachable;
- a formal WCAG target beyond the required basic keyboard behaviour.

Any chosen treatment must preserve the stable rules and invariants in this
document.

---

# 9. Resolution of the seven Challenger findings

| Challenger finding | Status | Visual specification section |
|---|---|---|
| Campaign and dataset scope conflict | **RESOLVED** | Sections 2, 4, and 6: one complete Act 1 map with no Act or dataset selector. |
| Spanish UI versus English status labels | **RESOLVED** | Sections 3, 4, and 6: mandatory Spanish labels for danger, verification, unknown knowledge, and absence. |
| Structural-invalid behaviour versus partial recovery | **RESOLVED** | Sections 4–6: one global error, no map, and no partial graph. |
| Missing information versus verified absence | **RESOLVED** | Section 4: distinct visible `Desconocido` and `Ninguno` states. |
| Danger rating versus HC warning | **RESOLVED** | Sections 3, 4, and 6: separate area-level elements with different visual meaning. |
| Boss facts associated with individual bosses | **RESOLVED** | Sections 3–6: one boss block per boss with no flattening. |
| Verification and source scope | **RESOLVED** | Sections 3, 4, and 6: independent area/boss metadata and no global verified badge. |

---

# 10. Approval

**Approved by:** Pending  
**Date:** Pending  
**Notes:** Reconciled with all approved v0.1 blocking decisions and ready for
Example Mapping review.
