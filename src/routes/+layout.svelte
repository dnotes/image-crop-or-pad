<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
  <title>image-crop-or-pad is a tiny isomorphic JS image resizer for visual regression testing</title>
</svelte:head>

<div class="flex w-screen h-screen flex-col gap-8">
	<header class="flex gap-2 items-center justify-between sticky top-0 bg-gray-200 px-5 lg:px-12 py-2 lg:py-5">
		<h1 class="text-xl font-bold lg:text-4xl">
			<a href="/">image-crop-or-pad</a>
		</h1>
		<nav class="flex gap-2 md:gap-6">
			<a href="https://www.npmjs.com/package/image-crop-or-pad">npm</a>
			<a href="/">playground</a>
			<a href="/about">about</a>
		</nav>
	</header>
	<main class="flex-grow px-5 lg:px-12 justify-center">
		<div class="max-w-5xl mx-auto">
			{@render children()}
		</div>
	</main>
	<footer class="flex justify-center px-5 lg:px-12">

	</footer>
</div>

<style lang="postcss">
	a {
		padding: 2px 4px;
		display: block;
	}
</style>