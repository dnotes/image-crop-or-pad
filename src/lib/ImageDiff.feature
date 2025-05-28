Feature: ImageDiff.svelte

  Scenario: Fail strategy
    Given I render "ImageDiff"
      Then I should see a "Fail" heading

  Scenario: Crop strategy
    Given I render "ImageDiff" with the following props
      | strategy | crop |
      Then I should see a "Crop" heading

  Scenario: Pad strategy
    Given I render "ImageDiff" with the following props
      | strategy | pad |
      Then I should see a "Pad" heading

  Scenario: Pad adjust strategy
    Given I render "ImageDiff" with the following props
      | strategy | pad_adjust |
      Then I should see a "Pad and adjust" heading

  Scenario: Different image sizes
    Given the ImageDiff fails because of different sized images
    Then I should see an "error" img

  @todo
  Scenario: Different image content
    Given the ImageDiff fails because of different image content
    Then I should see a "fail" img

  @todo
  Scenario: A passing comparison
    Given the ImageDiff passes
    Then I should see a "pass" img

