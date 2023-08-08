<script>
	const options = ['h1', 'h2', 'h3', 'p', 'marquee'];
	let selected = options[0];
</script>

<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option}</option>
	{/each}
</select>

<svelte:element this={selected}>
	Je suis un élément <code>&lt;{selected}&gt;</code>
</svelte:element>
