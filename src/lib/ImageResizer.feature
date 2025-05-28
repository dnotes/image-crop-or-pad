Feature: ImageResizer.svelte

  Scenario: Image should show on load
    Given I render the "ImageResizer" component
    And I wait for 50ms
    Then I should see the "preview" img
    And the "preview" img should be 134x133
    And I should see a "Width" input
    And I should see a "Height" input
    And I should see a "Color" input
    And I should see an "Anchor" input

  Scenario: With a label
    Given I render "ImageResizer" with the following props
      | label | Image 1 |
    Then I should see an "Image 1 Width" input
    And I should see a "Image 1 Height" input
    And I should see an "Image 1 Color" input
    And I should see an "Image 1 Anchor" input

  Rule: Options must be supported

    Background:
      Given I render "ImageResizer"

    Scenario: Changing the width
      When for "Width" I enter "200"
      Then the "preview" img should be 200x133

    Scenario: Changing the height
      When for "Height" I enter "200"
      Then the "preview" img should be 134x200

    Scenario: Changing the background color
      When for "Width" I enter "201"
      And for "Color" I select "lavender"
      Then the "preview" img should be 201x133
      And the top right pixel should be "lavender"

    Scenario: Anchoring top right
      When for "Anchor" I select "top right"
      And for "Width" I enter "201"
      And for "Color" I select "lavender"
      Then the "preview" img should be 201x133
      And the top left pixel should be "lavender"

    Scenario: Anchoring in the center
      When for "Anchor" I select "center"
      And for "Width" I enter "201"
      And for "Height" I enter "201"
      And for "Color" I select "lavender"
      Then the "preview" img should be 201x201
      And the right pixel should be "lavender"
      And the left pixel should be "lavender"
      And the top pixel should be "lavender"
      And the bottom pixel should be "lavender"

    Scenario: Huge image
      And for "Width" I enter "1000"
      Then the "preview" img should be 1000x133
