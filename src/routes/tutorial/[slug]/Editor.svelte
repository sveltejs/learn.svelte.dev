<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { stubs, selected, state } from './state.js';

	/**
	 * file extension -> monaco language
	 * @type {Record<string, string>}
	 * */
	const types = {
		js: 'javascript',
		ts: 'typescript',
		svelte: 'html' // TODO
	};

	/**
	 * URL -> model
	 * @type {Map<string, import('monaco-editor').editor.ITextModel>}
	 * */
	const models = new Map();

	export let read_only = false;

	/** @type {HTMLDivElement} */
	let container;

	/** @type {ReturnType<typeof init> | undefined}*/
	let instance;

	let w = 0;
	let h = 0;

	let preserve_editor_focus = false;

	onMount(() => {
		let destroyed = false;

		if (dev && !/chrome/i.test(navigator.userAgent)) {
			container.innerHTML =
				'<p style="text-align: center; width: 20em; max-width: calc(100% - 4rem)">The code editor requires Chrome during development, as it uses module workers</p>';
			return;
		}

		let dark_mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		import('$lib/client/monaco/monaco.js').then(({ monaco }) => {
			if (destroyed) return;
			instance = init(monaco, dark_mode);
		});

		/** @param {MediaQueryListEvent} event */
		const on_mode_change = (event) => {
			const dark = event.matches;
			if (dark !== dark_mode) {
				dark_mode = dark;
				instance?.set_theme(dark ? 'svelte-dark' : 'svelte');
			}
		};
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', on_mode_change);

		return () => {
			destroyed = true;
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', on_mode_change);
			if (instance) {
				instance.update_files([]); // removes all files
				instance.editor.dispose();
			}
		};
	});

	/**
	 * @param {import('monaco-editor')} monaco
	 * @param {boolean} dark_mode
	 */
	function init(monaco, dark_mode) {
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
				{ token: 'boolean', foreground: '3080b5' }
			],
			colors: {
				'editor.background': '#f4f8fb',
				'token.keyword': '#ff0000'
			}
		});

		monaco.editor.defineTheme('svelte-dark', {
			base: 'vs-dark',
			inherit: false,
			rules: [
				// TODO more rules
				{ token: '', foreground: 'e6e6e6' },
				{ token: 'keyword', foreground: '3384ba' },
				{ token: 'string', foreground: '856e3d' },
				{ token: 'delimiter', foreground: '5f5c53' },
				{ token: 'variable', foreground: 'd47346' },
				{ token: 'constant', foreground: 'd47346' },
				{ token: 'tag', foreground: 'd47346' },
				{ token: 'number', foreground: '91bd7f' },
				{ token: 'boolean', foreground: '499cd3' }
			],
			colors: {
				'editor.background': '#1a1a1a',
				'token.keyword': '#ff0000'
			}
		});

		monaco.editor.setTheme(dark_mode ? 'svelte-dark' : 'svelte');

		const editor = monaco.editor.create(container, {
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

		let notify = true;

		/**
		 *
		 * @param {import('$lib/types').Stub[]} stubs
		 */
		function update_files(stubs) {
			notify = false;
			for (const stub of stubs) {
				if (stub.type === 'directory') {
					continue;
				}

				const model = models.get(stub.name);

				if (model) {
					const value = model.getValue();

					if (stub.contents !== value) {
						model.pushEditOperations(
							[],
							[
								{
									range: model.getFullModelRange(),
									text: stub.contents
								}
							],
							() => null
						);
					}
				} else {
					create_file(stub);
				}
			}

			for (const [name, model] of models) {
				if (!stubs.some((stub) => stub.name === name)) {
					model.dispose();
					models.delete(name);
				}
			}
			notify = true;
		}

		/**
		 * @param {import('$lib/types').FileStub} stub
		 */
		function create_file(stub) {
			// deep-copy stub so we can mutate it and not create a memory leak
			stub = JSON.parse(JSON.stringify(stub));

			const type = /** @type {string} */ (stub.basename.split('.').pop());

			const model = monaco.editor.createModel(
				stub.contents,
				types[type] || type,
				new monaco.Uri().with({ path: stub.name })
			);

			model.updateOptions({ tabSize: 2 });

			model.onDidChangeContent(() => {
				const contents = model.getValue();

				if (notify) {
					stub.contents = contents;
					state.update_file(stub);
				}
			});

			models.set(stub.name, model);
		}

		return {
			editor,
			set_theme: monaco.editor.setTheme,
			update_files,
			create_file
		};
	}

	$: if (instance) {
		instance.update_files($stubs);
	}

	$: if (instance) {
		instance.editor.updateOptions({ readOnly: read_only });
	}

	$: if (instance && $stubs /* to retrigger on stubs change */) {
		const model = $selected && models.get($selected.name);
		instance.editor.setModel(model ?? null);
	}

	$: if (instance && (w || h)) {
		instance.editor.layout();
	}
</script>

<svelte:window
	on:pointerdown={(e) => {
		if (!container.contains(/** @type {HTMLElement} */ (e.target))) {
			preserve_editor_focus = false;
		}
	}}
	on:message={(e) => {
		if (e.data.type === 'pointerdown') {
			preserve_editor_focus = false;
		}
	}}
/>

<div bind:clientWidth={w} bind:clientHeight={h}>
	<div
		bind:this={container}
		on:keydown={(e) => {
			if (e.key === 'Tab') {
				preserve_editor_focus = false;

				setTimeout(() => {
					preserve_editor_focus = true;
				}, 200);
			}
		}}
		on:focusin={() => {
			preserve_editor_focus = true;
		}}
		on:focusout={() => {
			// Little timeout, because inner postMessage event might take a little
			setTimeout(() => {
				if (preserve_editor_focus) {
					instance?.editor.focus();
				}
			}, 100);
		}}
	/>
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

	/* reposition overlay message that appears when trying to edit in readonly mode */
	div :global(.monaco-editor-overlaymessage) {
		margin-top: 6rem;
	}
	div :global(.monaco-editor-overlaymessage .anchor.below) {
		display: none;
	}
</style>
