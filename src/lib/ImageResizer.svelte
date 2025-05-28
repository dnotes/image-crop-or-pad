<script>
  import { onMount } from 'svelte';
  import { resizeImage } from './resize-image.js';
  import { PNG } from 'pngjs/browser';
  import { Buffer } from 'buffer';
  import check from '$lib/check.png';

  // Props with defaults
  /** @type {PNG} */
  export let image;

  /** @type {string} */
  export let label = '';

  /** @type {PNG} */
  let resizedImage;
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
  let rgba=[0,0,0,0];

  /** @type {typeof anchorPositions[number]} */
  let anchor="top left";

  // Color mapping for named colors
  const colorMap = {
    'transparent': [0, 0, 0, 0],
    'lavender': [230, 230, 250, 255],
    'red': [255, 0, 0, 255],
    'green': [0, 255, 0, 255],
    'blue': [0, 0, 255, 255],
    'black': [0, 0, 0, 255],
    'white': [255, 255, 255, 255]
  };

  // Available anchor positions
  /** @type {['top left','top','top right','left','center','right','bottom left','bottom','bottom right']} */
  const anchorPositions = [
    'top left', 'top', 'top right',
    'left', 'center', 'right',
    'bottom left', 'bottom', 'bottom right'
  ];

</script>

<div class="image-resizer">
  <div class="controls">
    <div class="control-group">
      <label for="width">{label} Width</label>
      <input id="width" type="number" bind:value={width} min="1" />
    </div>

    <div class="control-group">
      <label for="height">{label} Height</label>
      <input id="height" type="number" bind:value={height} min="1" />
    </div>

    <div class="control-group">
      <label for="color">{label} Padding Color</label>
      <select id="color" on:change={(e)=>{
        // @ts-ignore
        rgba[0]=colorMap[e.target.value][0];
        // @ts-ignore
        rgba[1]=colorMap[e.target.value][1];
        // @ts-ignore
        rgba[2]=colorMap[e.target.value][2];
      }}>
        {#each Object.keys(colorMap) as item}
          <option value="{item}">{item}</option>
        {/each}
      </select>
    </div>

    <div class="control-group">
      <label for="anchor">{label} Anchor</label>
      <select id="anchor" bind:value={anchor}>
        {#each anchorPositions as position}
          <option value={position}>{position}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="preview">
    {#if b64}
      <img src="data:image/png;base64,{b64}" alt="{label} preview" />
    {:else}
      <div class="loading">Loading...</div>
    {/if}
  </div>
</div>

<style>
  .image-resizer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: bold;
  }

  input, select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .preview {
    border: 1px solid #ddd;
    padding: 1rem;
    display: flex;
    justify-content: center;
    background-color: #f9f9f9;
    min-height: 200px;
    align-items: center;
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