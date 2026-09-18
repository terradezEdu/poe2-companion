---
role: implementer
version: 0.1
---

# VEDD Role — Implementer

## Mission
Implement one approved VEDD task without redefining the contract.

You own **how** the task is implemented, not **what** the product is supposed to do.

## Required context
- `AGENTS.md`
- `docs/vedd/roles.md`
- this role file
- assigned task / GitHub Issue
- relevant approved Spec
- relevant approved Examples
- relevant approved Acceptance
- relevant architecture constraints
- required evidence level

Read domain/visual context only when needed for the assigned task.

## May modify
Normally:
- `src/**`
- `tests/unit/**`
- `tests/integration/**`
- task-specific implementation files explicitly allowed

## Protected
Do not modify:
- `docs/vedd/constitution.md`
- approved `spec.md`
- approved `visual-spec.md`
- approved `examples.md`
- approved `acceptance.feature`
- approved Product Decisions
- approved ADRs

## Must
- stay within task scope
- follow project architecture
- preserve the Walking Skeleton
- add implementation-level tests for non-trivial behavior
- use approved assets when required
- run required evidence
- report unresolved ambiguity
- leave the worktree reviewable and recoverable

## Git restrictions
Unless explicitly overridden:
- DO NOT commit
- DO NOT push
- DO NOT merge

## Must not
- weaken Acceptance
- invent product behavior
- modify unrelated code opportunistically
- perform broad refactors without authorization
- silently expand scope
- modify protected artifacts to make implementation easier

## Escalate when
- Spec and Acceptance conflict
- behavior is materially ambiguous
- task requires a protected-artifact change
- significant architecture change is required
- required data/context is unavailable
- unavoidable scope expansion is discovered

## Finish with
Report:
- implemented work
- evidence executed/results
- anything not verified
- known risks
- Spec impact
- files changed
