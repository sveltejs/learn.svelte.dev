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
		monaco.editor.defineTheme('svelte', {
			base: 'vs',
			inherit: false,
			rules: [
				// TODO more rules
				{ token: '', foreground: '5f5c53' },
				{ token: 'keyword', foreground: '0b69a8' },
				{ token: 'string', foreground: '856e3d' },
				{ token: 'delimiter', foreground: '5f5c53' },
				{ token: 'variable', foreground: 'c05726' },
				{ token: 'constant', foreground: 'c05726' },
				{ token: 'tag', foreground: 'c05726' },
				{ token: 'number', foreground: '72a25d' },
				{ token: 'boolean', foreground: '3080b5' },
				{ token: 'keyword', foreground: '0b69a8' }
			],
			colors: {
				'token.keyword': '#ff0000'
			}
		});

		monaco.editor.setTheme('svelte');

		editor = monaco.editor.create(container, {
			minimap: {
				enabled: false
			}
		});

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

<style>
	div {
		width: 100%;
		height: 100%;
		tab-size: 2;
	}
</style>
