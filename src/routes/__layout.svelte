<script>
	import '@sveltejs/site-kit/base.css';
</script>

<header>learn.svelte.dev</header>
<main><slot /></main>

<style>
	:global(body) {
		--header-height: 3rem;
		margin: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden; /* shouldn't be necessary */
	}

	header {
		width: 100%;
		height: var(--header-height);
		background-color: #eee;
	}

	main {
		width: 100%;
		height: calc(100vh - var(--header-height));
	}
</style>
