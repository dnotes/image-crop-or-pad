import { Given, When, Then } from 'quickpickle'
import '@quickpickle/vitest-browser/svelte'
import '@quickpickle/vitest-browser/actions'
import '@quickpickle/vitest-browser/outcomes'
import { expect } from 'vitest'
import { PNG } from 'pngjs/browser'

Then('the {string} img should be {int}x{int}', async function (world, name, w, h) {
  await world.wait(100)
  let img = await world.page.getByRole('img', { name })
  /** @type {HTMLImageElement} */
  let el = await img.element()
  let { width, height } = await el.getBoundingClientRect()
  expect(width).toBe(w)
  expect(height).toBe(h)
});

Then('the {anchor} pixel should be {string}', async function(world, anchor, color) {
  await world.wait(100)
  let img = await world.page.getByRole('img', { name: 'test' })
  /** @type {HTMLImageElement} */
  let el = await img.element()
  let { width, height } = await el.getBoundingClientRect()
  let x = anchor.includes('left') ? 0 : anchor.includes('right') ? width : width / 2
  let y = anchor.includes('top') ? 0 : anchor.includes('bottom') ? height : height / 2
})