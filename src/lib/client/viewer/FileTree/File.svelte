<script>
	import { getContext } from 'svelte';

	/** @type {import('$lib/types').File} */
	export let file;

	const { dispatch } = getContext('filetree');

	$: type = file.name.slice(file.name.lastIndexOf('.') + 1);
</script>

<button
	style="background-image: url(tutorial/icons/{type}.svg)"
	on:click={() => dispatch('select', file)}>{file.basename}</button
>

<style>
	button {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>
