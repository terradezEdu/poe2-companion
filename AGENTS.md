# VEDD Agent Protocol

This repository follows **VEDD — Visual Evidence-Driven Development**.

This file defines mandatory operating rules for AI coding assistants.

---

# 1. Authority

The default source-of-truth hierarchy is:

1. Human-approved product intent / constitution
2. Human-approved feature specification
3. Human-approved acceptance rules and examples
4. Architectural decisions / constraints
5. Executable acceptance tests
6. Implementation plan
7. Internal unit tests
8. Existing code

Existing code is not automatically the source of truth.

If code conflicts with approved intent, report the conflict.

---

# 2. Protected artifacts

The following are protected by default:

- `docs/vedd/constitution.md`
- approved `spec.md`
- approved `visual-spec.md`
- approved acceptance rules
- approved `.feature` files
- important business invariants
- architectural constraints / ADRs

You MUST NOT modify protected artifacts merely to make implementation or tests pass.

If a protected artifact appears wrong, contradictory or outdated:

1. explain the conflict;
2. propose the smallest correction;
3. wait for human approval when the change affects intent.

---

# 3. Before implementation

Before changing code, you MUST:

1. read `docs/vedd/constitution.md`;
2. read `docs/vedd/workflow.md`;
3. identify the active feature/slice;
4. read its `spec.md`;
5. read its `visual-spec.md` if applicable;
6. read `examples.md`;
7. read `acceptance.feature`;
8. identify affected module/service contracts;
9. identify unresolved questions;
10. identify the required evidence level;
11. report material contradictions or ambiguity before coding.

Do not silently invent product behaviour when the specification has a material ambiguity.

---

# 4. Specification assistance

When helping define or improve a spec:

- preserve stated human intent;
- separate WHAT from HOW;
- identify missing states;
- identify edge cases;
- identify hidden assumptions;
- identify contradictions;
- identify missing capabilities;
- identify capabilities that appear unnecessary;
- identify failure behaviour;
- identify integration assumptions;
- identify untestable requirements;
- mark unresolved questions explicitly.

Do not disguise implementation preference as product requirement.

---

# 5. Test design

Before implementing important behaviour:

1. derive examples from rules;
2. include positive and negative cases;
3. include relevant boundaries;
4. identify invariants suitable for property-based tests;
5. identify module/service contracts;
6. derive executable acceptance evidence from approved intent;
7. avoid unnecessary coupling to internal implementation structure.

A feature-level test should normally verify observable behaviour, not private method names.

---

# 6. Implementation behaviour

During implementation:

- work in the smallest coherent connected slice;
- preserve the Walking Skeleton;
- prioritize the Weakest Critical Path;
- prefer existing project patterns;
- avoid speculative abstractions;
- avoid unused endpoints/classes/interfaces;
- add internal unit tests for non-trivial behaviour;
- integrate continuously;
- keep changes within expected scope;
- report unavoidable scope expansion.

Do not complete one subsystem in isolation while postponing all important integration.

---

# 7. Weakest Critical Path

Do not automatically choose the least-developed module.

Prefer work that reduces the most important combination of:

- user-value blockage;
- dependency blockage;
- integration risk;
- uncertainty;
- architectural risk;
- evidence gap;
- prolonged neglect.

When proposing the next slice, explain the reason in terms of these dimensions.

---

# 8. Failure handling

If an approved acceptance test fails, DO NOT weaken the expectation.

Classify the cause:

A. implementation is wrong  
B. test implementation is wrong  
C. specification is ambiguous  
D. approved behaviour has changed

For C or D, escalate to specification review.

---

# 9. Completion protocol

Before claiming a slice is complete:

1. run required unit tests;
2. run acceptance tests;
3. run relevant contract/integration tests;
4. run required static/type/architecture gates;
5. verify relevant visual states;
6. run risk-specific checks when required;
7. produce an evidence summary;
8. list known risks;
9. list anything not verified;
10. list spec deviations, if any;
11. list major files/areas changed.

NEVER claim a check passed unless it was actually executed.

---

# 10. Evidence strength

Confidence should come from multiple partially independent sources.

Increasing strength:

1. code compiles/runs;
2. implementer's own unit tests pass;
3. approved acceptance examples pass;
4. contract/integration tests pass;
5. property/mutation/fuzz testing attempts to break assumptions;
6. external QA/human exploration confirms behaviour.

Not every feature needs every level.

---

# 11. Risk-targeted human review

Recommend direct human code review when changes involve:

- authentication/authorization;
- security-sensitive operations;
- financial logic;
- destructive migrations;
- concurrency;
- cryptography;
- unsafe system operations;
- complex algorithms;
- broad architectural changes;
- evidence that is weak or contradictory.

---

# 12. Convergence behaviour

At convergence milestones, switch from feature addition to simplification.

Search for:

- dead code;
- unused endpoints;
- duplicate logic;
- speculative abstractions;
- stale tests;
- dependency cycles;
- boundary violations;
- obsolete feature flags;
- redundant models;
- spec/code drift.

Do not refactor only for style. Prioritize measurable simplification.

---

# 13. Default response format after implementation

Use this structure:

```markdown
## Implemented
- ...

## Evidence
- Unit: ...
- Acceptance: ...
- Integration/contracts: ...
- Static/type/architecture: ...
- Other: ...

## Not verified
- ...

## Known risks
- ...

## Spec impact
- None / ...
```

---

# 14. Core rule

> No important software claim should depend only on trust in generated code.
