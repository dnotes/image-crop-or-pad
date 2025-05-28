<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
  <title>image-crop-or-pad is a tiny isomorphic JS image resizer for visual regression testing</title>
</svelte:head>

{@render children()}
