# VEDD — Visual Evidence-Driven Development

**Version:** 0.1  
**Status:** Working methodology / living manual  
**Purpose:** Human + AI operating manual for AI-assisted software development  
**Working name:** **VEDD — Visual Evidence-Driven Development**

---

## 1. What VEDD is

**Visual Evidence-Driven Development (VEDD)** is an AI-native software development methodology that combines:

- visual intent and mockups;
- specification-driven development;
- executable examples and acceptance criteria;
- incremental end-to-end development;
- automated testing and architectural fitness functions;
- periodic convergence/refactoring;
- explicit human approval gates;
- AI coding assistants as implementers, critics, test designers and auditors.

The central idea is simple:

> **Do not trust generated code because it looks plausible. Define intent clearly, turn important expectations into executable evidence, develop the system in connected slices, and accept changes only when the required evidence passes.**

VEDD does **not** try to eliminate human judgment. It changes where human judgment has the highest leverage.

Instead of spending most human effort reading every generated line of code, the human focuses primarily on:

1. what the product should do;
2. what it should look and feel like;
3. which behaviours are important;
4. which trade-offs and architectural constraints matter;
5. what evidence is sufficient to accept a change;
6. which risks deserve direct code review.

The AI can then perform a large part of the mechanical translation from intent to implementation, but it works inside explicit constraints.

---

# 2. Why the name VEDD

The name highlights the two ends of the process.

## Visual

For user-facing software, intent is often easier to express visually than through prose alone.

A mockup can communicate simultaneously:

- hierarchy;
- layout;
- information density;
- visual priority;
- interaction affordances;
- component relationships;
- expected states;
- style and tone.

VEDD treats images, sketches, diagrams and UI references as **specification inputs**, not merely inspiration.

## Evidence-Driven

A feature is not considered complete because:

- the agent says it is complete;
- the code compiles;
- the UI looks plausible;
- unit tests happen to be green.

Completion requires **evidence** appropriate to the risk of the feature.

That evidence can include:

- executable acceptance scenarios;
- Gherkin scenarios;
- contract tests;
- unit tests;
- integration tests;
- property-based tests;
- visual regression checks;
- coverage;
- mutation testing;
- static analysis;
- dependency rules;
- architectural fitness functions;
- performance checks;
- security checks;
- QA procedures;
- human exploratory validation.

---

# 3. Relationship with existing methodologies

VEDD is not intended to pretend that its ingredients are new.

It deliberately combines ideas from established practices:

- **Spec-Driven Development (SDD):** specifications are first-class development artifacts.
- **BDD / Specification by Example:** behaviour is clarified using concrete examples and executable specifications.
- **ATDD / Outside-In Development:** important acceptance behaviour is defined before implementation.
- **Walking Skeleton:** establish a minimal connected system early.
- **Tracer Bullets:** build thin end-to-end paths that provide fast feedback.
- **Evolutionary Architecture:** architecture evolves incrementally while automated fitness functions protect important characteristics.
- **Continuous Integration:** integration is continuous rather than postponed.
- **TDD:** lower-level tests can guide implementation where useful.
- **Visual/Design-Driven Development:** designs and visual artifacts help drive implementation.

VEDD's distinctive emphasis is the combination:

```text
VISUAL INTENT
     ↓
HUMAN-REVIEWED SPEC
     ↓
EXECUTABLE EXPECTATIONS
     ↓
CONNECTED INCREMENTAL DEVELOPMENT
     ↓
AUTOMATED EVIDENCE
     ↓
CONVERGENCE / ARCHITECTURAL CONTROL
```

VEDD is designed specifically for development in which an AI coding assistant can produce a large amount of implementation quickly.

---

# 4. The VEDD trust model

VEDD does **not** use the following trust model:

```text
Prompt
  ↓
AI generates code
  ↓
AI says "done"
  ↓
Human assumes success
```

It also tries to avoid making this the only model:

```text
AI generates 2,000 lines
  ↓
Human manually reviews 2,000 lines
  ↓
Merge
```

Manual code review remains useful, especially for high-risk changes, but it should not be the only line of defence.

VEDD prefers:

```text
Human intent
    ↓
Reviewed specifications
    ↓
Protected expectations
    ↓
AI implementation
    ↓
Independent automated checks
    ↓
Evidence report
    ↓
Targeted human review
```

The key principle is:

> **Confidence should come from multiple, partially independent sources of evidence.**

A unit test written by the same agent that wrote the implementation is useful, but it is weak evidence on its own.

A stronger system combines it with acceptance criteria, contract tests, independent test generation, mutation testing, QA or other gates.

---

# 5. Normative language

In this manual:

- **MUST** = mandatory for VEDD compliance.
- **MUST NOT** = prohibited unless an explicit human override is recorded.
- **SHOULD** = default practice; deviation is acceptable with a reason.
- **SHOULD NOT** = normally avoid.
- **MAY** = optional.
- **HUMAN GATE** = an action that an AI must not silently approve on behalf of the human.

These words are intentionally useful for both humans and coding assistants.

---

# 6. Core principles

## Principle 1 — Intent before implementation

The system MUST have enough defined intent before implementation begins.

Intent can come from:

- visual references;
- product requirements;
- business rules;
- constraints;
- examples;
- workflows;
- non-functional requirements.

The objective is not perfect upfront design. The objective is to prevent implementation from becoming the first place where product decisions are made accidentally.

---

## Principle 2 — Visual artifacts are specification inputs

For visual or interaction-heavy features, VEDD SHOULD begin with one or more visual representations.

A single happy-path mockup is not sufficient when alternate states materially affect behaviour.

Important states SHOULD be represented explicitly or described alongside the visual reference.

Examples:

- default;
- selected;
- empty;
- loading;
- error;
- disabled;
- permission denied;
- full capacity;
- offline;
- responsive/mobile;
- large-data state.

---

## Principle 3 — Define capabilities before internal architecture

Early planning SHOULD describe **capabilities and boundaries** rather than prematurely dictating classes and implementation structures.

Prefer:

```text
Inventory
Character creation
Equipment
Persistence
Combat
Progression
```

over:

```text
InventoryManager
InventoryRepository
EquipmentMediator
CharacterFactory
```

unless those technical structures are already known architectural constraints.

VEDD defers unnecessary implementation decisions while preserving important boundaries and contracts.

---

## Principle 4 — The AI challenges the specification before implementing it

An AI assistant SHOULD actively search for:

- ambiguity;
- contradictions;
- missing states;
- undefined edge cases;
- inconsistent terminology;
- missing modules/capabilities;
- unnecessary modules;
- hidden dependencies;
- untestable requirements;
- non-functional requirements that have been forgotten.

The AI MUST distinguish:

```text
"the specification is incomplete"
```

from:

```text
"I prefer another implementation"
```

The first is a product/specification concern.  
The second is an implementation decision.

---

## Principle 5 — Human approval controls intent

The human owns final approval of:

- product intent;
- UX intent;
- scope;
- acceptance rules;
- important examples;
- business invariants;
- major architectural constraints;
- acceptable risk.

An AI MAY propose changes but MUST NOT silently rewrite approved intent to make implementation easier.

---

## Principle 6 — Important behaviour becomes executable

Not every sentence in a specification needs a test.

However, behaviour whose failure would mean "this feature is wrong" SHOULD be represented by executable evidence whenever practical.

That evidence should normally test **observable behaviour**, not internal implementation.

---

## Principle 7 — Grow a connected system

VEDD SHOULD establish a **Walking Skeleton** early.

The system should become minimally connected before individual modules become highly complete in isolation.

The goal is to discover integration assumptions early.

---

## Principle 8 — Prioritize the weakest critical path, not the emptiest module

Development SHOULD NOT simply select the least-developed module.

The next slice should preferentially reduce the most important combination of:

- product risk;
- integration risk;
- uncertainty;
- architectural risk;
- user value;
- dependency blockage.

This is called the **Weakest Critical Path rule**.

---

## Principle 9 — Evidence is layered

No single metric proves correctness.

VEDD combines evidence at different levels:

```text
Intent
Behaviour
Module correctness
Integration
Architecture
Operational quality
Human judgement
```

Coverage alone is insufficient.  
Unit tests alone are insufficient.  
Gherkin alone is insufficient.  
QA alone is insufficient.

The appropriate combination depends on risk.

---

## Principle 10 — Architecture is continuously protected

Important architectural characteristics SHOULD be expressed as automated rules where practical.

Examples:

- forbidden dependencies;
- no cycles;
- maximum complexity;
- dependency direction;
- API compatibility;
- type safety;
- module boundaries;
- performance budgets.

These are called **fitness functions**.

---

## Principle 11 — Convergence is explicit

AI-generated development can create:

- dead code;
- duplicate implementations;
- abandoned endpoints;
- speculative abstractions;
- unused adapters;
- stale tests;
- spec/code drift.

VEDD therefore includes explicit **Convergence Gates**.

The objective is not only to add functionality, but periodically to simplify the system back toward a coherent state.

---

# 7. Roles

A single human and a single coding assistant can perform all VEDD roles, but the roles should remain conceptually distinct.

## 7.1 Product Owner / Human Director

Responsible for:

- intent;
- product priorities;
- visual preferences;
- acceptance decisions;
- risk tolerance;
- final approval of specs;
- unresolved product decisions.

---

## 7.2 Specifier Agent

Responsible for:

- translating intent into structured specs;
- discovering missing cases;
- documenting rules;
- identifying questions;
- maintaining traceability.

It SHOULD NOT implement code while acting in this role.

---

## 7.3 Challenger Agent

Responsible for attacking the specification.

Questions include:

- What is ambiguous?
- What happens at boundaries?
- What happens when dependencies fail?
- Which states are missing?
- Are two requirements contradictory?
- Is this requirement testable?
- What assumption is being made implicitly?

The Specifier creates clarity.  
The Challenger tries to break that clarity.

They MAY be the same model in separate passes/context.

---

## 7.4 Test Designer

Responsible for deriving:

- examples;
- Gherkin;
- acceptance tests;
- properties;
- contract tests;
- QA procedures.

It SHOULD primarily derive these from approved intent rather than from existing implementation.

---

## 7.5 Implementer Agent

Responsible for:

- implementation;
- local unit tests;
- refactoring;
- integration;
- satisfying approved acceptance evidence.

The Implementer MUST NOT weaken protected tests/specifications without explicit permission.

---

## 7.6 Hardener Agent

Responsible for deliberately looking for ways the current implementation can fail.

Possible tools:

- mutation testing;
- property testing;
- fuzzing;
- edge-case generation;
- security scanning;
- concurrency checks;
- performance checks.

---

## 7.7 Auditor / Convergence Agent

Responsible for detecting:

- dead code;
- redundant endpoints;
- duplicate logic;
- unnecessary dependencies;
- stale adapters;
- orphaned modules;
- excessive complexity;
- broken boundaries;
- spec/code drift;
- architectural erosion.

---

# 8. Authority hierarchy

When artifacts disagree, VEDD uses an explicit hierarchy.

Recommended default:

```text
1. Human-approved product intent / constitution
2. Human-approved feature specification
3. Human-approved acceptance rules and examples
4. Architectural decisions / constraints
5. Executable acceptance tests
6. Implementation plan
7. Unit tests tied to implementation
8. Existing code
```

Code is **not automatically the source of truth**.

If code contradicts an approved spec, the agent should report the conflict.

If the real product has legitimately changed, update and approve the spec first or as part of the same controlled change.

---

# 9. Protected vs mutable artifacts

A major VEDD rule is to distinguish artifacts an implementation agent can freely change from those it cannot.

## Protected by default

- approved `spec.md`;
- approved visual intent;
- acceptance rules;
- approved Gherkin scenarios;
- important business invariants;
- security requirements;
- architectural constraints.

The Implementer MUST NOT change these solely to obtain a green build.

---

## Mutable by implementation

Normally:

- implementation source code;
- internal helper classes;
- internal module structure;
- local unit tests;
- test fixtures;
- refactoring;
- private interfaces;
- internal data structures.

Major architectural changes may require a human gate depending on project policy.

---

# 10. Recommended repository structure

VEDD is tool-agnostic, but a repository SHOULD make the methodology visible.

Example:

```text
/
├─ docs/
│  └─ vedd/
│     ├─ constitution.md
│     ├─ capability-map.md
│     ├─ architecture.md
│     ├─ glossary.md
│     ├─ visuals/
│     │  ├─ inventory/
│     │  │  ├─ default.png
│     │  │  ├─ selected.png
│     │  │  └─ empty.png
│     │  └─ character-creation/
│     ├─ specs/
│     │  ├─ inventory/
│     │  │  ├─ spec.md
│     │  │  ├─ visual-spec.md
│     │  │  ├─ examples.md
│     │  │  ├─ acceptance.feature
│     │  │  ├─ qa.md
│     │  │  └─ evidence.md
│     │  └─ character-creation/
│     ├─ decisions/
│     │  └─ ADR-001-....md
│     └─ audits/
│        └─ convergence-YYYY-MM-DD.md
├─ src/
├─ tests/
└─ ...
```

The exact directory structure MAY change.  
The important thing is that intent, evidence and implementation remain traceable.

---

# 11. Project constitution

Each VEDD project SHOULD have a small `constitution.md`.

It contains rules that apply to all features.

Example categories:

## Product constraints

```text
- Desktop first.
- All destructive operations require confirmation.
- Offline mode is not part of v1.
```

## Engineering constraints

```text
- Type checking must pass.
- Domain layer must not depend on UI.
- New public endpoints require contract tests.
- No hidden network calls in unit tests.
```

## AI operating constraints

```text
- Do not modify approved acceptance criteria without approval.
- Do not introduce a dependency if the standard library or existing dependency is sufficient without explaining why.
- Prefer existing patterns before creating a new abstraction.
- Report assumptions explicitly.
- Never claim completion without running the relevant evidence gates.
```

The constitution is intentionally short and stable.

---

# 12. Phase 0 — Product framing

Before features are decomposed, capture:

- product goal;
- target users;
- primary user journeys;
- explicit non-goals;
- technical constraints;
- deployment environment;
- important quality attributes;
- known risks.

Example:

```markdown
## Goal
Create a turn-based RPG prototype where a player can create a character,
manage equipment, fight enemies and persist progression.

## Non-goals
- Multiplayer
- Procedural world generation
- Mod support

## Critical qualities
- Save data must remain backwards compatible inside the prototype lifecycle.
- Inventory actions must never silently destroy items.
```

---

# 13. Phase 1 — Visual Intent

## 13.1 Generate or create reference images

Create references for important user-facing features.

Example:

```text
Character creation
Inventory
Equipment
Combat
Map
Settings
Save selection
```

The goal is not pixel-perfect completeness.  
The goal is to reduce ambiguity.

---

## 13.2 Turn images into Visual Specs

Every important visual reference SHOULD have a companion `visual-spec.md`.

Example:

```markdown
# Inventory — Visual Spec

## References
- default.png
- selected.png
- empty.png

## Purpose
Allow the player to inspect, equip, move and discard inventory items.

## Stable visual rules
- Character summary remains visible.
- Capacity indicator is always visible.
- Equipped items are visually distinguished.
- Item rarity is visible without opening details.

## States
### Default
No item selected.

### Selected
The selected item shows details and available actions.

### Empty
Empty slots remain visible and capacity reads 0/40.

### Full
Capacity reads 40/40 and adding a new non-stackable item is rejected.

## Interactions
- Select item → show details.
- Equip → move item to relevant equipment slot.
- Drop → requires confirmation.
```

---

## 13.3 Visual references are constraints, not implementation diagrams

A mockup MUST NOT force unnecessary code structure.

It expresses expected experience and behaviour, not the internal architecture.

---

# 14. Phase 2 — Capability Map

Create a map of what the system must be capable of doing.

Example:

```text
Game
├─ Character
│  ├─ Creation
│  ├─ Attributes
│  └─ Progression
├─ Inventory
│  ├─ Storage
│  ├─ Stacking
│  └─ Item actions
├─ Equipment
├─ Combat
├─ Persistence
└─ UI
```

At this stage, focus on:

- responsibility;
- boundaries;
- interactions;
- critical dependencies.

Avoid unnecessary implementation detail.

---

# 15. Phase 3 — Feature Specification

Each significant feature receives a `spec.md`.

Recommended template:

```markdown
# Feature: <name>

## 1. Purpose
Why does this feature exist?

## 2. User / system value
Who benefits and how?

## 3. In scope
-

## 4. Out of scope
-

## 5. Rules
1.
2.
3.

## 6. States
-

## 7. Inputs
-

## 8. Outputs
-

## 9. Failure behaviour
-

## 10. Dependencies
-

## 11. Non-functional requirements
-

## 12. Open questions
-

## 13. Acceptance summary
-
```

A good spec describes **what must be true**, not every detail of how it will be implemented.

---

# 16. Phase 4 — Specification Challenge

Before implementation, run a challenge pass.

The AI SHOULD ask questions like:

### Boundary questions

- What happens at 0?
- What happens at maximum capacity?
- What happens just above/below a threshold?
- What happens with an empty value?
- What happens with duplicates?

### Failure questions

- What if persistence fails?
- What if an API times out?
- What if the entity no longer exists?
- What if the data is corrupt?

### State questions

- Can this action occur twice?
- Is it idempotent?
- Which transitions are illegal?
- Can two states exist simultaneously?

### Integration questions

- Which feature owns the data?
- What is the contract between modules?
- Who validates the input?
- What happens when versions disagree?

### UX questions

- What is shown during loading?
- What is shown after failure?
- Can the user recover?
- Is a destructive operation reversible?

The output is a list of:

```text
RESOLVED
ASSUMPTION
OPEN QUESTION
SPEC CHANGE PROPOSAL
```

Open product questions SHOULD be resolved before their behaviour is implemented.

---

# 17. Phase 5 — Example Mapping

Before creating detailed executable scenarios, derive concrete examples.

Structure:

```text
FEATURE
  ├─ RULE
  │   ├─ EXAMPLE
  │   ├─ EXAMPLE
  │   └─ EXAMPLE
  └─ QUESTION
```

Example:

```markdown
# Inventory — Examples

## Rule: inventory has a maximum of 40 slots

### Example: add item below capacity
Given 39 occupied slots
When a non-stackable item is added
Then the inventory contains 40 occupied slots

### Example: add item at capacity
Given 40 occupied slots
When a non-stackable item is added
Then the item is not added
And the caller receives `inventory_full`

### Question
Does adding to an existing stack consume another slot?
```

Example Mapping is valuable because it exposes ambiguity **before code makes the decision accidentally**.

---

# 18. Phase 6 — Executable Expectations

Important examples become machine-checkable evidence.

Not every example needs Gherkin.  
Use the representation that best communicates the behaviour.

---

## 18.1 Gherkin / BDD scenarios

Recommended for business-visible behaviour and end-to-end flows.

```gherkin
Feature: Inventory capacity

  Scenario: Player attempts to add an item to a full inventory
    Given the player's inventory is full
    When the player receives a new non-stackable item
    Then the new item is not added
    And the player is informed that the inventory is full
```

Gherkin SHOULD describe behaviour rather than UI implementation details unless the UI behaviour itself is the requirement.

Prefer:

```gherkin
When the player equips the sword
```

over:

```gherkin
When the player clicks the blue button at x=420
```

---

## 18.2 Acceptance tests

Acceptance tests prove important feature-level behaviour.

They SHOULD be derivable from the approved spec/examples and ideally exist before the corresponding implementation is complete.

---

## 18.3 Contract tests

Use contracts at module/service boundaries.

Example contract:

```text
Inventory → Equipment

Input:
  item_id
  target_slot

Possible results:
  equipped
  incompatible_item
  missing_item
  slot_locked
```

A contract test verifies that both sides agree.

Contract tests are especially important in VEDD because modules evolve incrementally and continuously interact.

---

## 18.4 Property-based tests

Use properties for behaviour that must hold over many inputs.

Examples:

```text
Inventory count is never negative.

Saving and immediately loading a valid game preserves all
persistent player state.

Equipping an item never duplicates that item.

Sorting an inventory never changes the multiset of items.
```

Properties are especially useful when example tests cannot reasonably enumerate the input space.

---

## 18.5 QA procedures

Some important behaviour remains best verified from a user/system perspective.

Example:

```markdown
# QA: Character creation persistence

1. Launch a fresh game.
2. Create a character named "Asha".
3. Select class "Ranger".
4. Save the game.
5. Close the application.
6. Reopen the application.
7. Load the save.
8. Verify the character is named "Asha".
9. Verify the class remains "Ranger".
10. Verify no default values replaced the selected configuration.
```

QA may be manual, automated or partially automated.

---

# 19. What is defined before code vs during code

This distinction is critical.

## Prefer before implementation

- product rules;
- visual states;
- important examples;
- acceptance behaviour;
- Gherkin;
- public contracts;
- important invariants;
- failure semantics;
- QA expectations.

## Usually during implementation

- internal unit tests;
- helper-level tests;
- private implementation structure;
- low-level refactoring;
- internal fixtures;
- private interfaces.

Why?

Because feature-level evidence should remain relatively independent from the implementation.

If the spec says:

```text
A full inventory rejects a new item.
```

the test should not require:

```text
InventoryManager.validateCapacity()
```

unless that function itself is a public contract.

---

# 20. Phase 7 — Build the Walking Skeleton

Before maximizing the completeness of individual modules, establish a minimal connected path through the system.

For a game:

```text
Launch
  ↓
Create minimal character
  ↓
Enter minimal game state
  ↓
Receive one item
  ↓
Open inventory
  ↓
Save
  ↓
Reload
```

Each step can initially be primitive.

The important thing is that the product architecture is exercised end-to-end.

This reveals:

- incompatible assumptions;
- broken interfaces;
- missing state ownership;
- persistence problems;
- deployment issues;
- integration gaps.

A Walking Skeleton is not a fake demo that bypasses architecture.  
It is a thin but real path through the intended system.

---

# 21. Phase 8 — Incremental Slice Development

Once a Walking Skeleton exists, develop vertical or cross-module slices.

A slice should add a small amount of real behaviour while preserving system integration.

Example:

```text
Slice 1:
Create character with name only → save → reload.

Slice 2:
Add class selection → save → reload.

Slice 3:
Add starter equipment → inventory → save → reload.

Slice 4:
Equip starter weapon → combat uses weapon stats.
```

The objective is continuous executable growth.

---

# 22. Selecting the next slice — Weakest Critical Path

VEDD replaces:

> "Work on the least complete module."

with:

> **"Work on the part that currently creates the most important weakness in the system's ability to deliver or prove value."**

Use the following dimensions.

| Dimension | Question |
|---|---|
| User value | Does this unlock an important user journey? |
| Dependency impact | Are other features blocked by it? |
| Integration risk | Are we postponing an important integration? |
| Uncertainty | Do we still not know whether the approach works? |
| Architectural risk | Could this force a major redesign later? |
| Evidence gap | Is an important behaviour currently difficult to prove? |
| Neglect | Has this area remained untested or disconnected for too long? |

A simple optional score:

```text
Priority =
  3 × blocking impact
+ 3 × integration risk
+ 2 × uncertainty
+ 2 × user value
+ 2 × architectural risk
+ 1 × neglect
```

Use scores only as a thinking aid.  
Human judgment wins.

---

# 23. Phase 9 — Implementation Loop

Recommended loop for each slice:

```text
1. Select slice
2. Confirm relevant spec
3. Confirm examples / acceptance expectations
4. Identify affected contracts
5. Run baseline tests
6. Implement smallest coherent change
7. Add/update internal unit tests
8. Run feature acceptance
9. Run contract/integration tests
10. Refactor
11. Run required quality gates
12. Produce evidence summary
13. Human reviews result/risk
14. Merge or continue
```

The implementation agent MUST not declare success after step 6.

---

# 24. Unit tests in VEDD

Unit tests protect lower-level behaviour.

They are useful for:

- algorithms;
- transformations;
- domain rules;
- validation;
- utility functions;
- state transitions;
- error behaviour.

Unit tests MAY be generated mainly by the implementation agent.

However:

> Unit tests created by the same agent as the implementation are supporting evidence, not independent proof.

For critical code, strengthen confidence with one or more of:

- independent test generation;
- property testing;
- mutation testing;
- acceptance tests;
- differential testing;
- external fixtures;
- human-reviewed examples.

---

# 25. Coverage

Coverage answers:

> Which implementation paths were executed by the test suite?

Coverage does **not** answer:

> Were the right assertions made?

Therefore VEDD MUST NOT use coverage percentage alone as a correctness metric.

Good uses:

- identify unexercised code;
- detect suspicious gaps;
- enforce minimum coverage in critical packages;
- locate code that needs test attention.

Avoid blindly demanding 100% repository-wide coverage.

---

# 26. Mutation testing

Mutation testing asks:

> If the implementation were subtly wrong, would our tests notice?

A mutation tool may change:

```text
>= → >
true → false
+ → -
condition removed
return value changed
```

Then it reruns the tests.

If tests fail:

```text
mutant killed
```

If tests remain green:

```text
mutant survived
```

A surviving mutant can indicate:

- missing boundary tests;
- weak assertions;
- redundant code;
- equivalent mutations;
- behaviour nobody actually cares about.

Mutation testing is especially valuable for:

- domain rules;
- financial calculations;
- state machines;
- permission rules;
- algorithms;
- safety-critical transformations.

It may be too expensive to run on every commit.  
VEDD MAY run it at milestones or only for important modules.

---

# 27. Integration and interconnectivity

VEDD considers integration a first-class concern.

For each important module boundary, answer:

```text
Who owns the data?
Who initiates the interaction?
What is the contract?
What failures can cross the boundary?
What version assumptions exist?
How is compatibility tested?
```

The system SHOULD have evidence not only that modules work separately, but that important boundaries work together.

---

# 28. Visual validation

Because VEDD starts from visual intent, visual drift should be checked where relevant.

Possible evidence:

- screenshot comparison;
- visual regression testing;
- component snapshots;
- responsive-state captures;
- human visual review.

Visual regression MUST NOT be treated as the only UX validation.

A pixel-perfect screenshot can still represent a bad interaction.

---

# 29. Architectural fitness functions

A fitness function is an automated check that protects a desired architectural characteristic.

Examples:

```text
Domain code cannot import UI packages.

No dependency cycles are allowed between core modules.

Public API response schemas are backwards compatible.

Median response time for operation X stays below budget Y.

No function in core domain exceeds agreed complexity without justification.

All persistent events are versioned.
```

Fitness functions SHOULD run continuously when cheap.

They turn architecture from:

```text
"Please remember our architecture."
```

into:

```text
"The build rejects violations."
```

---

# 30. Continuous gates vs milestone gates

Not every check should run with the same cadence.

## Continuous / per-change gates

Typical candidates:

- unit tests;
- type checking;
- lint;
- basic static analysis;
- contract tests;
- integration tests for affected areas;
- architectural dependency rules;
- formatting;
- fast security checks.

## Milestone / convergence gates

Typical candidates:

- full mutation testing;
- dead-code analysis;
- unused endpoint analysis;
- large dependency audit;
- duplicate implementation analysis;
- architecture drift review;
- performance benchmark suite;
- comprehensive security audit;
- spec/code drift;
- full exploratory QA.

---

# 31. Convergence Gates

A **Convergence Gate** is a deliberate pause in additive development.

The question changes from:

> "What can we add?"

to:

> **"What should be removed, simplified, unified or realigned before we continue?"**

Run convergence at meaningful milestones, such as:

- Walking Skeleton completed;
- core loop usable;
- all critical journeys connected;
- before beta;
- before release candidate;
- after major architectural discovery.

---

## 31.1 Convergence audit checklist

Search for:

### Dead code

- unreachable functions;
- abandoned feature branches merged into main code;
- unused classes;
- unused feature flags.

### Unused API surface

- uncalled endpoints;
- duplicate endpoints;
- obsolete parameters;
- private functionality accidentally exposed publicly.

### Duplication

- repeated business rules;
- parallel implementations;
- equivalent DTOs/models;
- duplicate validation.

### Architecture erosion

- new dependency cycles;
- wrong dependency direction;
- domain leakage into UI/infrastructure;
- shared module becoming a dumping ground.

### Spec drift

- code implements behaviour not in spec;
- approved spec no longer matches product;
- acceptance test represents old behaviour;
- visual references are obsolete.

### Test debt

- tests tied too closely to implementation;
- duplicate tests;
- brittle fixtures;
- stale snapshots;
- meaningless assertions.

---

# 32. Milestones: avoid "% of code complete"

VEDD discourages statements such as:

```text
The app is 70% developed.
```

That number is usually poorly defined.

Prefer observable capability milestones.

Example:

## M0 — Intent baseline

- core visuals exist;
- capability map exists;
- core constraints approved.

## M1 — Walking Skeleton

- one real end-to-end path works;
- deployment/runtime path works;
- basic evidence pipeline runs.

## M2 — Core Loop

- primary user journey is usable;
- critical modules are integrated.

## M3 — Functional Breadth

- all major journeys exist in basic form;
- major contracts are exercised.

## M4 — Hardening

- edge cases;
- mutation testing;
- performance;
- security;
- error recovery;
- convergence.

## M5 — Release Candidate

- release evidence passes;
- critical QA passes;
- known risks explicitly accepted.

---

# 33. Evidence Levels

Not every feature needs maximum testing.

VEDD uses risk-adjusted evidence.

## Level E0 — Prototype

Suitable for disposable experiments.

```text
Manual verification
Basic runtime check
```

## Level E1 — Standard feature

```text
Acceptance criteria
Unit tests where useful
Integration check
Static analysis
```

## Level E2 — Important feature

```text
Executable acceptance
Unit tests
Contract/integration tests
Coverage review
Architecture gates
QA
```

## Level E3 — Critical feature

```text
Everything in E2
Property testing where applicable
Mutation testing
Failure injection / negative cases
Performance/security evidence where relevant
Independent test generation or review
```

The project constitution SHOULD define which categories map to which evidence level.

---

# 34. Definition of Ready

A slice is ready for implementation when:

- [ ] its purpose is understood;
- [ ] relevant visual intent is available;
- [ ] rules are sufficiently clear;
- [ ] critical open questions are resolved;
- [ ] dependencies are identified;
- [ ] expected behaviour is described;
- [ ] important examples exist;
- [ ] required evidence level is known;
- [ ] the slice is small enough to integrate incrementally.

Not every checkbox must be perfect.  
The goal is to prevent avoidable ambiguity from becoming implementation.

---

# 35. Definition of Done

A slice is done when:

- [ ] implementation exists;
- [ ] approved acceptance behaviour passes;
- [ ] affected contracts pass;
- [ ] required unit tests pass;
- [ ] required integration tests pass;
- [ ] relevant architecture gates pass;
- [ ] relevant static/security/performance checks pass;
- [ ] visual result matches approved intent where applicable;
- [ ] no protected artifact was silently weakened;
- [ ] documentation/spec is still aligned;
- [ ] evidence summary is produced;
- [ ] remaining risks are explicit.

"Code written" is not a Definition of Done.

---

# 36. Evidence Report

Every meaningful slice SHOULD produce a concise evidence report.

Example:

```markdown
# Evidence — Inventory / equip-item

## Behaviour
- Acceptance scenarios: 7/7 PASS
- Gherkin feature: PASS

## Unit
- 42 tests PASS
- New tests: 8

## Integration
- Inventory ↔ Equipment contract: PASS
- Save/load integration: PASS

## Quality
- Type check: PASS
- Static analysis: PASS
- Coverage affected package: 94%
- Mutation score domain rules: 91%

## Visual
- Default state: reviewed
- Equipped state: reviewed

## Known risks
- Drag/drop interaction not implemented yet.
- Large inventories >1,000 items not performance tested.

## Spec changes
- None.
```

The evidence report is useful to both human and AI reviewers.

---

# 37. Human review strategy

VEDD does not prohibit code review.

It makes it **risk-targeted**.

Humans SHOULD directly inspect code when:

- security-sensitive;
- money/financial logic;
- authentication/authorization;
- concurrency;
- destructive migrations;
- cryptography;
- complex algorithms;
- unsafe system operations;
- surprising architecture;
- evidence is weak or contradictory;
- the agent made broad changes outside expected scope.

For lower-risk boilerplate with strong independent evidence, exhaustive line-by-line review MAY provide lower value.

---

# 38. AI assistant operating protocol

The following section can be given directly to a coding assistant.

---

## VEDD AGENT PROTOCOL

### A. Before implementing

You MUST:

1. read the project constitution;
2. identify the active feature/slice;
3. read the relevant spec;
4. read relevant visual specs;
5. read examples/acceptance criteria;
6. identify affected module contracts;
7. identify unresolved questions;
8. identify the required evidence level;
9. report contradictions before coding.

You MUST NOT silently invent product behaviour when the specification has a material ambiguity.

---

### B. Specification work

When asked to help define a spec:

1. preserve stated human intent;
2. identify missing states and edge cases;
3. identify hidden assumptions;
4. propose missing capabilities if necessary;
5. propose removal/merging of unnecessary capabilities;
6. separate WHAT from HOW;
7. mark unresolved product decisions as questions;
8. do not disguise implementation preferences as requirements.

---

### C. Test design

Before implementation of important behaviour:

1. derive examples from rules;
2. include positive and negative examples;
3. include important boundaries;
4. identify invariants suitable for property tests;
5. identify public/module contracts;
6. create acceptance evidence that does not unnecessarily depend on implementation structure.

---

### D. Implementation

During implementation:

1. change the smallest coherent slice;
2. preserve protected artifacts;
3. use existing project patterns before introducing new abstractions;
4. add unit tests for non-trivial internal behaviour;
5. integrate continuously;
6. avoid speculative abstractions;
7. avoid adding endpoints/classes "for future use";
8. report any unavoidable scope expansion.

---

### E. Failure handling

If an approved acceptance test fails:

DO NOT change the expectation merely to match current code.

Instead determine whether:

```text
A. implementation is wrong;
B. test implementation is wrong;
C. spec is ambiguous;
D. approved behaviour has changed.
```

Cases C and D require specification review/human approval.

---

### F. Completion

Before saying a slice is complete:

1. run required tests;
2. run required quality gates;
3. verify affected integrations;
4. verify relevant visual states;
5. summarize evidence;
6. list known risks;
7. list spec deviations;
8. list files/areas changed;
9. state anything not verified.

Never claim success for checks you did not actually run.

---

# 39. Recommended agent passes

A single large "build this feature" prompt is discouraged.

Use role-separated passes.

## Pass 1 — Specifier

Prompt goal:

```text
Transform the feature intent and visual references into a structured
VEDD spec. Do not implement. Identify ambiguity explicitly.
```

## Pass 2 — Challenger

```text
Attack the spec. Find missing states, contradictions, edge cases,
integration assumptions, failure behaviour and untestable requirements.
Do not implement.
```

## Pass 3 — Example/Test Designer

```text
Create Example Mapping and propose executable acceptance, contracts,
properties and QA appropriate to the feature's evidence level.
Do not depend unnecessarily on internal implementation.
```

## Pass 4 — Implementer

```text
Implement only the approved slice. Protected acceptance behaviour may
not be weakened. Add internal tests as needed and integrate continuously.
```

## Pass 5 — Hardener

```text
Try to falsify the claim that the feature is correct. Search for
boundaries, mutations, invalid states, race/failure conditions and
missing assertions. Add tests for meaningful gaps.
```

## Pass 6 — Auditor

```text
Review the resulting system for duplication, dead code, unused API
surface, architecture drift, stale tests and spec/code divergence.
Do not refactor merely for style; prioritize measurable simplification.
```

These roles may use the same AI model in separate contexts.

---

# 40. Context separation

When practical, VEDD SHOULD reduce correlated errors by separating context.

Bad pattern:

```text
Agent invents requirement
→ writes test for invented requirement
→ writes code for invented requirement
→ reviews itself
→ declares success
```

Better:

```text
Human-approved spec
→ test-design pass
→ implementation pass
→ hardening/audit pass
```

The passes may share necessary artifacts but should not all rely on the same undocumented assumptions.

---

# 41. Independent evidence

Evidence is stronger when its source is partially independent from the implementation.

Increasing confidence:

```text
1. Implementation compiles
2. Agent's own unit tests pass
3. Human-approved acceptance examples pass
4. Independent contract/property tests pass
5. Mutation/fuzzing tries to break assumptions
6. External QA or human exploration confirms behaviour
```

VEDD does not require all levels for every feature.

---

# 42. Anti-patterns

## Anti-pattern 1 — Screenshot worship

```text
"It looks like the mockup, therefore it is correct."
```

Why it fails:

- behaviour may be wrong;
- inaccessible states may exist;
- data may be fake;
- interactions may not work;
- error behaviour may be missing.

---

## Anti-pattern 2 — Specification as implementation

```text
"The spec requires class X to call repository Y through service Z."
```

Unless architecture itself is the requirement, this over-constrains implementation.

---

## Anti-pattern 3 — Agent changes the exam

```text
Test expects 50.
Code returns 51.
Agent changes test to expect 51.
```

This is forbidden unless the approved intent has changed.

---

## Anti-pattern 4 — Coverage theatre

```text
Coverage = 100%
Therefore correctness = 100%
```

False.

Coverage measures execution, not quality of assertions.

---

## Anti-pattern 5 — Module completion silos

```text
Inventory 100%
Combat 100%
Persistence 100%
Integration 0%
```

Avoid late integration.

---

## Anti-pattern 6 — Equalizing progress bars

Always implementing the least-developed feature can waste time on low-value capabilities.

Use the Weakest Critical Path rule.

---

## Anti-pattern 7 — Endless architecture polishing

Convergence is not an excuse for permanent refactoring.

Refactoring SHOULD improve:

- evidence;
- maintainability;
- simplicity;
- performance;
- architecture;
- delivery capability.

---

## Anti-pattern 8 — AI self-certification

```text
"I implemented everything successfully."
```

is not evidence.

The assistant should provide executed checks and known limitations.

---

## Anti-pattern 9 — Massive one-shot implementation

Large agent-generated changes reduce:

- traceability;
- reviewability;
- fault localization;
- confidence.

Prefer small connected slices.

---

# 43. Example: Inventory feature end-to-end

## Step 1 — Visual intent

Create:

```text
inventory-default.png
inventory-selected.png
inventory-empty.png
inventory-full.png
```

---

## Step 2 — Capability

```text
Inventory
- store items
- stack compatible items
- remove items
- expose equipment action
- report capacity
```

---

## Step 3 — Spec

Rules:

```text
R1: capacity is 40 slots.
R2: non-stackable items consume one slot.
R3: adding a non-stackable item at capacity is rejected.
R4: item removal must not affect unrelated items.
R5: an equipped item cannot simultaneously exist as a duplicate inventory item.
```

---

## Step 4 — Challenge

Questions:

```text
Q1: Does adding to an existing stack at 40/40 succeed?
Q2: Is stack size unlimited?
Q3: What happens if persistence fails after an inventory action?
Q4: Can quest items be discarded?
```

Human resolves important questions.

---

## Step 5 — Example Mapping

```text
R3
  E1: 39/40 + sword → 40/40
  E2: 40/40 + sword → rejected
  E3: 40/40 + potion added to existing stack → ?
```

---

## Step 6 — Executable expectation

```gherkin
Scenario: Adding an item when the inventory is full
  Given the player's inventory has 40 occupied slots
  When the player receives a non-stackable sword
  Then the sword is not added
  And the inventory remains at 40 occupied slots
  And the result is inventory_full
```

---

## Step 7 — Walking Skeleton integration

Ensure:

```text
Acquire item
→ Inventory
→ UI updates
→ Save
→ Reload
→ Same inventory state
```

---

## Step 8 — Implementation

The agent chooses internal structures.

Potentially:

```text
Inventory
InventorySlot
ItemStack
```

but the spec does not require those names.

---

## Step 9 — Internal tests

Add unit tests for:

- capacity calculation;
- stack merge;
- removal;
- item identity;
- invalid state transition.

---

## Step 10 — Evidence

Run:

```text
Acceptance
Unit
Inventory ↔ Equipment contract
Save/load integration
Static analysis
Relevant architecture gates
```

For critical domain logic, add mutation/property tests.

---

# 44. Using VEDD with different coding assistants

VEDD is intentionally independent of:

- Codex;
- Claude Code;
- GitHub Copilot;
- Cursor;
- Gemini;
- IDE;
- programming language;
- frontend framework;
- backend framework.

The project artifacts carry the process.

An assistant only needs to understand:

```text
constitution
visual intent
spec
examples
protected acceptance
active slice
quality gates
evidence report
```

---

# 45. Suggested root agent instruction

A project MAY include an `AGENTS.md`, `CLAUDE.md`, assistant rule file or equivalent containing:

```markdown
# VEDD Project Rules

This project follows Visual Evidence-Driven Development (VEDD).

Before implementation:
1. Read `docs/vedd/constitution.md`.
2. Read the active feature spec and visual spec.
3. Read approved examples and acceptance scenarios.
4. Identify affected contracts.
5. Report material ambiguity before coding.

Protected artifacts:
- Approved feature specs
- Approved acceptance rules
- Approved Gherkin
- Project constitution
- Architectural constraints

Do not change protected artifacts merely to make implementation pass.

Development:
- Work in small connected slices.
- Preserve the Walking Skeleton.
- Prioritize the Weakest Critical Path.
- Add internal tests for non-trivial implementation behaviour.
- Avoid speculative abstractions and unused API surface.

Completion:
- Run required evidence gates.
- Produce an evidence summary.
- State what was not tested.
- Never claim a test passed unless it was executed.
```

---

# 46. Change protocol

When a requirement changes:

```text
Human intent changes
        ↓
Update spec
        ↓
Update examples / acceptance
        ↓
Approve
        ↓
Observe expected failures
        ↓
Update implementation
        ↓
Run evidence
```

Do not begin by changing implementation and later rewrite the spec to match accidentally.

---

# 47. Bug protocol

When a bug is found:

## Step 1

Reproduce the bug.

## Step 2

Ask:

```text
Does approved evidence already describe the correct behaviour?
```

### If yes

The implementation/evidence suite failed to protect the behaviour.

Add a regression test at the appropriate level and fix the implementation.

### If no

Determine whether the bug reveals:

- missing requirement;
- missing example;
- ambiguous requirement;
- unexpected integration;
- missing architecture rule.

Update the correct VEDD artifact so the same class of bug becomes harder to reintroduce.

---

# 48. Refactoring protocol

A refactor SHOULD preserve approved behaviour.

Before:

```text
acceptance = green
contracts = green
```

Refactor.

After:

```text
acceptance = green
contracts = green
```

The implementation may change radically while behavioural evidence remains stable.

If a refactor requires acceptance behaviour to change, it is no longer purely a refactor.

---

# 49. Architectural change protocol

For significant architectural change:

1. state the problem;
2. state current constraint;
3. propose alternatives;
4. identify trade-offs;
5. record decision when important;
6. define new fitness function if the architecture property should remain protected;
7. migrate incrementally;
8. preserve connected system behaviour.

---

# 50. Release evidence

A release candidate SHOULD produce a consolidated report.

Example:

```markdown
# VEDD Release Evidence

## Critical journeys
- Character creation: PASS
- Inventory/equipment: PASS
- Combat core loop: PASS
- Save/load: PASS

## Automated verification
- Unit suite: PASS
- Acceptance suite: PASS
- Contracts: PASS
- Architecture fitness: PASS
- Static analysis: PASS
- Security checks: PASS

## Hardening
- Mutation critical domain: 92%
- Persistence property tests: PASS
- Performance budget: PASS

## QA
- Critical QA procedures: 12/12 PASS
- Exploratory session: completed

## Known risks
1. ...
2. ...

## Explicitly deferred
1. ...
```

---

# 51. Minimal VEDD adoption

A team does not need to implement the entire methodology immediately.

## VEDD Lite

Use:

```text
Visual references
→ Spec
→ Human review
→ Gherkin/acceptance for critical behaviour
→ Walking Skeleton
→ Small connected slices
→ Unit/integration tests
→ Evidence summary
```

---

## VEDD Standard

Add:

```text
Example Mapping
Contracts
Fitness functions
Weakest Critical Path prioritization
Convergence Gates
```

---

## VEDD High-Assurance

Add:

```text
Property testing
Mutation testing
Independent test generation
Security/performance gates
Strict protected artifacts
Formal release evidence
```

---

# 52. Success criteria for the methodology

VEDD is working when:

- agents spend less time guessing product intent;
- integration problems appear earlier;
- humans review fewer irrelevant implementation details;
- regressions become executable evidence;
- specs remain useful after implementation;
- modules remain connected throughout development;
- architectural drift is detected automatically;
- refactoring removes AI-generated clutter;
- "done" becomes an evidence-backed statement;
- changing assistants does not destroy the development process.

---

# 53. Failure criteria

VEDD is failing when:

- specs become giant stale documents;
- every trivial requirement becomes Gherkin;
- test quantity is optimized instead of confidence;
- agents routinely edit acceptance criteria to pass builds;
- mockups are treated as exact implementation instructions;
- humans stop thinking because tests are green;
- architecture gates become arbitrary score chasing;
- convergence becomes endless cleanup;
- the process costs more than the risk it controls.

VEDD MUST remain risk-proportionate.

---

# 54. The VEDD review question

The fundamental review question is not:

> "Did the AI write good code?"

It is:

> **"What evidence do we have that this implementation satisfies the intent we approved, preserves the architecture we care about, integrates with the rest of the system and has not introduced unacceptable risk?"**

Code review is one possible source of evidence inside that larger question.

---

# 55. Summary workflow

```text
                     ┌────────────────────┐
                     │    HUMAN INTENT    │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │   VISUAL INTENT    │
                     │ mockups / states   │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │   CAPABILITY MAP   │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │        SPEC        │
                     └─────────┬──────────┘
                               │
                        AI CHALLENGE
                               │
                         HUMAN GATE
                               │
                               ▼
                     ┌────────────────────┐
                     │  EXAMPLE MAPPING   │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ EXECUTABLE EXPECT. │
                     │ Gherkin / contract │
                     │ property / QA      │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ WALKING SKELETON   │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ NEXT SMALL SLICE   │◄──────────────┐
                     │ weakest critical  │               │
                     │ path               │               │
                     └─────────┬──────────┘               │
                               │                          │
                               ▼                          │
                     ┌────────────────────┐               │
                     │ IMPLEMENT + UNIT   │               │
                     │ TEST + INTEGRATE   │               │
                     └─────────┬──────────┘               │
                               │                          │
                               ▼                          │
                     ┌────────────────────┐               │
                     │ EVIDENCE GATES     │               │
                     └─────────┬──────────┘               │
                               │                          │
                               ▼                          │
                     ┌────────────────────┐               │
                     │ EVIDENCE REPORT    │               │
                     └─────────┬──────────┘               │
                               │                          │
                         HUMAN/RISK REVIEW                 │
                               │                          │
                               ▼                          │
                     ┌────────────────────┐               │
                     │ CONVERGENCE GATE?  │── no ─────────┘
                     └─────────┬──────────┘
                               │ yes
                               ▼
                     ┌────────────────────┐
                     │ SIMPLIFY / ALIGN   │
                     │ dead code / drift  │
                     │ architecture       │
                     └─────────┬──────────┘
                               │
                               └──────────────────────────►
```

---

# 56. One-paragraph definition

**Visual Evidence-Driven Development (VEDD)** is an AI-native development methodology in which human intent is captured through visual references, structured specifications and concrete examples; important expectations are converted into executable evidence; the product grows through small connected slices around a continuously functioning Walking Skeleton; work is prioritized by the weakest critical path rather than isolated module completion; architecture is protected through automated fitness functions; and periodic convergence gates remove dead code, redundant interfaces and specification drift. AI assistants may perform much of the implementation, testing, hardening and auditing, while humans retain authority over intent, acceptance and risk.

---

# 57. Short operating rule

If the entire manual must be compressed into one rule:

> **Specify what matters, show what you mean, make important expectations executable, grow the whole system in connected slices, force the implementation to prove itself, and periodically simplify what the AI has accumulated.**

---

# 58. References and intellectual lineage

VEDD deliberately builds on existing software-engineering ideas. Useful starting points include:

- GitHub Spec Kit — Spec-Driven Development  
  https://github.com/github/spec-kit

- Cucumber — Behaviour-Driven Development and executable specifications  
  https://cucumber.io/docs/bdd/

- Cucumber — Gherkin  
  https://cucumber.io/docs/gherkin/reference/

- Cucumber — Example Mapping / examples  
  https://cucumber.io/docs/bdd/

- Martin Fowler — Evolutionary Architecture / architectural fitness functions  
  https://martinfowler.com/articles/evo-arch-forward.html

- Walking Skeleton / continuous integration literature and practice

VEDD should be treated as a living methodology. Teams are encouraged to change thresholds, artifacts and evidence levels while preserving the core trust model.

---

# 59. Versioning this manual

Recommended versions:

```text
0.x — experimental methodology
1.0 — stable core workflow
1.x — compatible refinements
2.0 — changes to core trust model or lifecycle
```

When this manual changes, record:

```markdown
## Change
What changed?

## Reason
Why?

## Impact
What should humans or agents do differently?
```

---

# 60. Final note to humans and AI assistants

VEDD is not an attempt to replace engineering judgment with a checklist.

It is an attempt to make AI-assisted engineering **more explicit, more testable and more scalable**.

Humans remain responsible for deciding what matters.

AI assistants are exceptionally useful for:

- expanding intent;
- finding ambiguity;
- generating examples;
- implementing;
- testing;
- attacking assumptions;
- auditing complexity.

The methodology works when both sides operate at the level where they create the most value:

```text
Human:
intent, judgment, priorities, trade-offs, acceptance.

AI:
translation, implementation, repetition, search, verification, critique.

Automation:
continuous evidence.
```

The target is not "zero human code review."

The target is:

> **No important software claim should depend only on trust in generated code.**
