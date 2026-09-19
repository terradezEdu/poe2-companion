# Evidence — Campaign Map Issue #9 domain contract, validation, and localization

**Date:** 2026-09-19
**Evidence level:** E2
**Review role:** Reviewer (independent pass)

---

## Evidence classification

| Type | Scope | Status | Command or method | Result summary |
|---|---|---|---|---|
| static | Issue #9 changed TypeScript and package script | pass | `npm run lint`; `npm run build` | `oxlint` passed; `tsc -b` and Vite production build passed. |
| unit | focused domain, validation, and localization tests | pass | `npm run test:unit` | Node test runner passed the focused `campaign-domain.test.ts` suite (1 file, 1 pass, 0 failures). |
| contract | domain admission and localization contract | pass | source inspection plus focused suite and direct validator invocation | The validator supplies a single supported schema, the seven structural failure codes, explicit knowledge states, direction normalization, record-scoped verification, and the required Spanish mappings. |
| data_validation | structural boundary and source-less verification normalization | pass | focused suite plus direct area-record validator invocation | All seven structural fixture classes reject admission; omitted optional facts become `unknown`; a source-less `VERIFIED` area returned `ok: true`, normalized to `UNKNOWN`, localized to `Sin verificar`, and retained independent `unknown` / `verified-absent` optional facts. |
| acceptance | Issue #9 task gate | not_applicable | architectural-slice review | Issue #9 owns the domain admission boundary and no Campaign Map UI. The approved feature-level scenarios require UI/integration to observe selection, map availability, preview, and global-error presentation. This does not waive feature acceptance. |
| feature_acceptance | approved Campaign Map Acceptance Contract | not_run | pending later UI and integration slices | Deliberately not executed: the required feature surface is outside Issue #9. It remains pending and must be exercised after the UI and feature-integration tasks. |

The task-gate acceptance classification is valid only at this architectural slice. It is not a feature-gate waiver.

---

## Reviewer verdict

**Status:** pass

Issue #9 meets its bounded domain-model, validation-boundary, knowledge-state, and Spanish-localization responsibilities. No implementation defect or scope creep was found in the reviewed files. Feature-level acceptance remains `not_run`, so this verdict is not approval to merge the Campaign Map feature.

## Findings

- No contract deviation found in the domain implementation.
- `VERIFIED` without a usable source list normalizes to `UNKNOWN` in the shared verification normalizer. The focused test proves the boss path; an independent direct invocation also proved the area path.
- The normalized source-less case returns a successful dataset result, so this validator does not introduce a structural/global-error outcome. Optional `unknown` and `verified-absent` states remain unchanged.
- `localizeVerification('UNKNOWN')` returns `Sin verificar`.
- The domain exposes no UI, remote loading, runtime dataset selection, or Act-selection behavior; those responsibilities remain out of scope.

## Contract deviations

None found.

## Evidence concerns

- No contract-derived test was modified, skipped, deleted, or weakened in the current diff. The focused unit test adds coverage for the source-less verification rule and does not substitute for the approved feature Acceptance Contract.
- The current shared working diff contains edits to protected `spec.md`, `examples.md`, `acceptance.feature`, and `product-decisions.md`. Their uncommitted Git state alone cannot establish authorship; the Human Gate subsequently provided explicit provenance confirmation, recorded below.
- Feature acceptance and visual evidence were not executed because UI/integration is explicitly outside Issue #9; their status is `not_run`, not pass.

## Checks executed

- `git status --short`, `git diff --name-status`, and `git diff --check` (no whitespace errors)
- Review of GitHub Issue #9, the approved Campaign Map Spec, Examples, Acceptance Contract, and `.vedd/evidence-policy.yaml`
- Review of all Issue #9 production files under `src/campaign/`, focused unit test, package script, and current diff
- `npm run test:unit` — pass
- `npm run lint` — pass
- `npm run build` — pass
- Direct `validateCampaignDataset` invocation for a source-less `VERIFIED` area with preserved optional knowledge — pass

## Checks not executed

- `npm run test:acceptance` — `not_run`; requires the later Campaign Map UI/integration surface.
- Visual inspection against the Visual Spec — `not_run`; Issue #9 owns no visible surface.
- Feature integration test — `not_run`; feature integration is outside this task.

## Residual risks

- Later UI/integration work must map structural validator failures to the required global Spanish error and suppress all partial graph/preview rendering.
- Later UI work must render the admitted knowledge and verification states with the required Spanish grammar and record ownership; this pass verifies only the domain/localization boundary.
- Protected-artifact provenance has been confirmed by the Human Gate and is recorded below.

## Recommended next action

Preserve this domain boundary and proceed to the data/UI/integration slices. Run the approved feature Acceptance Contract and visual review once the Campaign Map surface exists; do not convert `feature_acceptance` from `not_run` until then.

---

## Human Gate decision

**Date:** 2026-09-19

The Human Gate accepted the independent Reviewer verdict and explicitly confirmed the provenance of the protected-artifact changes:

- `product-decisions.md` — human-approved amendment
- `spec.md` — human reconciliation of the approved amendment
- `examples.md` — Example Designer propagation
- `acceptance.feature` — Acceptance Designer propagation
- implementation and focused tests — Implementer
- this `evidence.md` report — independent Reviewer

The previously noted protected-artifact provenance concern is addressed by this explicit Human confirmation.

| Gate | Recorded state | Effect |
|---|---|---|
| task | pass | The Issue #9 architectural-slice task gate is accepted with `acceptance: not_applicable`. |
| feature | not_run | Feature acceptance remains mandatory and pending later UI/integration work. The feature gate cannot be completed at this slice. |
| human | pass | Human Gate approved the Reviewer verdict and the task-gate classification. |
