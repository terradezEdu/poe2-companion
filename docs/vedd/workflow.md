# VEDD Workflow

This file is the operational lifecycle for the project.

---

# Phase 0 — Product framing

Define:

- product goal;
- users;
- primary journeys;
- non-goals;
- technical constraints;
- important risks.

Output:

- `constitution.md`

---

# Phase 1 — Visual Intent

For user-facing features:

1. create visual references;
2. capture important states;
3. write `visual-spec.md`.

Important states may include:

- default;
- selected;
- empty;
- loading;
- error;
- disabled;
- full;
- permission denied;
- responsive variants.

Output:

- `docs/vedd/visuals/...`
- feature `visual-spec.md`

---

# Phase 2 — Capability Map

Define system capabilities and boundaries without prematurely dictating implementation structure.

Output:

- `capability-map.md`

---

# Phase 3 — Feature Spec

Create `spec.md`.

Focus on:

- purpose;
- scope;
- rules;
- states;
- inputs/outputs;
- failure behaviour;
- dependencies;
- non-functional requirements;
- open questions.

---

# Phase 4 — Challenge

Ask the AI to attack the spec.

Look for:

- ambiguity;
- missing states;
- boundaries;
- contradictions;
- hidden assumptions;
- untestable requirements;
- failure behaviour;
- integration gaps.

Resolve material questions before implementation.

---

# Phase 5 — Example Mapping

Convert important rules into concrete examples.

Structure:

```text
RULE
├─ Example
├─ Example
└─ Question
```

Output:

- `examples.md`

---

# Phase 6 — Executable Expectations

Convert important behaviour into appropriate evidence:

- Gherkin;
- acceptance tests;
- contract tests;
- property tests;
- QA procedures.

Feature-level evidence should normally test observable behaviour.

---

# Phase 7 — Walking Skeleton

Build the smallest real end-to-end path through the intended system.

Do not fake integration by bypassing real boundaries.

---

# Phase 8 — Incremental slices

Grow through small connected slices.

Select the next slice using the Weakest Critical Path rule.

---

# Phase 9 — Evidence

After meaningful changes, produce an `evidence.md`.

No evidence, no confident completion claim.

---

# Phase 10 — Convergence

At milestones, stop adding features temporarily and search for:

- dead code;
- duplicate logic;
- unused endpoints;
- stale tests;
- architectural erosion;
- spec drift;
- unnecessary dependencies.

Use `templates/convergence-audit.template.md`.

---

# Recommended loop

```text
Visual Intent
   ↓
Spec
   ↓
Challenge
   ↓
Examples
   ↓
Executable Expectations
   ↓
Walking Skeleton / Slice
   ↓
Implementation
   ↓
Evidence
   ↓
Human/Risk Review
   ↓
Next Slice
   ↓
Periodic Convergence
```
