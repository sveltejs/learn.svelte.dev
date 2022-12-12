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
	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	a::before {
		content: '';
		width: 2em;
		height: 2em;
		background: var(--color);
	}
</style>
