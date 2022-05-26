<script>
	import { onMount } from 'svelte';
	import { monaco } from '$lib/client/monaco/monaco.js';

	/** @type {import('monaco-editor').editor.ITextModel} */
	export let model;

	/** @type {HTMLDivElement} */
	let container;

	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor}*/
	let editor;

	let w = 0;
	let h = 0;

	onMount(() => {
		editor = monaco.editor.create(container);

		return () => {
			editor.dispose();
		};
	});

	$: if (editor) {
		editor.setModel(model);
	}

	$: if ((editor && w) || h) {
		editor.layout();
	}
</script>

<div bind:clientWidth={w} bind:clientHeight={h}>
	<div bind:this={container} />
</div>

<!-- <textarea value={file ? file.contents : 'loading...'} on:input /> -->
<style>
	div {
		width: 100%;
		height: 100%;
		tab-size: 2;
	}
</style>
