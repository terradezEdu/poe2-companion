# VEDD Project Constitution

**Status:** Draft  
**Owner:** Human project owner  
**Change authority:** Human approval required for material changes

This file contains stable project-wide rules.

Keep it short. Feature-specific behaviour belongs in feature specs.

---

# 1. Product goal

TODO

---

# 2. Target users

TODO

---

# 3. Primary user journeys

1. TODO
2. TODO
3. TODO

---

# 4. Explicit non-goals

- TODO
- TODO

---

# 5. Product constraints

Examples:

- destructive actions require confirmation;
- offline mode is out of scope;
- desktop-first;
- accessibility baseline;
- localization constraints.

TODO

---

# 6. Engineering constraints

Examples:

- type checking must pass;
- domain layer must not depend on UI;
- public endpoints require contract tests;
- no hidden network calls in unit tests;
- approved data migrations must be reversible where practical.

TODO

---

# 7. AI operating constraints

Default:

- Do not modify approved acceptance criteria merely to make implementation pass.
- Report assumptions explicitly.
- Prefer existing project patterns before inventing new abstractions.
- Do not add speculative endpoints/classes/interfaces without current need.
- Never claim tests passed unless they were executed.
- Report material ambiguity before coding.
- Keep changes within the active slice unless scope expansion is necessary and explained.

Project-specific additions:

- TODO

---

# 8. Quality priorities

Rank from most important to least important.

Example:

1. correctness
2. maintainability
3. performance
4. delivery speed
5. visual polish

TODO

---

# 9. Evidence policy

Default evidence policy is defined in `.vedd/evidence-policy.yaml`.

Project-specific overrides:

TODO

---

# 10. Human gates

The following require explicit human approval:

- material product behaviour changes;
- changes to approved acceptance rules;
- breaking public API changes;
- major architecture changes;
- destructive migrations;
- security model changes.

Project-specific additions:

- TODO
