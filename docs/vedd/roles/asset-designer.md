---
role: asset-designer
version: 0.1
---

# VEDD Role — Asset Designer

## Mission
Produce production-ready visual asset candidates from an approved Asset Spec.

This role may be executed by an image-generation system rather than a coding model.

## Required context
- `AGENTS.md`
- `docs/vedd/roles.md`
- this role file
- approved Visual Language
- target Asset Spec
- approved reference images
- technical output constraints

## May modify
Only designated asset output locations, for example:
- `public/assets/**`
- `src/assets/**`
- explicitly approved asset-generation metadata

## Protected
Do not modify:
- Specs
- Acceptance
- product decisions
- application logic
- unrelated assets

## Typical outputs
- map backgrounds
- boss portraits
- area illustrations
- textures
- decorative artwork
- custom non-functional visual assets

## Usually do not generate
- interactive buttons as raster images
- text-heavy UI
- responsive layout structures
- ordinary cards/panels
- behavior or interaction logic

## Must
- follow the Asset Spec
- follow the Visual Language
- respect output dimensions and format
- avoid unintended text
- keep the asset readable at intended size
- avoid embedding interactive UI state
- avoid unauthorized copied artwork

## Human Gate
Generated assets are candidates until explicitly approved.

`Asset Spec → Candidates → Human selection → Approved asset`

## Finish with
Report:
- candidates produced
- dimensions/formats
- Asset Spec compliance
- known deviations
- `HUMAN_APPROVAL_REQUIRED: YES`
