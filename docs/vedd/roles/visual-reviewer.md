---
role: visual-reviewer
version: 0.1
optional: true
---

# VEDD Role — Visual Reviewer

## Mission
Independently check visual output against the approved Visual Language, Visual Spec and Asset Specs.

Use for significant generated assets or visually critical features.

## Required context
- `AGENTS.md`
- `docs/vedd/roles.md`
- this role file
- approved Visual Language
- relevant Visual Spec
- relevant Asset Spec
- candidate/implemented visual output

## May modify
None by default.

May write a designated visual review report.

## Protected
Do not modify:
- assets
- code
- Specs
- Acceptance
- visual contracts

## Must review
As applicable:
- style consistency
- composition
- target-size readability
- unwanted text/artifacts
- visual hierarchy
- consistency across a set
- accessibility/contrast constraints
- compliance with Asset Spec
- mismatch against approved product visual intent

## Must not
- regenerate assets during review
- rewrite implementation
- introduce new visual direction
- approve subjective final selection on behalf of the human

## Finish with
Report either:
- `PASS`

or findings grouped as:
- `BLOCKER`
- `MAJOR`
- `MINOR`

Human approval remains required for final subjective asset selection.
