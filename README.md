# image-crop-or-pad

A tiny, fully-tested utility to resize images by cropping or padding, intended to assist with visual regression testing of components.

## Installation

```bash
npm install image-crop-or-pad
```

## Usage

```javascript
import { resizeImage } from 'image-crop-or-pad';

// Example: Resize an 8-bit RGBA image
const originalImage = new Uint8Array(/* your image data */);
const originalWidth = 100;
const originalHeight = 100;
const newWidth = 150;
const newHeight = 150;

const resizedImage = resizeImage(
  originalImage,
  originalWidth,
  originalHeight,
  newWidth,
  newHeight,
  {
    rgba: [255, 255, 255, 255], // White padding
    anchor: "center" // Center the original image
  }
);
```

## Options

- `rgba`: The RGBA values for padded pixels (0-255), default [0,0,0,0]
- `anchor`: The anchor position for the resize operation, default "top left"
  - Possible values: "top left", "top right", "bottom left", "bottom right", "top", "bottom", "left", "right", "center"
