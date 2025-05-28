Feature: ImageComparison.svelte

  Scenario: Basic render
    Given I render "ImageComparison"
    Then I should see an "Img 1" heading
    And I should see an "Img 2" heading
