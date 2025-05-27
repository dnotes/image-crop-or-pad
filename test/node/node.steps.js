import { Given, When, Then, Before } from 'quickpickle'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import { expect } from 'vitest'
import { resizeImage } from '../../src/lib/resize-image.js'
import pixelmatch from 'pixelmatch'

Given('I am working with {string}', async (world, image) => {
  if (!image.endsWith('.png')) throw new Error(`Image must be a PNG: ${image}`)
  world.data.image = PNG.sync.read(readFileSync(path.resolve('test/images', image)))
  world.data.name = image
})

When('I resize the image to {int}x{int}', async (world, width, height) => {
  if (!world.data.image) throw new Error('Must use "I am working with {string}" first')
  const newData = resizeImage(world.data.image.data, world.data.image.width, world.data.image.height, width, height)
  const newPng = new PNG({ width, height })
  newPng.data = newData
  world.data.image = newPng
  writeFileSync(path.join('test/images/resized', `${world.data.name}.${width}x${height}.png`), PNG.sync.write(newPng))
})

When('I resize the image to {int}x{int} from the {anchor}', async (world, width, height, anchor) => {
  if (!world.data.image) throw new Error('Must use "I am working with {string}" first')
  const newData = resizeImage(world.data.image.data, world.data.image.width, world.data.image.height, width, height, { anchor, rgba:[0,255,255,255] })
  const newPng = new PNG({ width, height })
  newPng.data = newData
  world.data.image = newPng
  world.data.anchor = anchor
  writeFileSync(path.join('test/images/resized', `${world.data.name}.${anchor}.${width}x${height}.png`), PNG.sync.write(newPng))
})

Then(/the image (?:is|should be) (\d+)x(\d+)/, async (world, width, height) => {
  await expect(world.data.image?.width).toBe(width)
  await expect(world.data.image?.height).toBe(height)
})

Then('the resized image should match the saved file', async (world) => {
  let params = world.data.anchor ? `${world.data.anchor}.${world.data.image.width}x${world.data.image.height}` : `${world.data.image.width}x${world.data.image.height}`
  const expected = PNG.sync.read(readFileSync(path.join('test/images/resized', `${world.data.name}.${params}.png`)))
  const diff = new PNG({ width: expected.width, height: expected.height })
  /** @type {number} */
  let numDiffPixels
  try {
    numDiffPixels = pixelmatch(world.data.image.data, expected.data, diff.data, expected.width, expected.height, { threshold: 0 })
    expect(numDiffPixels).toBe(0)
  }
  catch (e) {
    writeFileSync(path.join('test/images/resized', `${world.data.name}.${params}.diff.png`), PNG.sync.write(diff))
    writeFileSync(path.join('test/images/resized', `${world.data.name}.${params}.actual.png`), PNG.sync.write(world.data.image))
    e.message = `Images did not match: ${numDiffPixels} pixel(s) were different\n` + e.message
    throw e
  }
})

When('there is one pixel different', async function (world) {
  world.data.image.data[0] = 128
  world.data.image.data[1] = 128
  world.data.image.data[2] = 128
  world.data.image.data[3] = 255
});

Then('the test should have {int} error(s) containing {string}', async (world, num, str) => {
  expect(world.info.errors.filter(e => e.message.includes(str)).length).toBe(num)
  world.info.errors = []
})
