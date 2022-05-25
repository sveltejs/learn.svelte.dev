<script>
	import { onMount } from 'svelte';
	import { monaco } from '$lib/client/monaco/monaco.js';

	/** @type {import('monaco-editor').editor.ITextModel} */
	export let model;

	/** @type {HTMLDivElement} */
	let container;

	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor}*/
	let editor;

	onMount(() => {
		editor = monaco.editor.create(container);

		return () => {
			editor.dispose();
		};
	});

	$: if (editor) {
		editor.setModel(model);
	}
</script>

<div bind:this={container} />

<!-- <textarea value={file ? file.contents : 'loading...'} on:input /> -->
<style>
	div {
		width: 100%;
		height: 100%;
		resize: none;
		border: none;
		box-sizing: border-box;
		tab-size: 2;
	}
</style>
