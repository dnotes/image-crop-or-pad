/**
 * @typedef {[number,number,number,number]} RGBA
 */

/**
 * @typedef {Object} ResizeOptions
 * @property {[number,number,number,number]} [rgba] - The rgba values for padded pixels, 0-255, default [0,0,0,0]
 * @property {import('./helpers.js').AnchorPoint} [anchor] - The anchor position for the resize operation, default "top left"
 */

/**
 * Function to resize an 8-bit RGBA image to a new width and height, either cropping or padding.
 * @param {Uint8Array} orig The original image raw data
 * @param {number} ow Width of the original image
 * @param {number} oh Height of the original image
 * @param {number} nw Width of the resized image
 * @param {number} nh Height of the resized image
 * @param {ResizeOptions} opts Options for resizing operation
 * @returns {Uint8Array} The resized image
 */
export function resizeImage(orig, ow, oh, nw, nh, opts={}) {
  let newImg = new Uint8Array(nw * nh * 4);
  let {
    rgba = [0, 0, 0, 0],
    anchor = "top left"
  } = opts;
  // @ts-ignore
  rgba = rgba.map(v => (v < 0 ? 0 : (v > 255 ? 255 : v)));

  // if padding is necessary, fill the entire new image with the padding color first
  if (nw > ow || nh > oh) {
    for (let i = 0; i < newImg.length; i += 4) {
      newImg[i] = rgba[0];     // R
      newImg[i + 1] = rgba[1]; // G
      newImg[i + 2] = rgba[2]; // B
      newImg[i + 3] = rgba[3]; // A
    }
  }

  // Calculate the area to copy (the intersection of original and new images)
  const copyWidth = Math.min(ow, nw);
  const copyHeight = Math.min(oh, nh);

  // Calculate anchor offsets based on the anchor position
  let srcX = 0, srcY = 0, destX = 0, destY = 0;

  if (nw > ow) { // Padding width
    destX = anchor.includes("right") ? nw - ow : (anchor.includes("left") ? 0 : Math.floor((nw - ow) / 2));
  } else if (nw < ow) { // Cropping width
    srcX = anchor.includes("right") ? ow - nw : (anchor.includes("left") ? 0 : Math.floor((ow - nw) / 2));
  }

  if (nh > oh) { // Padding height
    destY = anchor.includes("bottom") ? nh - oh : (anchor.includes("top") ? 0 : Math.floor((nh - oh) / 2));
  } else if (nh < oh) { // Cropping height
    srcY = anchor.includes("bottom") ? oh - nh : (anchor.includes("top") ? 0 : Math.floor((oh - nh) / 2));
  }

  // Copy the pixels from the original image to the new image
  for (let y = 0; y < copyHeight; y++) {
    for (let x = 0; x < copyWidth; x++) {
      const origIndex = ((srcY + y) * ow + (srcX + x)) * 4;
      const newIndex = ((destY + y) * nw + (destX + x)) * 4;

      newImg[newIndex] = orig[origIndex];         // R
      newImg[newIndex + 1] = orig[origIndex + 1]; // G
      newImg[newIndex + 2] = orig[origIndex + 2]; // B
      newImg[newIndex + 3] = orig[origIndex + 3]; // A
    }
  }

  return newImg;
}