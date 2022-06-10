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
		position: relative;
		padding: 0 0 0 0.2em;
		font-size: 1.6rem;
		font-family: inherit;
		color: var(--text);
		width: 100%;
		text-align: left;
		border: 2px solid transparent;
	}

	button.selected {
		color: var(--prime);
	}

	button.selected::before {
		content: '';
		position: absolute;
		width: 1px;
		height: 9999px;
		top: -5000px;
		background: var(--border-color);
		right: calc(-2rem - 2px);
	}

	button.selected::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		/* right: -0.5rem; */
		right: calc(-2.6rem - 2px);
		/* top: 50%; */
		background-color: var(--light-blue);
		border: 1px solid var(--border-color);
		transform: translate(0, 0.2rem) rotate(45deg);
	}

	button:focus-visible {
		outline: none;
		border: 2px solid var(--flash);
	}
</style>
