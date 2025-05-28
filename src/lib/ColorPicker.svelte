<script lang="ts">
  import colors from 'color-name'
  export let label = '';
  export let color = 'lavender';
  export let rgba

  // @ts-ignore
  $: if (color) rgba = colors[color] ? [...colors[color], 255] : [0,0,0,0];
</script>

<select class="ml-2 mr-px" id="color" aria-label="{label} Color" bind:value={color}>
  <option>lavender</option>
  <option>white</option>
  <option>black</option>
  <option>red</option>
  <option>green</option>
  <option>transparent</option>
</select>
