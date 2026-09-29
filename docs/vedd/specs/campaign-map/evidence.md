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

---

## Issue #4 — Hardening and visual evidence pass

**Date:** 2026-09-23
**Role:** Hardener
**Evidence level:** E2
**Scope:** Complete integrated Campaign Map v0.1; no product-content enrichment.

### Evidence classification

| Type | Scope | Status | Command or method | Result summary |
|---|---|---|---|---|
| unit | domain, preview, layout, and production-data unit suites | pass | `npm run test:unit` | 4 test files passed; 0 failures. |
| static | TypeScript, lint, and production bundle | pass | `npm run lint`; `npm run build` | `oxlint` passed; `tsc -b` and Vite production build passed. |
| smoke | configured browser harness and app shell | pass | `npm run test:smoke` | 1 Chromium smoke test passed. |
| acceptance | approved Campaign Map Acceptance Contract | pass | `npm run test:acceptance` | 38 Chromium contract scenarios passed, including all seven structural-invalid fixtures, keyboard activation, knowledge states, and ordinary desktop interaction. |
| integration | bundled data, map/preview wiring, validation error, selected/focused/direction/zoom states | pass | `npx playwright test tests/campaign-map-integration.spec.ts` | 4 Chromium integration tests passed. |
| integration | map surface, routing, directionality, focus, selection, and pan/zoom | pass | `npx playwright test tests/campaign-map-surface.spec.ts` | 6 Chromium surface tests passed. |
| data_validation | sole bundled Act 1 snapshot and audited transitions | pass | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | 1 test file passed: production snapshot validates, all 18 areas/17 transitions retain audited directionality, and known/unknown/verified-absent states remain distinct. |
| visual | required desktop states and stress cases | pass | manual Chromium inspection at 1440×1000, with durable local screenshots | Valid startup, selection, replacement, focus, directionality, knowledge states, long source wrapping, wrapped-node routing, pan/zoom persistence, two bosses, and global structural error were inspected. |
| static | whitespace integrity | pass | `git diff --check` | No whitespace errors. |

### Visual evidence and inspection

Durable screenshots are under `tests/visual/artifacts/issue-4-hardening/`:

- `01-production-startup.png` and `02-production-selected.png` — bundled production snapshot, default and selected.
- `03-valid-no-selection.png` — valid fixture with the Spanish no-selection prompt.
- `04-selected-and-focused-directed-bidirectional.png` — selected and separately focused nodes, plus both connection treatments.
- `05-pan-zoom-selection-preserved.png` — transformed map with the selected preview retained.
- `06-two-bosses.png`, `07-unknown.png`, and `08-verified-absence.png` — tall multi-boss, unknown, and verified-absence preview states.
- `09-long-source-url-stress.png` — deliberately long source URL wraps within the preview without clipping or horizontal overflow.
- `10-wrapped-node-and-routed-edge.png` — long wrapped node label and unrelated-edge clearance.
- `11-structural-error.png` — global Spanish error with no map or preview.

The manual stress probe selected Área A/B/C nine times while repeatedly panning and zooming. It ended with Área C selected, previewed as Área C, and a changed canvas transform; selection and preview remained synchronized.

### Findings and classifications

- **IMPLEMENTATION DEFECT:** none found.
- **TEST/HARNESS DEFECT:** none found. The first `npm run test:unit` attempt could not load the declared `tsx` dependency because this fresh worktree had no `node_modules`; `npm ci` restored the lockfile environment and the independent rerun passed. This was an execution prerequisite, not a repository or product defect.
- **EVIDENCE GAP:** the first ad-hoc fixture screenshots were captured before lazy fixture rendering completed. The visual-evidence probe was corrected by awaiting the relevant map, prompt, edge, or alert before capture; the durable screenshots listed above are the replacement evidence. No product behavior or executable contract test was changed.
- **MATERIAL AMBIGUITY:** none found; no escalation is required.
- **KNOWN OUT-OF-SCOPE PRODUCT GAP:** most bundled Act 1 boss combat fields remain explicitly `UNKNOWN` (description, damage types, weaknesses, resistances, dangerous mechanics, and rewards). Their required Spanish presentation was verified; the underlying content is intentionally not curated by Issue #4.

### Contract impact

None. No approved Spec, Visual Spec, Examples, Acceptance Contract, Product Decision, or architecture artifact was changed. No acceptance check was weakened, skipped, deleted, or reinterpreted.

### Checks not executed

None of the requested E2 checks were omitted. Browser inspection used Chromium at the representative desktop viewport of 1440×1000; mobile behavior was not assessed because it is outside the locked v0.1 scope.

### Residual risks

- The visual pass is a representative desktop inspection, not a cross-browser or mobile compatibility claim.
- The intentionally unknown boss combat content remains a product-data limitation for a later iteration; it is not a structural validation or presentation failure.
- The Act 1 graph is larger than its initial viewport and deliberately relies on the required pan/zoom interaction for off-viewport regions; no locked initial-fit requirement exists.

### Hardening verdict

**Status:** pass
**READY_FOR_FINAL_REVIEW:** YES

---

## Issue #4 — Final Reviewer blocker correction

**Date:** 2026-09-24
**Timestamp:** 2026-09-24T08:40:33+02:00
**Role:** Hardener
**Classification:** Evidence correction; not a contract amendment.

### Provenance correction

The final Reviewer discovered that the locked Acceptance Contract contained 39 browser scenario instances while the executable Acceptance suite contained only 38. The previously recorded 38/38 result was accurate for the executable suite that ran and was green, but it was incomplete as feature Acceptance because the locked Rule 9 scenario `Normalize source-less verification without changing optional knowledge` had no browser-facing executable counterpart. The previous 38/38 claim above is preserved as the historical result of that run.

The missing contract-derived scenario was added through the existing `VITE_CAMPAIGN_TEST_MODE` + `__campaignFixture` test seam. Its fixture requests `VERIFIED` for `Jefe Alfa` with no accepted source, keeps weakness knowledge `unknown`, and keeps rewards `verified-absent`. The integrated browser assertion verifies normalization to `Sin verificar`, absence of the `Verificado` presentation, preserved `Desconocida` and `Ninguna` knowledge presentations, continued Act 1 map availability, and no global campaign information error.

### Corrected complete result

| Measure | Corrected result |
|---|---|
| Locked Acceptance scenario instances | 39 |
| Executable Acceptance scenario instances | 39 |
| Complete Acceptance run | 39 passed, 0 failed |

### Exact evidence rerun

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 tests passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed |
| acceptance | `npm run test:acceptance` | pass — 39 Chromium tests passed, 0 failed |
| integration | `npx playwright test tests/campaign-map-integration.spec.ts` | pass — 4 Chromium tests passed, 0 failed |
| map surface | `npx playwright test tests/campaign-map-surface.spec.ts` | pass — 6 Chromium tests passed, 0 failed |
| data validation | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | pass — 1 test passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors |

### Contract impact

None. The locked Acceptance Contract and product semantics were not changed. No existing assertion was weakened, and no production boss data was enriched.

---

## Issue #4 — Contract amendment propagation and evidence correction

**Date:** 2026-09-24
**Timestamp:** 2026-09-24T15:59:11+02:00
**Role:** Hardener
**Classification:** CONTRACT AMENDMENT PROPAGATION + EVIDENCE CORRECTION; not a production implementation fix.

### Complete correction provenance

1. The original executable Acceptance run passed 38/38 tests, but one of the 39 locked scenario instances was missing from the executable suite.
2. The missing source-less verification normalization scenario was added, producing a nominal 39/39 result.
3. Independent Reviewer inspection found that the new test could pass falsely because `toContainText('Desconocida')` also matched the rendered plural `Desconocidas`. The review also exposed a singular/plural inconsistency in the locked Rule 9 contract artifacts.
4. A scoped Human Contract Decision resolved the displayed `Debilidades` grammar: `UNKNOWN` → `Desconocidas`; `VERIFIED-ABSENT` → `Ningunas`.
5. The Feature Spec, Visual Spec, Examples, and Acceptance Contract were formally reconciled through their approved roles. The locked Acceptance scenario-instance count remained 39.
6. Executable Acceptance was regenerated so both amended Rule 9 scenarios assert the exact rendered weakness value `Desconocidas` through the weakness field's `<dd>` locator.
7. The complete requested E2 evidence was independently rerun after that regeneration.

The historical 38/38 entry, the first 39/39 correction, and the Reviewer blockers remain preserved above. This entry supersedes their incomplete final-readiness conclusions without rewriting their historical results.

### Executable Acceptance regeneration

| Rule 9 scenario | Previous executable assertion | Regenerated executable assertion |
|---|---|---|
| `A verified record may still contain an unknown optional value` | Boss-container substring match for singular `Desconocida` | Exact `toHaveText('Desconocidas')` on `recordField(boss, 'weaknesses')`, whose locator resolves to the rendered `<dd>` value |
| `Normalize source-less verification without changing optional knowledge` | Weakness-field substring match for singular `Desconocida` | Exact `toHaveText('Desconocidas')` on `recordField(boss, 'weaknesses')`, whose locator resolves to the rendered `<dd>` value |

No scenario was removed. No assertion was weakened.

### Contract-to-executable mapping

| Measure | Result |
|---|---|
| Locked Acceptance scenario instances | 39 |
| Executable Acceptance tests (`npx playwright test tests/campaign-map.acceptance.spec.ts --list`) | 39 |
| Rule 9 verified record with unknown weakness | Exact locked value `Desconocidas` maps to an exact rendered weakness-value assertion |
| Rule 9 source-less verification normalization | Exact locked value `Desconocidas` maps to an exact rendered weakness-value assertion; `Sin verificar`, `Ninguna`, map availability, and absence of a global error remain asserted |
| Mapping result | pass — 39 locked instances map to 39 executable instances, including both amended Rule 9 expectations |

### Complete E2 evidence rerun

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 tests passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed, 0 failed |
| acceptance | `npm run test:acceptance` | pass — 39 Chromium tests passed, 0 failed; both amended Rule 9 scenarios passed their exact field-value assertions |
| integration | `npx playwright test tests/campaign-map-integration.spec.ts` | pass — 4 Chromium tests passed, 0 failed |
| map surface | `npx playwright test tests/campaign-map-surface.spec.ts` | pass — 6 Chromium tests passed, 0 failed |
| data validation | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | pass — 1 test passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors in the completed diff |

### Scope and contract impact

- Production implementation changes in this remediation: **NONE**.
- Protected contract artifacts were not modified by this Hardener pass; their existing changes are the approved amendment propagation supplied to this task.
- Contract impact from this Hardener pass: **NONE — approved amendment propagation**.
- Boss combat-data `UNKNOWN` content remains an explicitly deferred product gap. No boss data was enriched.

### Residual risks

- The deferred boss combat-data gap remains visible as explicit unknown content until a separately approved curation task addresses it.
- This correction reruns the required Chromium desktop evidence; it does not add a cross-browser or mobile compatibility claim outside the locked v0.1 scope.

---

## Issue #4 — Final Rule 8 executable evidence correction

**Date:** 2026-09-25
**Role:** Hardener
**Classification:** **EVIDENCE CORRECTION**; not a contract amendment and not a production defect.

### Correction provenance

The final Reviewer found that the Rule 8 executable assertion for `Jefe Beta` scoped `toContainText('Ningunas')` to the whole boss article. In the Rule 8 fixture, `Jefe Beta` also renders `Ningunas` for verified-absent resistances. Therefore the article-level assertion admitted a false-positive path: the resistance value could satisfy the weakness assertion while the `Debilidades` value regressed.

Production behavior was correct. The executable evidence now scopes each boss independently and targets the rendered `Debilidades` `<dd>` through `recordField` with exact text assertions:

| Boss | Previous assertion | Corrected assertion |
|---|---|---|
| `Jefe Alfa` | boss-article `toContainText('Desconocidas')` | `recordField(alfa, 'weaknesses').toHaveText('Desconocidas')` |
| `Jefe Beta` | boss-article `toContainText('Ningunas')` | `recordField(beta, 'weaknesses').toHaveText('Ningunas')` |

The corrected `Jefe Beta` locator resolves only to that boss record's `record-field-weaknesses` `<dd>`; its resistance field cannot satisfy the assertion. Both bosses remain independently scoped, and the executable Rule 8 mapping faithfully represents the locked scenario: unknown weaknesses render as `Desconocidas`, while verified-absent weaknesses render as `Ningunas`.

### Complete E2 evidence rerun

The complete requested E2 suite was rerun after this evidence-only correction. Results are recorded from the commands below.

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 test files passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed, 0 failed |
| acceptance | `npm run test:acceptance` | pass — 39 Chromium tests passed, 0 failed; the corrected Rule 8 scenario passed with exact field-value assertions |
| integration | `npx playwright test tests/campaign-map-integration.spec.ts` | pass — 4 Chromium tests passed, 0 failed |
| map surface | `npx playwright test tests/campaign-map-surface.spec.ts` | pass — 6 Chromium tests passed, 0 failed |
| data validation | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | pass — 1 test passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors |

### Scope and contract impact

- Production implementation changes in this correction: **NONE**.
- Locked Spec, Visual Spec, Examples, and Acceptance Contract changes in this correction: **NONE**.
- No locked scenario or executable assertion was removed or weakened. The executable scenario count remains 39.

---

## Issue #4 — Final Rule 10 executable evidence correction

**Date:** 2026-09-25
**Role:** Hardener
**Classification:** **EVIDENCE CORRECTION**; not a contract amendment and not a production defect.

### Correction provenance

The locked Rule 10 `verification "VERIFIED"` scenario previously used the preview-wide assertion `preview(page).toContainText('Verificado')`. Its fixture renders both the selected `Área A` verification field and `Jefe Alfa` as `Verificado`. Consequently, `Jefe Alfa` could satisfy the preview-level assertion if `Área A` regressed to `Sin verificar`.

Production behavior was already correct. The executable Rule 10 verification rows now use the existing record/field helper and exact rendered-value matching:

| Locked Rule 10 row | Previous assertion | Corrected assertion |
|---|---|---|
| `verification "VERIFIED"` | `preview(page).toContainText('Verificado')` | `recordField(areaRecord(page), 'verification').toHaveText('Verificado')` |
| `verification "UNKNOWN"` | `preview(page).toContainText('Sin verificar')` | `recordField(areaRecord(page), 'verification').toHaveText('Sin verificar')` |

`areaRecord(page)` resolves only the selected area record and `recordField(..., 'verification')` resolves only that record's verification `<dd>`. `Jefe Alfa` is outside this locator chain, so its `Verificado` text cannot satisfy either Rule 10 verification assertion. The assertions remain faithful to the locked outline's selected-record wording and its exact Spanish labels.

### Acceptance-integrity spot check

The verification/status assertions were rechecked for the same record-crossing class of false positive. The Rule 9 area/boss ownership scenario already uses record-scoped verification `<dd>` assertions for both records; the Rule 9 source-less normalization scenario uses the boss verification `<dd>` directly. The remaining verification text assertion is scoped to the named `Jefe Alfa` record, and the Rule 14 preview-level text is a deliberately broad visual-state presence check rather than a record-value mapping. No additional record-crossing verification/status ambiguity was introduced, and no unaffected scenario was redesigned.

### Contract-to-executable mapping

| Measure | Result |
|---|---|
| Locked Acceptance scenario instances | 39 |
| Executable Acceptance tests (`npx playwright test tests/campaign-map.acceptance.spec.ts --list`) | 39 |
| Rule 10 `VERIFIED` mapping | `Área A` verification `<dd>` exactly equals `Verificado` |
| Rule 10 `UNKNOWN` mapping | `Área A` verification `<dd>` exactly equals `Sin verificar` |
| Mapping result | pass — all 39 locked instances retain executable counterparts |

### Complete E2 evidence rerun

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 test files passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed, 0 failed |
| acceptance | `npm run test:acceptance` | pass — 39 Chromium tests passed, 0 failed; both Rule 10 verification rows passed their exact area verification-field assertions |
| integration | `npx playwright test tests/campaign-map-integration.spec.ts` | pass — 4 Chromium tests passed, 0 failed |
| map surface | `npx playwright test tests/campaign-map-surface.spec.ts` | pass — 6 Chromium tests passed, 0 failed |
| data validation | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | pass — 5 tests passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors |

### Scope and contract impact

- Production implementation changes in this correction: **NONE**.
- Locked Spec, Visual Spec, Examples, and Acceptance Contract changes in this correction: **NONE**.
- No scenario or assertion was removed or weakened; the executable count remains **39**.

## Issue #4 — Final Rule 10 rewards-field evidence correction

**Date:** 2026-09-27
**Role:** Hardener
**Classification:** **EVIDENCE CORRECTION**; not a contract amendment and not a production defect.

### Correction provenance

The Rule 10 `verified-absent feminine singular knowledge` executable scenario previously used the preview-wide substring assertion `preview(page).toContainText('Ninguna')`. Its fixture renders the selected area's rewards as `Ninguna` and also renders the boss resistance value as `Resistencias: Ningunas`. Because `Ningunas` contains `Ninguna`, the resistance text could satisfy the preview-wide assertion if the intended area-rewards value regressed.

Production behavior was already correct. The Rule 10 row now asserts the exact value `Ninguna` through `recordField(areaRecord(page), 'rewards').toHaveText('Ninguna')`. `areaRecord(page)` scopes to the selected area record, and `recordField(..., 'rewards')` resolves that record's `record-field-rewards` rendered `<dd>`; the boss record and its `Resistencias: Ningunas` field are outside the locator chain.

The other Rule 10 field-specific rows remain internally consistent: verification rows already use exact selected-area verification `<dd>` assertions. No unrelated Acceptance scenario was redesigned.

### Contract-to-executable mapping

| Measure | Result |
|---|---|
| Locked Acceptance scenario instances | 39 |
| Executable Acceptance tests (`npx playwright test tests/campaign-map.acceptance.spec.ts --list`) | 39 |
| Rule 10 verified-absent feminine singular knowledge | Selected area rewards `<dd>` exactly equals `Ninguna` |
| False-positive path | closed — `Resistencias: Ningunas` cannot satisfy the area rewards-field locator |
| Mapping result | pass — no scenario or assertion was removed or weakened |

### Complete E2 evidence rerun

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 test files passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed, 0 failed |
| acceptance | `npm run test:acceptance` | pass — **39 Chromium tests passed, 0 failed** |
| integration | `npx playwright test tests/campaign-map-integration.spec.ts` | pass — 4 Chromium tests passed, 0 failed |
| map surface | `npx playwright test tests/campaign-map-surface.spec.ts` | pass — 6 Chromium tests passed, 0 failed |
| data validation | `node --import tsx --test tests/unit/campaign-production-data.test.ts` | pass — 1 test file passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors |

### Scope and contract impact

- Production implementation changes in this correction: **NONE**.
- Locked Spec, Visual Spec, Examples, and Acceptance Contract changes in this correction: **NONE**.
- No scenario or assertion was removed or weakened; the executable count remains **39**.

---

## Campaign Map v0.2 — Act 1 boss-enrichment hardening

**Date:** 2026-09-28
**Role:** Hardener
**Evidence level:** E2
**Classification:** data-quality hardening plus one source-determined data correction; no contract or schema amendment.

### Enrichment scope and independent audit

- Audited all **15** bundled Act 1 boss records and all **90** enrichment-field states across description, damage types, weaknesses, resistances, dangerous mechanics, and rewards.
- Confirmed one matching source-audit entry per production boss and verified that every `SUPPORTED_FACT` value survives campaign validation unchanged.
- Confirmed all `UNSUPPORTED`, `REJECTED_BY_HUMAN_DATA_DECISION`, and `SOURCE_CONFLICT` audit states remain production `UNKNOWN`; none became `VERIFIED-ABSENT`.
- Confirmed the Human Data Decisions remain applied: weaknesses require an explicit source declaration; skill-level damage is not aggregated into boss-level damage; factual encounter summaries are permitted without inferred tactics or severity; and only causally boss-bound encounter or quest outcomes are represented as boss rewards.
- Confirmed Lachlann's damage remains `UNKNOWN`, Count Geonor's disputed location is omitted, and the Executioner/King in the Mists/Count Geonor resistance disputes preserve only the agreed categorical type without a percentage.

### Data defect corrected

The Rust King's curated resistances previously contained `Físico` and `Fuego`. The accepted PoE2DB boss record explicitly establishes Fire resistance and separately reports armour; the accepted PoE2 Wiki boss record does not declare Physical resistance. Treating armour as Physical resistance would be an unsupported semantic inference. Production data and its audit entry were therefore narrowed to the source-established categorical value `Fuego`; the explicit Lightning weakness remains unchanged.

### Stale source-count assertion correction

The previous production-data assertion required exactly one source per boss. It now verifies the actual record-scoped traceability invariant:

- every verified boss has one to four sources;
- every source is non-empty, whitespace-clean, URL-parseable, and belongs to the accepted PoE2DB or PoE2 Wiki source families and record types;
- exact source URL sets are asserted per boss, so a valid-family source belonging to another record is rejected;
- duplicate source entries are rejected;
- every field-audit source is represented by that boss record's production provenance, allowing the PoE2DB locale difference while preserving the source record identity;
- boss verification dates remain independently `2026-09-28`, while area dates remain `2026-09-22`.

This replaces a cardinality assumption with stronger provenance, family, formatting, ownership, uniqueness, and date checks. Multiple accepted sources are allowed without weakening traceability.

### Persistent regression evidence added

- Dataset ↔ audit consistency covers all 15 bosses and all 90 field states.
- Knowledge-state fidelity covers unsupported facts, rejected weakness inference, rejected skill-damage aggregation, and source conflicts.
- Supported-fact evidence covers explicit weaknesses, Human-Decision-approved dangerous mechanics, causally boss-bound rewards, and categorical resistance preservation.
- Focused assertions preserve the 29 unresolved `UNKNOWN` fields and the five documented source conflicts.
- Production browser integration now selects Beira, Lachlann, the Executioner, and Ogham Manor from the bundled dataset and checks exact record-field output for known combat facts, explicit weakness, dangerous mechanics, boss reward, unknown damage/weakness, categorical resistance without percentages, record-scoped sources, and the independent boss verification date.

### Product-visible inspection

Full-page Chromium captures were inspected for Beira and Ogham Manor/Count Geonor after the focused integration test. Long mechanics, rewards, and multi-source provenance wrap without clipping or horizontal overflow. No implementation defect was found. The existing tall desktop preview composition was not redesigned; separate visual-fidelity work remains explicitly deferred.

### Remaining unknown knowledge

There are **29** boss enrichment fields that remain honestly `UNKNOWN`:

- Bloated Miller: weaknesses, resistances.
- Devourer: weaknesses.
- Brambleghast: rewards.
- Rust King: dangerous mechanics.
- Rotten Druid (Grim Tangle): damage types, weaknesses, resistances, dangerous mechanics, rewards.
- Lachlann: damage types, weaknesses.
- Draven: damage types, weaknesses.
- Asinia: damage types, weaknesses, dangerous mechanics.
- Rotten Druid (Root Hollow): damage types, weaknesses, resistances, dangerous mechanics, rewards.
- Crowbell: weaknesses, resistances.
- King in the Mists: weaknesses, dangerous mechanics.
- Executioner: weaknesses.
- Candlemass: weaknesses.
- Count Geonor: weaknesses.

### Remaining source conflicts

- Lachlann boss-level damage types.
- Executioner Fire-resistance magnitude.
- King in the Mists Chaos-resistance magnitude.
- Count Geonor Cold-resistance magnitude.
- Count Geonor campaign location name.

### Complete hardening evidence

| Type | Command | Result |
|---|---|---|
| unit | `npm run test:unit` | pass — 4 test files passed, 0 failed |
| static | `npm run lint` | pass — `oxlint` completed successfully |
| build | `npm run build` | pass — TypeScript build and Vite production bundle completed successfully |
| smoke | `npm run test:smoke` | pass — 1 Chromium test passed, 0 failed |
| acceptance | `npm run test:acceptance` | pass — 39 Chromium tests passed, 0 failed |
| browser / E2 | `npx playwright test tests/harness.smoke.spec.ts tests/campaign-map-integration.spec.ts tests/campaign-map-surface.spec.ts tests/campaign-map.acceptance.spec.ts tests/visual/campaign-preview.visual.spec.ts` | pass — 56 Chromium tests passed, 0 failed |
| production-data validation | `node --import tsx tests/unit/campaign-production-data.test.ts` | pass — 7 tests passed, 0 failed |
| static | `git diff --check` | pass — no whitespace errors |

`npm run test:e2` also returned exit code 0 with 56 Playwright tests passing. Its broad default discovery additionally imported `tests/unit/*.test.ts`, which emitted five Node-test preview failures outside Playwright's accounting. The explicit browser-spec command above was therefore run separately and is the clean browser/E2 result of record. A preliminary parallel smoke/Acceptance launch also failed before test execution because two Vite web-server lifecycles were started concurrently; both required suites subsequently passed in isolated sequential runs.

### Scope and contract impact

- Production application logic changes: **NONE**.
- Production data correction: Rust King resistances only, as described above.
- Locked Spec, Visual Spec, Examples, Acceptance Contract, Product Decisions, schema, and validation logic changes: **NONE**.
- Deferred work: visual-fidelity redesign remains out of scope.
