<script>
	import { getContext } from 'svelte';

	/** @type {import('$lib/types').FileStub} */
	export let file;

	const { select, selected } = getContext('filetree');
</script>

<button class:selected={file === $selected} on:click={() => select(file)}>
	{file.basename}
</button>

<style>
	button {
		padding: 0 0 0 0.2em;
		font-size: 1.6rem;
		font-family: inherit;
		color: var(--text);
	}

	button.selected {
		color: var(--prime);
	}
</style>
