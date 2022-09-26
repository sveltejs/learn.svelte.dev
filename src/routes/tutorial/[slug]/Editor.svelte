<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	/** @type {import('monaco-editor').editor.ITextModel} */
	export let model;

	/** @type {HTMLDivElement} */
	let container;

	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor}*/
	let editor;

	let w = 0;
	let h = 0;

	onMount(() => {
		let destroyed = false;

		if (dev && !/chrome/i.test(navigator.userAgent)) {
			container.innerHTML =
				'<p style="text-align: center; width: 20em; max-width: calc(100% - 4rem)">The code editor requires Chrome during development, as it uses module workers</p>';
			return;
		}

		import('$lib/client/monaco/monaco.js').then(({ monaco }) => {
			if (destroyed) return;

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
					'editor.background': '#f4f8fb',
					'token.keyword': '#ff0000'
				}
			});

			monaco.editor.setTheme('svelte');

			editor = monaco.editor.create(container, {
				fontFamily: 'Roboto Mono',
				fontSize: 13,
				padding: {
					top: 16,
					bottom: 16
				},
				minimap: {
					enabled: false
				}
			});
		});

		return () => {
			destroyed = true;
			if (editor) editor.dispose();
		};
	});

	$: if (editor) {
		editor.setModel(model);
	}

	$: if (editor && (w || h)) {
		editor.layout();
	}
</script>

<div bind:clientWidth={w} bind:clientHeight={h}>
	<div bind:this={container} />
</div>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		tab-size: 2;
	}

	/* TODO figure out how to make the indent guides
	   play nicely with fonts other than Menlo */
	div :global(.core-guide-indent.vertical),
	div :global(.core-guide-indent-active.vertical) {
		display: none;
	}

	/* TODO figure out how to remove the weird 1px line
	   in the scroll gutter */
	div :global(.decorationsOverviewRuler) {
		display: none !important;
	}

	div :global(.monaco-editor .view-overlays .current-line) {
		border: none;
	}
</style>
