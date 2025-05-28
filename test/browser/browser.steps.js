import { Given, When, Then } from 'quickpickle'
import '@quickpickle/vitest-browser/svelte'
import '@quickpickle/vitest-browser/actions'
import '@quickpickle/vitest-browser/outcomes'
import { expect } from 'vitest'
import { Buffer } from 'buffer'
import { PNG } from 'pngjs/browser'
import colors from 'color-name'
import '../../src/app.css'
import ImageDiff from '$lib/ImageDiff.svelte'
import { commands } from '@vitest/browser/context'

async function loadPng(name) {
  let data = await commands.readFile(name, 'base64')
  let buffer = Buffer.from(data, 'base64')
  return PNG.sync.read(buffer)
}

Then('the {string} img should be {int}x{int}', async function (world, name, w, h) {
  let img = await world.page.getByRole('img', { name })
  /** @type {HTMLImageElement} */
  let el = await img.element()

  let png = PNG.sync.read(Buffer.from(el.src.replace('data:image/png;base64,', ''), 'base64'))
  let { width, height } = png
  expect(width).toBe(w)
  expect(height).toBe(h)
});

Then('the {anchor} pixel should be {string}', async function(world, anchor, color) {
  let img = await world.page.getByRole('img', { name: 'preview' })
  /** @type {HTMLImageElement} */
  let el = await img.element()
  let png = PNG.sync.read(Buffer.from(el.src.replace('data:image/png;base64,', ''), 'base64'))
  let { width, height } = png
  let data = Array.from(png.data)
  expect(data.length).toBe(width * height * 4)
  let x = anchor.includes('left') ? 0 : anchor.includes('right') ? width - 1 : Math.floor(width / 2)
  let y = anchor.includes('top') ? 0 : anchor.includes('bottom') ? height - 1 : Math.floor(height / 2)
  let rgb = colors[color]
  let pixelStart = y * width * 4 + x * 4
  expect(data.slice(pixelStart, pixelStart + 3)).toEqual(rgb)
})

When('the color in the {string} {word} is {string}', async function (world, identifier, role, colorName) {
  let locator = world.getLocator(identifier, role)
  let colorString = colors[colorName]
  await world.setValue(locator, colorString)
})

Given('the ImageDiff fails because of different sized images', async function (world) {
  let img1 = await loadPng('./check.png')
  let img2 = await loadPng('../../test/images/resized/check.png.200x200.png')
  await world.render(ImageDiff, {
    props: {
      expected: img1,
      actual: img2,
    }
  })
})

Given('the ImageDiff fails because of different image content', async function (world) {
  let img1 = await loadPng('./check.png')
  let img2 = await loadPng('./check-face.png')
  await world.render(ImageDiff, {
    props: {
      expected: img1,
      actual: img2,
    }
  })
})

Given('the ImageDiff passes', async function (world) {
  let img = await loadPng('./check.png')
  await world.render(ImageDiff, {
    props: {
      expected: img,
      actual: img,
    }
  })
})