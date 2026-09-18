# Example Mapping — Inventory Capacity

## Rule: capacity is 40 slots

### Example: below capacity
Given 39 occupied slots
When a non-stackable sword is added
Then the inventory contains 40 occupied slots

### Example: at capacity
Given 40 occupied slots
When a non-stackable sword is added
Then the item is rejected
And inventory remains unchanged

### Question
Does adding to an existing stack at 40/40 consume a new slot?
