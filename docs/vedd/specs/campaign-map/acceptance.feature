# language: en
@campaign-map @v0_1
Feature: Consult the Act 1 campaign map
  As a Path of Exile 2 player
  I want to inspect the areas and direct transitions of Act 1
  So that I can prepare for dangers, bosses and rewards

  Background:
    Given the campaign map is used in a normal desktop browser

  Rule: The map opens with the fixed and complete Act 1 campaign

    # Trace: examples.md Rule 1, Example 1
    Scenario: Open the campaign map with valid information
      Given the bundled campaign information is structurally valid
      When the player opens the campaign map
      Then the complete Act 1 map is shown
      And no other Act is shown
      And no area is selected
      And the player is prompted in Spanish to select an area
      And no control is available to change Acts or load different campaign information

  Rule: Connections describe direct traversal without recommending a route

    # Trace: examples.md Rule 2, Example 1
    Scenario: A connection without an explicit direction allows traversal both ways
      Given the bundled campaign information includes a direct connection between "Área A" and "Área B" without an explicit direction
      When the player opens the campaign map
      Then the connection communicates traversal from "Área A" to "Área B"
      And the connection communicates traversal from "Área B" to "Área A"

    # Trace: examples.md Rule 2, Example 1
    Scenario: An explicitly directed connection allows traversal only in its stated direction
      Given the bundled campaign information includes a direct connection from "Área B" to "Área C"
      When the player opens the campaign map
      Then the connection communicates traversal from "Área B" to "Área C"
      And the connection does not communicate traversal from "Área C" to "Área B"
      And the directed connection is visually distinguishable from a bidirectional connection

    # Trace: examples.md Rule 2, Example 2
    Scenario: A branch is not presented as a recommended route
      Given "Área A" has direct transitions to both "Área B" and "Área C"
      When the player opens the campaign map
      Then both transitions are shown
      And neither transition is identified as recommended, optimal or mandatory

  Rule: Selection is singular and survives map navigation

    # Trace: examples.md Rule 3, Example 1
    Scenario: Selecting another area replaces the current preview
      Given "Área A" is selected and its preview is visible
      When the player selects "Área B"
      Then "Área B" is the only selected area
      And the preview shows information for "Área B"
      And information for "Área A" is no longer presented as the selected preview

    # Trace: examples.md Rule 3, Example 2
    Scenario: Panning and zooming do not change the selected area
      Given "Área B" is selected
      When the player pans and zooms the map
      Then "Área B" remains selected
      And its preview remains visible

  Rule: Keyboard focus does not select an area until activation

    # Trace: examples.md Rule 4, Example 1
    Scenario: Focus and selection remain distinct during keyboard use
      Given no area is selected
      When the player moves keyboard focus to "Área A"
      Then "Área A" has a visible focus indicator
      And "Área A" exposes an accessible name
      And no area preview is opened
      When the player activates the focused area
      Then "Área A" becomes selected
      And the preview for "Área A" is visible
      And the preview is the same as the one opened by clicking "Área A"
      And the selected and focused states remain visually distinguishable

  Rule: The selected-area preview preserves the approved information hierarchy

    # Trace: examples.md Rule 5, Example 1
    Scenario: Inspect a selected area with complete known information
      Given "Área A" has known area information, verification evidence and one known boss
      When the player selects "Área A"
      Then the preview identifies the area by name and level
      And area danger and its warning appear before general rewards, points of interest and curiosities
      And the area's verification status, sources and verification date remain associated with the area
      And each boss appears after the area-level information in its own block
      And the boss block shows its name, description, damage, weaknesses or resistances, dangerous mechanics, rewards, verification status, sources and verification date
      And boss, mechanic and reward information is available without a separate reveal action

  Rule: Each boss retains its own information

    # Trace: examples.md Rule 6, Example 1
    Scenario: Show two bosses as separate records
      Given "Área A" has "Jefe Alfa" and "Jefe Beta"
      And each boss has different combat information, rewards and verification evidence
      When the player selects "Área A"
      Then a separate boss block is shown for "Jefe Alfa"
      And a separate boss block is shown for "Jefe Beta"
      And each boss's combat information, rewards and verification evidence remains in its own block
      And each boss's dangerous mechanics appear before its rewards

  Rule: Danger is an area assessment and its warning is separate context

    # Trace: examples.md Rule 7, Example 1
    Scenario: Show known high danger separately from its warning
      Given "Área A" has danger "HIGH" and the warning "Daño físico explosivo"
      And "Área A" has two known bosses
      When the player selects "Área A"
      Then the area danger is shown as "Alto"
      And the warning is shown separately as "Daño físico explosivo"
      And the danger is identifiable as area-level editorial guidance
      And no danger rating is assigned to either boss

    # Trace: examples.md Rule 7, Example 2
    Scenario: Unknown danger is not presented as low danger
      Given "Área B" has danger "UNKNOWN"
      When the player selects "Área B"
      Then the area danger is shown as "Desconocido"
      And it is not shown or visually implied as "Bajo"

  Rule: Player-facing controlled values are localized in Spanish

    # Trace: examples.md Rule 10, Example 1
    Scenario Outline: Translate controlled values according to their meaning
      Given the selected record contains <fixture value>
      When the record is shown in the preview
      Then the player sees "<label>" for that value
      And no untranslated identifier is shown for that value

      Examples:
        | fixture value                              | label         |
        | danger "LOW"                               | Bajo          |
        | danger "MEDIUM"                            | Medio         |
        | danger "HIGH"                              | Alto          |
        | danger "EXTREME"                           | Extremo       |
        | danger "UNKNOWN"                           | Desconocido   |
        | verification "VERIFIED"                    | Verificado    |
        | verification "UNKNOWN"                     | Sin verificar |
        | unknown feminine plural knowledge           | Desconocidas  |
        | verified-absent feminine singular knowledge | Ninguna       |

  Rule: Known values, verified absence and unknown knowledge are visibly distinct

    # Trace: examples.md Rule 8, Examples 1, 2 and 3
    Scenario Outline: Show each knowledge state explicitly
      Given the selected area has its boss and reward knowledge recorded as "<knowledge>"
      When the area preview is shown
      Then its boss information is shown as "<boss display>"
      And its rewards are shown as "<reward display>"
      And neither value is left blank

      Examples:
        | knowledge       | boss display       | reward display             |
        | known           | Jefe Alfa          | Recompensa A               |
        | unknown         | Jefe: Desconocido  | Recompensas: Desconocidas  |
        | verified absence | Jefe: Ninguno       | Recompensas: Ninguna       |

  Rule: Verification evidence belongs to the record it supports

    # Trace: examples.md Rule 9, Examples 1 and 3
    Scenario: Keep area and boss verification evidence independent
      Given "Área A" is verified with an area source and verification date
      And "Jefe Alfa" is unverified with its own source and verification date
      When the player selects "Área A"
      Then the area is shown as "Verificado"
      And "Jefe Alfa" is shown as "Sin verificar"
      And each source and verification date appears only with the record it supports
      And no global verification status is shown for the whole preview

    # Trace: examples.md Rule 9, Example 2
    Scenario: A verified record may still contain an unknown optional value
      Given "Jefe Alfa" is verified by an accepted source
      And the weakness of "Jefe Alfa" is unknown
      When the player opens the boss information
      Then "Jefe Alfa" is shown as "Verificado"
      And its weakness is shown as "Desconocida"

  Rule: Structurally invalid campaign information prevents partial display

    # Trace: examples.md Rule 11, Example 1 (all seven invalid fixtures)
    Scenario Outline: Reject structurally invalid campaign information
      Given the bundled campaign information <structural problem>
      When the player opens the campaign map
      Then a global campaign information error is shown in Spanish
      And the Act 1 map is not shown
      And no partial campaign graph is shown

      Examples:
        | structural problem                                   |
        | cannot be parsed                                     |
        | uses an unsupported schema version                   |
        | does not contain Act 1                               |
        | contains no areas in Act 1                           |
        | repeats a required identifier                        |
        | omits a required structural reference                |
        | contains a connection to an area that does not exist |

  Rule: Missing optional knowledge does not invalidate the map

    # Trace: examples.md Rule 12, Example 1
    Scenario: Open a map when optional boss knowledge is missing
      Given the bundled campaign information is structurally valid
      And the description and weakness of "Jefe Alfa" are unknown
      When the player opens the campaign map
      And selects the boss's area
      Then the Act 1 map remains available
      And the area remains selectable
      And "Jefe Alfa" remains in its own boss block
      And its description and weakness are shown explicitly as unknown in Spanish
      And no global campaign information error is shown

  Rule: The game version is always visible

    # Trace: examples.md Rule 13, Examples 1 and 2
    Scenario Outline: Show the game version used by the campaign information
      Given the bundled campaign information has game version "<version>"
      When the player opens the campaign map
      Then the visible game version is "<display>"
      And no version or dataset selector is available
      And no control is available to load campaign information remotely

      Examples:
        | version | display     |
        | 0.1.0   | 0.1.0       |
        | unknown | Desconocido |

  Rule: Important states are understandable without relying on hover or color alone

    # Trace: examples.md Rule 14, Example 1
    Scenario: Distinguish critical map and preview states
      Given the map contains selected, focused, bidirectional and directed states
      And the selected preview contains known, unknown, absent, verified and unverified information
      When the player inspects the map and preview
      Then selection and keyboard focus are visibly distinct
      And bidirectional and directed connections are visibly distinct
      And danger and verification meanings are conveyed with Spanish text, not color alone
      And known, unknown and verified-absence values are visibly distinct
      And decoration does not obscure labels, connections, safety information, verification evidence or actions
      And no required information is available only by hovering
      And the presentation has an original RPG campaign-map character without reproducing the game interface or assets pixel for pixel

    # Trace: examples.md Rule 14, Example 2
    Scenario: Keep the map usable through ordinary desktop interaction
      Given the complete valid Act 1 map is visible
      When the player repeatedly pans, zooms, selects "Área A" and then selects "Área B"
      Then the map continues to provide visible interaction feedback
      And "Área B" is the only selected area
      And the preview remains synchronized with "Área B"
      And the experience does not become visually unresponsive
