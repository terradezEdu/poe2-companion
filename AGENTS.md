# VEDD Agent Protocol

This repository follows **VEDD — Visual Evidence-Driven Development**.

This file contains the universal rules that apply to every AI agent working in this repository.

Role-specific behavior is defined separately under:

```text
docs/vedd/roles/
```

---

# 1. Progressive context

Do not load the entire VEDD documentation by default.

Use progressive context disclosure:

```text
AGENTS.md
    ↓
docs/vedd/roles.md
    ↓
active role definition
    ↓
assigned task / feature
    ↓
relevant approved contract
    ↓
additional context only when required
```

Every agent MUST:

1. read this file;
2. identify its assigned role;
3. read `docs/vedd/roles.md`;
4. read only its active role file;
5. load only the feature/task context required to perform that role.

Do not read every role definition unless explicitly performing methodology or project-wide audit work.

---

# 2. One active role

Every agent operates under exactly one primary VEDD role.

An agent MUST NOT silently switch roles.

If work requires a different role:

1. stop the current role;
2. report the required handoff;
3. invoke the appropriate role separately.

Example:

```text
Challenger
→ Context Reconciler
→ Human Gate
```

not:

```text
Challenger
→ edits Spec
→ implements feature
→ reviews own implementation
```

---

# 3. Authority

The default source-of-truth hierarchy is:

1. Human-approved Constitution / Product Intent
2. Human-approved Product Decisions
3. Approved Feature Spec
4. Approved Visual Spec
5. Approved Examples
6. Approved Acceptance Contract
7. Architectural Decisions / Constraints
8. Implementation Plan
9. Internal Tests
10. Existing Code

Existing code is not automatically the source of truth.

If implementation conflicts with a higher-authority artifact, report the conflict.

---

# 4. Protected artifacts

Approved VEDD artifacts are protected by default.

Examples:

```text
docs/vedd/constitution.md
approved spec.md
approved visual-spec.md
approved examples.md
approved acceptance.feature
approved product decisions
approved ADRs
```

A role may modify a protected artifact only when its role definition explicitly grants permission and the artifact is in a modifiable state.

NEVER modify a protected artifact merely to:

* make implementation easier;
* make a test pass;
* fit existing code;
* remove an inconvenient requirement.

If a protected artifact appears wrong or contradictory, escalate.

---

# 5. Material ambiguity

Do not silently invent product behavior.

An ambiguity is material when:

> Two reasonable implementations could produce observably different behavior within the approved current scope.

When material ambiguity exists:

1. preserve valid completed work;
2. identify the conflicting artifacts;
3. explain the observable consequence;
4. escalate according to the active role.

Explicitly deferred requirements are not blockers for the current scope.

---

# 6. Scope

Stay within the assigned task and approved current scope.

Do not introduce future functionality unless explicitly requested.

Avoid:

* speculative abstractions;
* unrelated refactors;
* unused APIs;
* premature extensibility;
* opportunistic cleanup outside the task.

Prefer the smallest coherent change that preserves the connected system.

---

# 7. Walking Skeleton

Keep the system working end-to-end as it grows.

Do not complete isolated subsystems while postponing critical integration.

When selecting or planning work, prefer slices that strengthen the current **Weakest Critical Path**.

Detailed planning rules belong to the relevant VEDD role.

---

# 8. Evidence

Never fabricate evidence.

An agent MUST NOT claim that:

* a test passed when it was not executed;
* a visual state was reviewed when it was not inspected;
* a source was verified when it was not checked;
* a requirement was approved without a Human Gate.

Required evidence is determined by:

```text
.vedd/evidence-policy.yaml
```

and the assigned task/role.

When evidence cannot be executed, state that explicitly.

---

# 9. Acceptance failures

Never weaken approved Acceptance merely because implementation fails.

If approved Acceptance fails, determine whether the cause is:

```text
A. implementation defect
B. test implementation defect
C. specification ambiguity
D. approved behavior has changed
```

For `C` or `D`, escalate upstream.

Do not rewrite the contract to match accidental implementation behavior.

---

# 10. Human authority

Agents may:

* analyze;
* recommend;
* challenge;
* implement within role authority;
* generate evidence.

Agents MUST NOT represent their own decisions as human approval.

Human approval is required where the workflow defines a Human Gate.

In particular, human approval remains the default authority for:

* product intent;
* contract lock;
* important product decisions;
* subjective visual asset selection;
* merge.

---

# 11. Git and worktrees

Implementation tasks should normally follow:

```text
one task
=
one branch
=
one worktree
=
one primary Implementer
```

Unless explicitly authorized otherwise, AI implementation agents MUST NOT:

```text
commit
push
merge
```

Leave implementation changes available for review.

The human remains the default merge authority.

---

# 12. Recoverability

Agents are disposable.

Tasks are durable.

Do not rely on conversation memory as the only record of progress.

Long-running work SHOULD remain recoverable from:

```text
VEDD artifacts
+
task / GitHub Issue
+
Git branch/worktree
+
git status / diff
+
evidence state
```

When resuming interrupted work:

1. inspect existing task state;
2. inspect `git status`;
3. inspect the current diff;
4. determine what is already complete;
5. continue instead of blindly restarting.

---

# 13. Handoff

At the end of a role pass, leave enough durable information for another agent to continue.

Use a concise handoff:

```markdown
## Role
...

## Result
...

## Artifacts changed
- ...

## Evidence
- ...

## Open questions
- ...

## Known risks
- ...

## Recommended next role
...
```

Do not depend on hidden conversation context for critical project state.

---

# 14. Context discipline

More context is not automatically better.

Load:

```text
REQUIRED
→ always

OPTIONAL
→ only when necessary

UNRELATED
→ do not load
```

A task-specific agent should normally not load:

* unrelated feature Specs;
* every Challenger report;
* every role definition;
* the complete VEDD manual;
* historical project discussions;

unless they are genuinely required.

The goal is to minimize both token usage and decision noise.

---

# 15. Core rules

> Preserve approved intent.

> Use one role at a time.

> Escalate material ambiguity.

> Never weaken the contract to fit generated code.

> Never fabricate evidence.

> Load only the context needed for the current role.

> No important software claim should depend only on trust in generated code.
