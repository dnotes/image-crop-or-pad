// Available anchor positions
/** @type {['top left','top','top right','left','center','right','bottom left','bottom','bottom right']} */
export const anchorPoints = [
  'top left', 'top', 'top right',
  'left', 'center', 'right',
  'bottom left', 'bottom', 'bottom right'
];

/**
 * @typedef {typeof anchorPoints[number]} AnchorPoint
 */

/**
 * @type (color:string)=>[number,number,number,number]
 */
export const hexToRgba = (color) => {
  // @ts-ignore
  const [r, g, b] = color.match(/\w\w/g).map(x => parseInt(x, 16));
  return [r, g, b, 255];
};