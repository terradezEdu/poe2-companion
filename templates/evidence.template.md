# Evidence Report

> VEDD evidence artifact for `<feature>`.
>
> Evidence proves what was actually checked.  
> It must never imply that an unexecuted check passed.

---

## 1. Metadata

```yaml
feature: <feature-slug>
evidence_level: <E0|E1|E2|E3>
status: <draft|review|approved>
risk_tags: []
generated_from_tasks: []
last_updated: <YYYY-MM-DD>
```

---

## 2. Evidence Summary

| Evidence Type | Scope | Status | Required | Notes |
|---|---|---:|---:|---|
| Static | Feature | `not_run` | Yes/No | |
| Unit | Tasks | `not_run` | Yes/No | |
| Acceptance | Feature | `not_run` | Yes/No | |
| Integration | Feature | `not_run` | Yes/No | |
| Contract | Feature | `not_run` | Yes/No | |
| Visual | Feature | `not_run` | Yes/No | |
| Data Validation | Feature | `not_run` | Yes/No | |
| Property | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Mutation | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Fuzz | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Security | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Performance | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Concurrency | Risk-specific | `not_applicable` | Yes/No | Reason required |
| Independent Review | Feature | `not_run` | Yes/No | |

Allowed status values:

```text
pass
fail
not_run
not_applicable
blocked
```

`not_applicable` MUST include a reason.

---

## 3. Task Evidence

Add one section for each implementation task that contributes to this feature.

### Task `<task-id>` — `<task-title>`

```yaml
role: <implementer|hardener|...>
evidence_level: <E0|E1|E2|E3>
risk_tags: []
runtime_task: <task-id>
```

#### Checks

| Type | Status | Command / Method | Result |
|---|---|---|---|
| Static | `not_run` | | |
| Unit | `not_run` | | |
| Acceptance | `not_run` | | |
| Integration | `not_run` | | |
| Visual | `not_run` | | |
| Data Validation | `not_run` | | |

#### Checks executed

- None yet.

#### Checks not executed

- None documented.

#### Failures

- None documented.

#### Blocked evidence

- None documented.

#### Residual risks

- None documented.

---

## 4. Feature Acceptance Evidence

Record evidence against the approved Acceptance Contract.

### Acceptance source

```text
docs/vedd/specs/<feature>/acceptance.feature
```

### Result

```yaml
status: not_run
method: null
```

### Scenarios

| Scenario / Rule | Status | Evidence |
|---|---|---|
| `<scenario>` | `not_run` | |

### Notes

- Record only scenarios that exist in the approved contract.
- Do not weaken or rewrite Acceptance to match implementation behavior.
- If Acceptance and implementation disagree, record the failure and escalate.

---

## 5. Integration / Contract Evidence

Use when required by the Evidence Policy.

### Integration

```yaml
status: not_applicable
reason: "<required when not_applicable>"
```

Evidence:

- ...

### Contracts

```yaml
status: not_applicable
reason: "<required when not_applicable>"
```

Evidence:

- ...

---

## 6. Visual Evidence

Use when visual behavior or production assets changed.

```yaml
status: not_applicable
reason: "<required when not_applicable>"
```

Approved reference:

```text
docs/vedd/specs/<feature>/visual-spec.md
```

Method used:

- human visual review
- screenshot comparison
- visual regression test
- other: `<method>`

Reviewed states:

| State | Status | Notes |
|---|---|---|
| `<state>` | `not_run` | |

Known deviations:

- None documented.

---

## 7. Data Validation Evidence

Use when datasets, schemas or curated domain data changed.

```yaml
status: not_applicable
reason: "<required when not_applicable>"
```

Validation scope:

- schema validity
- required identifiers/references
- semantic invariants
- source metadata
- verification metadata
- `Unknown` versus verified absence where applicable

Results:

- ...

Conflicts or unresolved source issues:

- None documented.

---

## 8. Risk-Specific Evidence

Only include evidence activated by the current evidence level or risk tags.

### Property Testing

```yaml
status: not_applicable
reason: "<reason>"
```

### Mutation Testing

```yaml
status: not_applicable
reason: "<reason>"
```

### Fuzz Testing

```yaml
status: not_applicable
reason: "<reason>"
```

### Security

```yaml
status: not_applicable
reason: "<reason>"
```

### Performance

```yaml
status: not_applicable
reason: "<reason>"
```

### Concurrency

```yaml
status: not_applicable
reason: "<reason>"
```

---

## 9. Independent Review

Required when defined by `.vedd/evidence-policy.yaml`.

```yaml
required: <true|false>
status: not_run
reviewer_role: reviewer
review_artifact: null
```

Reviewer MUST be independent from the primary Implementer session when required by policy.

### Findings

| Severity | Finding | Resolution |
|---|---|---|
| | | |

### Review verdict

```text
PENDING
```

Allowed verdicts:

```text
PASS
PASS_WITH_MINOR_FINDINGS
BLOCKED
PENDING
```

---

## 10. Human Gate

```yaml
required: <true|false>
status: pending
approved_by: null
approved_at: null
```

Human approval MUST NOT be inferred from agent output.

---

## 11. Unexecuted Evidence

List every check that was expected or considered but not executed.

| Evidence | Why not executed | Blocking? |
|---|---|---:|
| | | |

Do not omit failed, blocked or skipped evidence from this section.

---

## 12. Residual Risks

List known risks that remain after executed evidence.

- ...

If none are known:

```text
No known residual risks were identified within the tested scope.
```

Do not write this unless the evidence performed supports that statement.

---

## 13. Gate Decision

### Task Gate

```yaml
status: <not_evaluated|pass|fail|blocked>
reason: null
```

A task may move to human review only when the Evidence Policy task gate is satisfied.

### Feature Gate

```yaml
status: <not_evaluated|pass|fail|blocked>
reason: null
```

A feature may move toward merge only when the Evidence Policy feature gate is satisfied.

---

## 14. Evidence Handoff

```markdown
### Checks executed
- ...

### Checks not executed
- ...

### Failed checks
- ...

### Blocked checks
- ...

### Residual risks
- ...

### Reviewer status
- ...

### Human Gate status
- ...

### Recommended next role
- ...
```

---

## Evidence Rules

1. Record what actually happened.
2. Never convert `not_run` into `pass`.
3. `not_applicable` requires a reason.
4. Required `fail` blocks completion.
5. Required `blocked` evidence requires escalation.
6. Acceptance is not weakened to match implementation.
7. Runtime YAML stores summaries; this artifact stores durable evidence detail.
8. CI output may support evidence but does not replace the VEDD interpretation of what was proven.
9. Evidence requirements come from `.vedd/evidence-policy.yaml`.
10. Model selection and role execution policy do not belong in this file.
