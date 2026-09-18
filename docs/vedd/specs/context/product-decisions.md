# Campaign Map Product Decisions — v0.1

## Target

Desktop-first web application.

Mobile support is not required for v0.1.

## Spoilers

Spoilers are allowed.

The application's purpose is to provide information
before entering an area or fighting a boss.

## Initial state

No area is selected initially.

## Navigation

Primary navigation:
pan + zoom + click.

Keyboard accessibility should support basic navigation,
but advanced spatial keyboard navigation is not required
for v0.1.

## Connections

A connection means the player can transition directly
between the two areas in game.

Connections are bidirectional unless the domain data
explicitly states otherwise.

## Preview

Selecting an area shows:

- area name
- area level
- bosses
- boss damage types
- boss weaknesses/resistances
- dangerous mechanics
- notable rewards
- points of interest
- HC warning

## Hardcore danger

v0.1 uses:

LOW
MEDIUM
HIGH
EXTREME

Danger is editorial guidance, not an objective game value.

UNKNOWN is different from LOW.

## Missing data

Missing or unresearched information is displayed as:

Unknown

It must never silently mean:

None

## v0.1 scope

Platform:
Desktop-first web application.

Language:
Spanish.

Campaign scope:
Act 1 only.

Dataset:
One local bundled dataset.
No runtime dataset selection.
No remote loading.

Initial dataset:
A curated Act 1 snapshot created for v0.1.

Map composition:
The application displays one Act at a time.
v0.1 contains only Act 1.

Cross-Act connections:
Out of scope for v0.1.

## Hardcore danger

Danger rating is editorial guidance provided by PoE2 Companion.

It is not an official Path of Exile 2 game statistic.

Possible values:

- LOW
- MEDIUM
- HIGH
- EXTREME
- UNKNOWN

UNKNOWN means that the risk has not been sufficiently evaluated.
It must never be interpreted as LOW.

VERIFIED:
The information has been manually checked against an accepted source.

UNKNOWN:
The information has not yet been sufficiently verified.

## Invalid Dataset

STRUCTURE INVALID
→ app shows dataset error

OPTIONAL KNOWLEDGE MISSING
→ app continues and shows Unknown

For v0.1 the Act 1 map must remain visually responsive
during pan, zoom and area selection on a normal desktop browser.

Formal performance budgets are deferred.

## Deferred after v0.1

The following capabilities are explicitly out of scope for v0.1
and must not block specification approval or implementation:


- Multiple datasets.
- Runtime dataset selection.
- Cross-Act connections.
- Automatic freshness rules.
- Conflicting-source resolution.
- Dataset migrations.
- Formal performance budget.
- Detailed danger scoring methodology.

## v0.1 Blocking Decisions

The following decisions are authoritative for Campaign Map v0.1 and resolve the remaining blocking ambiguities identified by the VEDD Challenger.

### 1. Campaign and dataset scope

v0.1 is a desktop-first Spanish web application containing **Act 1 only**.

The application uses exactly **one bundled local dataset**.

For v0.1:

* there is no runtime dataset selection;
* there is no remote dataset loading;
* there is no Act selector;
* there are no cross-Act connections;
* the complete visible campaign map corresponds to Act 1.

Any previous specification language describing multiple Acts, dataset selection, or runtime dataset switching is superseded by this decision.

---

### 2. Domain values and displayed language

Canonical domain values may use English identifiers internally.

Examples:

* `LOW`
* `MEDIUM`
* `HIGH`
* `EXTREME`
* `UNKNOWN`
* `VERIFIED`

The v0.1 user interface is Spanish and MUST localize these values.

Danger:

* `LOW` → `Bajo`
* `MEDIUM` → `Medio`
* `HIGH` → `Alto`
* `EXTREME` → `Extremo`
* `UNKNOWN` → `Desconocido`

Knowledge value:

* `UNKNOWN` → `Desconocido`

Verification:

* `VERIFIED` → `Verificado`
* `UNKNOWN` → `Sin verificar`

Internal identifiers are not required to match visible labels.

---

### 3. Structurally invalid datasets

v0.1 does not attempt partial structural recovery.

A structurally invalid dataset produces a **global dataset error** and the campaign map is not rendered.

The following are structural errors:

* dataset cannot be parsed;
* unsupported schema;
* missing Act 1;
* Act 1 contains no areas;
* duplicate required identifiers;
* required references are missing;
* a connection references an unknown area.

Missing optional knowledge is NOT a structural error.

Examples:

* boss weakness unknown → map remains usable;
* reward information unknown → map remains usable;
* boss description unknown → map remains usable.

There is no partially recovered graph in v0.1.

---

### 4. Unknown information versus verified absence

`Unknown` and `None` have different meanings.

**Unknown / Desconocido**

The application does not currently have sufficiently established information.

**None / Ninguno**

The information has been checked and the entity is known not to contain that element.

Examples:

* boss not yet researched → `Jefe: Desconocido`
* area verified to contain no boss → `Jefe: Ninguno`
* rewards not yet researched → `Recompensas: Desconocidas`
* area verified to contain no notable reward → `Recompensas: Ninguna`

An empty value must never silently mean `Unknown`.

The data model must preserve the distinction between:

* known value;
* verified absence;
* unknown knowledge.

---

### 5. Hardcore danger and HC warning

Hardcore information has two separate area-level concepts.

#### Danger rating

A structured editorial value:

* LOW
* MEDIUM
* HIGH
* EXTREME
* UNKNOWN

It applies to the **selected area as a whole**.

#### HC warning

A short free-text explanation describing why the area may be dangerous for a Hardcore character.

Example:

`Danger rating: HIGH`

`HC warning: High burst physical damage and dangerous crowd control in confined spaces.`

The HC warning may summarize boss or area mechanics but remains an **area-level summary**.

Per-boss danger ratings are out of scope for v0.1.

---

### 6. Boss information

Boss combat information is always associated with the individual boss it describes.

If an area contains multiple bosses, the UI displays a separate boss block/card for each boss.

Each boss may contain:

* name;
* description;
* damage types;
* weaknesses;
* resistances;
* dangerous mechanics;
* boss-specific rewards;
* verification metadata.

Boss facts MUST NOT be flattened into a single aggregated area-level list when multiple bosses exist.

Area-level information remains separate, including:

* general rewards;
* points of interest;
* general curiosities;
* area danger rating;
* HC warning.

A reward explicitly associated with a boss belongs to that boss.
A general quest or area reward belongs to the area.

---

### 7. Verification and source scope

Verification is attached to **knowledge records**, not to the complete application or dataset.

For v0.1 there are two relevant record scopes:

1. Area knowledge
2. Boss knowledge

Each area and each boss independently contains:

* verification status;
* one or more sources when available;
* optional verification date.

Verification states:

* `VERIFIED`
* `UNKNOWN`

`VERIFIED` means that the record has been manually checked against at least one accepted source.

It does NOT mean that every optional fact is known.

Therefore a boss may be:

`verificationStatus: VERIFIED`

while:

`weakness: UNKNOWN`

This means that the record itself has been checked and the current accepted knowledge still does not establish that particular value.

`UNKNOWN` verification status means that the record as a whole has not yet been sufficiently checked.

The UI MUST NOT show a single global `Verified` badge implying that every piece of information in the dataset is verified.

Area and boss verification may be displayed independently.

---

## Resulting v0.1 semantics

The following distinctions are therefore mandatory:

* `LOW` ≠ `UNKNOWN` danger.
* missing knowledge ≠ verified absence.
* area danger ≠ boss combat data.
* area information ≠ boss information.
* structurally invalid data ≠ incomplete optional knowledge.
* internal enum value ≠ localized UI label.
* verified record ≠ every optional property known.
