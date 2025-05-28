<script>
  import { onMount } from 'svelte';
  import { resizeImage } from './resize-image.js';
  import { PNG } from 'pngjs/browser';
  import { Buffer } from 'buffer';
  import check from '$lib/check.png';
  import { anchorPoints, hexToRgba } from './helpers.js';
  import colors from 'color-name'
  import ColorPicker from './ColorPicker.svelte';

  // Props with defaults
  /** @type {PNG} */
  export let image;

  /** @type {string} */
  export let label = '';

  /** @type {PNG} */
  export let resizedImage;
  /** @type {string} */
  let b64;

    onMount(async () => {
    try {
      // Fetch the image as an ArrayBuffer
      const response = await fetch(check);
      const arrayBuffer = await response.arrayBuffer();

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(arrayBuffer);

      // Parse the PNG
      image = PNG.sync.read(buffer);
      width = image.width;
      height = image.height;

    } catch (error) {
      console.error('Error loading image:', error);
    }
  });


  function refresh() {
    b64='';
    resizedImage = new PNG({ height, width });
    resizedImage.data = Buffer.from(resizeImage(image.data, image.width, image.height, width, height, { rgba, anchor }))
    // Convert PNG to base64 string properly
    const pngBuffer = PNG.sync.write(resizedImage);
    b64 = Buffer.from(pngBuffer).toString('base64');
  }

  $: if (image && width && height && rgba && anchor) {
    refresh()
  }

  // State variables

  /** @type {number} */
  let width=100;

  /** @type {number} */
  let height=100;

  /** @type {[number,number,number,number]} */
  export let rgba=[0,0,0,0];

  /** @type {import('./helpers.js').AnchorPoint} */
  export let anchor="top left";

  export let hideColor = false;

  export let color = 'lavender';

  // @ts-ignore*/
  $: if (color) rgba = colors[color] ? [...colors[color], 255] : [0,0,0,0];

</script>

<div class="flex flex-col">
  {#if label}
  <h3 class="font-bold text-xl bg-stone-200 px-2 mb-2 leading-loose w-full">{label}</h3>
  {/if}
  <div class="flex flex-row-reverse gap-3 mx-auto">
    <div class="flex flex-col gap-2 w-[130px]">
      <div class="control-group">
        <label for="width">Width</label>
        <input id="width" type="number" aria-label="{label} Width" bind:value={width} min="1" />
      </div>

      <div class="control-group">
        <label for="height">Height</label>
        <input id="height" type="number" aria-label="{label} Height" bind:value={height} min="1" />
      </div>

      <div class="control-group">
        <label for="anchor">Anchor</label>
        <select id="anchor" aria-label="{label} Anchor" bind:value={anchor}>
          {#each anchorPoints as position}
            <option value={position}>{position}</option>
          {/each}
        </select>
      </div>

      {#if !hideColor}
        <div class="control-group">
          <label for="color">Color</label>
          <ColorPicker bind:color bind:label bind:rgba />
        </div>
      {/if}
    </div>

    <div class="border border-gray-300 bg-gray-50 p-4 flex justify-center items-center w-[262px] h-[262px] lg:w-[360px] lg:h-[360px]">
      {#if b64}
        <img class="checkerboard" src="data:image/png;base64,{b64}" alt="{label} preview" />
      {:else}
        <div class="loading">Loading...</div>
      {/if}
    </div>
  </div>
</div>

<style>

  .control-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
  }

  input, select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

    /* Checkerboard pattern for transparent background */
  .checkerboard {
    background-image:
      linear-gradient(45deg, #eee 25%, transparent 25%),
      linear-gradient(-45deg, #eee 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #eee 75%),
      linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    background-color: #f9f9f9;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .loading {
    padding: 2rem;
    color: #666;
  }

</style>