# Feature Spec — Inventory Capacity

**Status:** Example  
**Evidence level:** E2

## Purpose
Allow the player to store items safely without silently exceeding inventory capacity.

## Rules
1. Inventory has 40 slots.
2. A non-stackable item consumes one slot.
3. Adding a non-stackable item at 40/40 is rejected.
4. Rejected additions do not mutate inventory contents.

## Failure behaviour
At capacity, return `inventory_full`.

## Invariant
Inventory occupied slot count is always between 0 and 40 inclusive.

## Acceptance summary
- adding below capacity succeeds;
- adding at capacity fails without mutation.
