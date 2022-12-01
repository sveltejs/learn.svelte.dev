<script>
	import { dev } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';

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

	/** @type {import('$lib/types').Stub[]} */
	export let stubs;
	/** @type {import('$lib/types').Stub | null} */
	export let selected = null;
	export let read_only = false;

	const dispatch = createEventDispatcher();

	/** @type {HTMLDivElement} */
	let container;

	/** @type {ReturnType<typeof init> | undefined}*/
	let instance;

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
			instance = init(monaco);
		});

		return () => {
			destroyed = true;
			if (instance) {
				instance.update_files([]); // removes all files
				instance.editor.dispose();
			}
		};
	});

	/** @param {import('monaco-editor')} monaco */
	function init(monaco) {
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
					dispatch('change', stub);
				}
			});

			models.set(stub.name, model);
		}

		return {
			editor,
			update_files,
			create_file
		};
	}

	$: if (instance) {
		instance.update_files(stubs);
	}

	$: if (instance) {
		instance.editor.updateOptions({ readOnly: read_only });
	}

	$: if (instance && stubs /* to retrigger on stubs change */) {
		const model = selected && models.get(selected.name);
		instance.editor.setModel(model ?? null);
	}

	$: if (instance && (w || h)) {
		instance.editor.layout();
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

	/* reposition overlay message that appears when trying to edit in readonly mode */
	div :global(.monaco-editor-overlaymessage) {
		margin-top: 6rem;
	}
	div :global(.monaco-editor-overlaymessage .anchor.below) {
		display: none;
	}
</style>
