<script lang="ts">
  import ImageDiff from "./ImageDiff.svelte";
  import ImageResizer from "./ImageResizer.svelte";
  import { PNG } from "pngjs/browser";
  import { anchorPoints, hexToRgba, type AnchorPoint } from './helpers'
  import type { RGBA } from "./resize-image";
  import ColorPicker from "./ColorPicker.svelte";
  import Prose from "./Prose.svelte";

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

  $: if (
    maxDiffPct > -1 ||
    maxDiffPx > -1 ||
    maxPadPx > -1 ||
    maxPadPct > -1 ||
    rgba ||
    anchor
  ) {
    img1 = img1
    img2 = img2
  }

</script>

<div class="flex flex-col gap-5 w-full">

  <Prose>
    <h3>Settings:</h3>
  </Prose>

  <div class="flex gap-3 flex-wrap">
    <div class="flex flex-col gap-3">
      <div class="field">
        <label for="maxDiffPx" title="If the difference (in pixels) is less than this number, the test will pass.">Pass Diff Px: </label>
        <input type="number" id="maxDiffPx" bind:value={maxDiffPx} />
        <div>px</div>
      </div>
      <div class="field">
        <label for="maxDiffPct" title="If the difference (in pixels) is less than this number, the test will pass.">Pass Diff Pct: </label>
        <input type="number" id="maxDiffPct" bind:value={maxDiffPct} />
        <div>%</div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div class="field">
        <label for="maxPadPx" title="The maximum number of pixels by which EACH SIDE OF an image can be cropped or padded. If the difference is less than this, the sized will be padded.">Max Pad Px: </label>
        <input type="number" id="maxPadPx" bind:value={maxPadPx} />
        <div>px</div>
      </div>
      <div class="field">
        <label for="maxPadPct" title="The maximum percentage of the full length by which EACH SIDE OF an image can be cropped or padded. If the difference is less than this, the sized will be padded.">Max Pad Pct: </label>
        <input type="number" id="maxPadPct" bind:value={maxPadPct} />
        <div>%</div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div class="field">
        <label for="anchor" title="Which part of the cropped or padded image stays the same.">Anchor: </label>
        <select id="anchor" bind:value={anchor}>
          {#each anchorPoints as position}
            <option value={position}>{position}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="rgba" title="The color used when padding an image.">Color: </label>
        <ColorPicker bind:color bind:rgba />
      </div>
    </div>
  </div>

  <Prose>
    <h3>Images:</h3>
  </Prose>

  <div class="flex flex-row gap-5 justify-start flex-wrap">
    <ImageResizer label="Img 1" bind:image={img1} bind:resizedImage={resizedImg1} bind:color hideColor />
    <ImageResizer label="Img 2" bind:image={img2} bind:resizedImage={resizedImg2} bind:color hideColor />
  </div>

  <Prose>
    <h3>Strategies and Results:</h3>
  </Prose>


  <div class="flex flex-row gap-6 flex-wrap">
    <div class="flex gap-6">
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor />
      </div>
      <div>
        <ImageDiff bind:expected={resizedImg1} bind:actual={resizedImg2} rgba={[0,0,0,255]} bind:maxDiffPct bind:maxDiffPx bind:maxPadPct bind:maxPadPx bind:anchor strategy="crop" />
      </div>
    </div>
    <div class="flex gap-6">
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

  .field {
    display:flex;
    flex-direction: row;
    align-items: center;
    background: lightgray;
    padding: 2px 8px;
  }
  input {
    width:95px;
  }
  label[for] {
    width:110px;
    text-align: left;
    padding-right:8px;
    display:flex;
  }
</style>