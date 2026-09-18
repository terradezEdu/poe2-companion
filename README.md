# VEDD Starter Kit

**VEDD — Visual Evidence-Driven Development**

This repository template is a practical starting point for software projects developed with AI coding assistants.

VEDD combines:

- visual intent;
- structured specifications;
- executable acceptance criteria;
- incremental connected development;
- evidence-based validation;
- architectural fitness functions;
- convergence/refactoring gates;
- explicit human approval over product intent.

The goal is not to trust generated code. The goal is to define what matters, make important expectations executable, and require evidence before accepting implementation.

---

# Quick start

## 1. Copy this starter kit into your repository

Recommended layout:

```text
/
├─ AGENTS.md
├─ README.md
├─ docs/
│  └─ vedd/
│     ├─ constitution.md
│     ├─ capability-map.md
│     ├─ architecture.md
│     ├─ glossary.md
│     ├─ workflow.md
│     ├─ visuals/
│     ├─ specs/
│     ├─ decisions/
│     └─ audits/
├─ templates/
│  ├─ visual-spec.template.md
│  ├─ spec.template.md
│  ├─ examples.template.md
│  ├─ acceptance.template.feature
│  ├─ qa.template.md
│  ├─ evidence.template.md
│  ├─ convergence-audit.template.md
│  └─ adr.template.md
└─ .vedd/
   ├─ project-state.yaml
   └─ evidence-policy.yaml
```

---

# 2. First thing to tell your coding assistant

Use:

> This repository follows VEDD. Read `AGENTS.md`, `docs/vedd/constitution.md`, `docs/vedd/workflow.md`, and the active feature specification before making changes.

The assistant should treat `AGENTS.md` as the operational protocol.

---

# 3. Recommended project initialization sequence

1. Fill `docs/vedd/constitution.md`.
2. Define the product goal and non-goals.
3. Fill `docs/vedd/capability-map.md`.
4. Add important visual references under `docs/vedd/visuals/`.
5. Create one spec folder per important feature.
6. Start with the smallest real end-to-end Walking Skeleton.
7. Grow through small connected slices.
8. Produce evidence reports for meaningful changes.
9. Run convergence audits at important milestones.

---

# Feature folder convention

Recommended:

```text
docs/vedd/specs/<feature-name>/
├─ spec.md
├─ visual-spec.md
├─ examples.md
├─ acceptance.feature
├─ qa.md
└─ evidence.md
```

Create these from the templates in `/templates`.

Not every feature needs every file. VEDD is risk-proportionate.

---

# Human authority

The following are protected by default:

- approved product intent;
- approved feature specs;
- approved acceptance rules;
- approved Gherkin;
- important business invariants;
- architectural constraints.

An implementation agent must not weaken these artifacts merely to make code pass.

---

# Development rule

Do not ask:

> Which module is least complete?

Ask:

> Which current weakness most limits our ability to deliver or prove an important end-to-end capability?

This is the **Weakest Critical Path** rule.

---

# Completion rule

A feature is not complete because the AI says it is complete.

A meaningful slice should finish with an evidence summary containing:

- what changed;
- what was tested;
- which acceptance scenarios pass;
- which contracts/integrations were verified;
- which quality gates ran;
- what was not verified;
- known risks;
- any spec deviation.

See `templates/evidence.template.md`.

---

# VEDD in one sentence

> Specify what matters, show what you mean, make important expectations executable, grow the whole system in connected slices, force the implementation to prove itself, and periodically simplify what the AI has accumulated.


---

# Create a feature workspace automatically

The starter kit includes:

```bash
python scripts/vedd_new_feature.py "character creation"
```

or:

```bash
python scripts/vedd_new_feature.py inventory --evidence-level E3
```

It creates:

```text
docs/vedd/specs/<feature>/
├─ spec.md
├─ visual-spec.md
├─ examples.md
├─ acceptance.feature
├─ qa.md
└─ evidence.md
```

and marks the feature as active in `.vedd/project-state.yaml`.

This gives both the human and the coding assistant a predictable place to begin.
