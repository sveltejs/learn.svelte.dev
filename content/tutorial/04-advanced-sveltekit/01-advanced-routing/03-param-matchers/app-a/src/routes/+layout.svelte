<script>
	const colors = ['ff3e00', '676779', '42b4ff', 'invalid'];
</script>

<nav>
	{#each colors as color}
		<a href="/colors/{color}" style="--color: #{color}">#{color}</a>
	{/each}
</nav>

<slot />

<style>
	nav {
		position: relative;
		display: flex;
		gap: 0.5em;
		z-index: 2;
	}

	a {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		gap: 0.5rem;
		background-color: white;
	}

	a::before {
		content: '';
		width: 2em;
		height: 2em;
		background: var(--color);
	}
</style>
