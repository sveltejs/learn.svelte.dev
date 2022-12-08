<script>
	export let data;
</script>

<div class="container">
	<ul>
		{#each data.summaries as { slug, title }}
			<li><a href="/docs/{slug}">{title}</a></li>
		{/each}
	</ul>

	<div>
		<h1>Documentation</h1>
		<slot />
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: stretch;
		height: 100%;
	}

	ul {
		margin-top: 2rem;
		flex: 10rem 0 0;
	}
</style>
