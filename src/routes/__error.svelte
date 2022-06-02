<script>
	import { dev } from '$app/env';
	import { page } from '$app/stores';
</script>

<div class="error">
	<div class="content">
		<h1>{$page.status}</h1>

		{#if dev && $page.error}
			<pre>{$page.error.stack}</pre>
		{/if}
	</div>
</div>

<style>
	.error {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
	}

	h1 {
		font-weight: 400;
		font-size: 8rem;
		text-align: center;
	}

	pre {
		/* max-width: 40em; */
		font-size: 1.4rem;
	}
</style>
