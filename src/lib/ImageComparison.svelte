<script lang="ts">
  import ImageDiff from "./ImageDiff.svelte";
  import ImageResizer from "./ImageResizer.svelte";
  import { PNG } from "pngjs/browser";
  import { anchorPoints, hexToRgba, type AnchorPoint } from './helpers'
  import type { RGBA } from "./resize-image";
  import ColorPicker from "./ColorPicker.svelte";

  let img1:PNG
  let img2:PNG
  let resizedImg1:PNG
  let resizedImg2:PNG

  let maxDiffPx = 0
  let maxDiffPct = 0
  let maxPadPx = 100
  let maxPadPct = 10
  let rgba:RGBA = [230,230,250,255]
  let anchor:AnchorPoint = "top left"

  let color:string = 'lavender'

</script>

<div class="flex flex-col gap-5 w-full">

  <div class="flex gap-5 flex-wrap">
    <div class="flex flex-col gap-1">
      <div class="flex items-center">
        <label for="maxDiffPx">Max Diff Px: </label>
        <input type="number" id="maxDiffPx" bind:value={maxDiffPx} />
        <div>px</div>
      </div>
      <div class="flex items-center">
        <label for="maxDiffPct">Max Diff Pct: </label>
        <input type="number" id="maxDiffPct" bind:value={maxDiffPct} />
        <div>%</div>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <div class="flex items-center">
        <label for="maxPadPx">Max Pad Px: </label>
        <input type="number" id="maxPadPx" bind:value={maxPadPx} />
        <div>px</div>
      </div>
      <div class="flex items-center">
        <label for="maxPadPct">Max Pad Pct: </label>
        <input type="number" id="maxPadPct" bind:value={maxPadPct} />
        <div>%</div>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <div class="flex items-center">
        <label for="anchor">Anchor: </label>
        <select id="anchor" bind:value={anchor}>
          {#each anchorPoints as position}
            <option value={position}>{position}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-center h-10">
        <label for="rgba">Color: </label>
        <ColorPicker bind:color bind:rgba />
      </div>
    </div>
  </div>

  <div class="flex flex-row gap-5 justify-start flex-wrap">
    <ImageResizer label="Img 1" bind:image={img1} bind:resizedImage={resizedImg1} bind:color hideColor />
    <ImageResizer label="Img 2" bind:image={img2} bind:resizedImage={resizedImg2} bind:color hideColor />
  </div>
  <div class="flex flex-row gap-5 flex-wrap">
    <div class="flex gap-5">
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor />
      </div>
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor strategy="crop" />
      </div>
    </div>
    <div class="flex gap-5">
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor strategy="pad" />
      </div>
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor strategy="pad_adjust" />
      </div>
    </div>
  </div>
</div>

<style>

  input {
    width:95px;
    margin: 0 1px 0 8px;
  }
  select {
    margin: 0 1px 0 8px;
  }
  label[for] {
    width:120px;
    text-align: right;
  }
</style>