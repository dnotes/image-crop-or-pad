import { Given, When, Then } from 'quickpickle'
import '@quickpickle/vitest-browser/svelte'
import '@quickpickle/vitest-browser/actions'
import '@quickpickle/vitest-browser/outcomes'
import { expect } from 'vitest'
import { Buffer } from 'buffer'
import { PNG } from 'pngjs/browser'
import colors from 'color-name'
import '../../src/app.css'

Then('the {string} img should be {int}x{int}', async function (world, name, w, h) {
  let img = await world.page.getByRole('img', { name })
  /** @type {HTMLImageElement} */
  let el = await img.element()
  let { width, height } = await el.getBoundingClientRect()
  expect(width).toBe(w)
  expect(height).toBe(h)
});

Then('the {anchor} pixel should be {string}', async function(world, anchor, color) {
  let img = await world.page.getByRole('img', { name: 'preview' })
  /** @type {HTMLImageElement} */
  let el = await img.element()
  let { width, height } = await el.getBoundingClientRect()
  let png = PNG.sync.read(Buffer.from(el.src.replace('data:image/png;base64,', ''), 'base64'))
  let data = Array.from(png.data)
  expect(data.length).toBe(width * height * 4)
  let x = anchor.includes('left') ? 0 : anchor.includes('right') ? width - 1 : Math.floor(width / 2)
  let y = anchor.includes('top') ? 0 : anchor.includes('bottom') ? height - 1 : Math.floor(height / 2)
  let rgb = colors[color]
  let pixelStart = y * width * 4 + x * 4
  expect(data.slice(pixelStart, pixelStart + 3)).toEqual(rgb)
})