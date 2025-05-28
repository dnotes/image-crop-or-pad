<script lang="ts">
  import { PNG } from 'pngjs/browser';
  import pixelmatch from 'pixelmatch';
  import { resizeImage, type RGBA } from './resize-image';
  import { Buffer } from 'buffer';
  import type { AnchorPoint } from './helpers';
  import { tick } from 'svelte';

  type StrategyType="fail"|"crop"|"pad"|"pad_adjust";

  export let expected:PNG;
  export let actual:PNG;
  export let strategy:StrategyType = 'fail';

  export let maxDiffPx = 0;
  export let maxDiffPct = 0;
  export let maxPadPx = 100;
  export let maxPadPct = 10;
  export let rgba:RGBA = [0,0,0,0];
  export let anchor:AnchorPoint = "top left";

  let maxDiffPxAdj = 0;
  let maxDiffPctAdj = 0;

  $: adjustedMaxDiffPx = maxDiffPx + maxDiffPxAdj;
  $: adjustedMaxDiffPct = maxDiffPct + maxDiffPctAdj;

  let status = 'loading';
  let errorMessage = '';

  let diffPixels = 0;
  let diffPct = 0;
  let diffImageBase64 = '';

  $: if (expected && actual && strategy && (maxPadPct > -1) && (maxPadPct > -1)) {
    if (shouldResizeImages()) {
      const { exp, act } = strategies[strategy].fn(expected, actual);
      compareImages(exp, act);
    }
    else {
      compareImages(expected, actual);
    }
  }

  $: aspect = expected?.height > expected?.width ? 'max-h-full' : 'max-w-full';

  function shouldResizeImages() {
    // Check if images should be adjusted
    let wDiffPx = Math.abs(expected.width - actual.width);
    let wDiffPct = (wDiffPx / expected.width) * 100;
    let hDiffPx = Math.abs(expected.height - actual.height);
    let hDiffPct = (hDiffPx / expected.height) * 100;

    // Don't resize the images if the difference is over the limit
    if (
      (maxPadPx && (wDiffPx > maxPadPx || hDiffPx > maxPadPx)) ||
      (maxPadPct && (wDiffPct > maxPadPct || hDiffPct > maxPadPct))
    ) {
      return false;
    }
    return true
  }

  async function _status() {
    await tick();
    if (
      (adjustedMaxDiffPx && diffPixels > adjustedMaxDiffPx) ||
      (adjustedMaxDiffPct && diffPct > adjustedMaxDiffPct) ||
      (!adjustedMaxDiffPx && !adjustedMaxDiffPct && diffPixels)
    ) status = 'fail';
    else status = 'pass';
  }
  const statusFn = () => {
    maxDiffPxAdj = 0;
    maxDiffPctAdj = 0;
    _status();
  }

  type ImageResizerFn = (expected:PNG,actual:PNG)=>{exp:PNG,act:PNG}
  type StatusFunction = (expected:PNG,actual:PNG)=>void
  type Strategy = {
    label: string
    fn: ImageResizerFn
    statusFn: StatusFunction
  }
  const padFn:ImageResizerFn = (exp, act) => {
    const width = Math.max(exp.width, act.width);
    const height = Math.max(exp.height, act.height);
    const expectedImg = new PNG({ width, height });
    expectedImg.data.fill(resizeImage(exp.data, exp.width, exp.height, width, height, { rgba, anchor }));
    const actualImg = new PNG({ width, height });
    actualImg.data.fill(resizeImage(act.data, act.width, act.height, width, height, { rgba, anchor }));
    return { exp:expectedImg, act:actualImg };
  }
  const strategies:{[key:string]:Strategy} = {
    fail: {
      label: "Fail fast",
      fn: (exp, act) => ({ exp, act }),
      statusFn,
    },
    crop: {
      label: "Crop",
      fn: (exp, act) => {
        const width = Math.min(exp.width, act.width);
        const height = Math.min(exp.height, act.height);
        const expectedImg = new PNG({ width, height });
        expectedImg.data.fill(resizeImage(exp.data, exp.width, exp.height, width, height, { rgba, anchor }));
        const actualImg = new PNG({ width, height });
        actualImg.data.fill(resizeImage(act.data, act.width, act.height, width, height, { rgba, anchor }));
        return { exp:expectedImg, act:actualImg };
      },
      statusFn,
    },
    pad: {
      label: "Pad",
      fn: padFn,
      statusFn,
    },
    pad_adjust: {
      label: "Pad and adjust",
      fn: padFn,
      statusFn: (exp, act) => {
        // bigger rectangle - smaller rectangle
        const biggerRect = Math.max(expected.width, actual.width) * Math.max(expected.height, actual.height)
        const smallerRect = Math.min(expected.width, actual.width) * Math.min(expected.height, actual.height)
        maxDiffPxAdj = biggerRect - smallerRect
        maxDiffPctAdj = (maxDiffPxAdj / smallerRect) * 100
        _status();
      },
    }
  }

  function compareImages(exp:PNG,act:PNG):void {
    try {
      let diff = new PNG({ width:exp.width, height:exp.height });
      diffPixels = pixelmatch(exp.data, act.data, diff.data, exp.width, exp.height);
      diffPct = (diffPixels / (exp.width * exp.height)) * 100;
      strategies[strategy].statusFn(exp, act);
      diffImageBase64 = 'data:image/png;base64,' + Buffer.from(PNG.sync.write(diff)).toString('base64');
    } catch(e) {
      status = 'error';
      // @ts-ignore
      errorMessage = e.message;
    }
  }

</script>

<div class="image-diff w-48 lg:w-60 items-center flex flex-col bg-gray-100 gap-2 pb-2">
  <h2 class="font-bold leading-loose px-1 w-full text-center"
   class:bg-green-300={status === 'pass'}
   class:bg-gray-300={status === 'loading'}
   class:bg-red-300={status === 'error' || status === 'fail'}
  >{strategies[strategy].label}</h2>

  <div class="h-48 lg:h-60 flex items-center justify-center p-4 relative">
    {#if status === 'error'}
      <img class="{aspect}" height="{expected.height}" width="{expected.width}" alt="error - {errorMessage}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJ5jfZixgAAAABJRU5ErkJggg==" />
    {:else if status === 'loading'}
      <img class="{aspect}" height="100" width="100" alt="loading" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJ5jfZixgAAAABJRU5ErkJggg==" />
    {:else}
      <img class="{aspect}" alt="{status}" src="{diffImageBase64}" />
    {/if}
  </div>
  <div class="flex text-xs">
    Pixels: {diffPixels}px (max {adjustedMaxDiffPx}px)
  </div>
  <div class="flex text-xs">
    Pct: {diffPct.toFixed(2)}% (max {adjustedMaxDiffPct.toFixed(2)}%)
  </div>
</div>

<style>
  img {
    width:auto;
    height:auto;
    border: 1px solid #ddd;
    display:flex;
    align-items: center;
    justify-content: center;
    padding:1rem;
  }
</style>