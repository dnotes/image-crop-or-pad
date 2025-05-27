Feature: Resizing images

  Background:
    Given I am working with "check.png"
    Then the image is 134x133

  Scenario Outline: <term> an image to <w> x <h> (with no options)
    When I resize the image to <w>x<h>
    Then the image should be <w>x<h>
    And the resized image should match the saved file
    Examples:
      | w | h | term |
      | 100 | 100 | Cropping |
      | 100 | 200 | Squeezing |
      | 200 | 100 | Squashing |
      | 200 | 200 | Padding |

  Scenario Outline: Cropping from <anchor>
    When I resize the image to 100x100 from the <anchor>
    Then the image should be 100x100
    And the resized image should match the saved file
    Examples:
      | anchor |
      | top left |
      | top right |
      | bottom left |
      | bottom right |
      | top |
      | bottom |
      | left |
      | right |
      | center |

  Scenario Outline: Padding from <anchor>
    When I resize the image to 200x200 from the <anchor>
    Then the image should be 200x200
    And the resized image should match the saved file
    Examples:
      | anchor |
      | top left |
      | top right |
      | bottom left |
      | bottom right |
      | top |
      | bottom |
      | left |
      | right |
      | center |

  Scenario Outline: Squeezing (crop width, expand height) from <anchor>
    When I resize the image to 100x200 from the <anchor>
    Then the image should be 100x200
    And the resized image should match the saved file
    Examples:
      | anchor |
      | top left |
      | top right |
      | bottom left |
      | bottom right |
      | top |
      | bottom |
      | left |
      | right |
      | center |

  Scenario Outline: Squashing (expand width, crop height) from <anchor>
    When I resize the image to 200x100 from the <anchor>
    Then the image should be 200x100
    And the resized image should match the saved file
    Examples:
      | anchor |
      | top left |
      | top right |
      | bottom left |
      | bottom right |
      | top |
      | bottom |
      | left |
      | right |
      | center |

  @soft
  Scenario: A failing visual regression
    When I resize the image to 100x100
    But there is one pixel different
    When the resized image should match the saved file
    Then the test should have 1 error containing "Images did not match: 1 pixel(s) were different"