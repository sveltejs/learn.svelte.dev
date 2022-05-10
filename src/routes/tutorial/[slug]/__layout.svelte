<script context="module">
	/** @type {import('./__layout').Load} */
	export async function load({ fetch }) {
		const res = await fetch('/tutorial/sections.json');
		const { index } = await res.json();

		return {
			props: { index }
		};
	}
</script>

<script>
	import { setContext } from 'svelte';

	/** @type {any} */
	export let index;

	setContext('index', index);
</script>

<slot />
