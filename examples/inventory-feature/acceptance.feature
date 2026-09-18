Feature: Inventory capacity

  Scenario: Add a non-stackable item below capacity
    Given the inventory has 39 occupied slots
    When a non-stackable sword is added
    Then the sword is present in the inventory
    And the inventory has 40 occupied slots

  Scenario: Reject a non-stackable item at capacity
    Given the inventory has 40 occupied slots
    When a non-stackable sword is added
    Then the sword is not added
    And the inventory still has 40 occupied slots
    And the result is inventory_full
