<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	/** @type {import('$lib/types').File | null} */
	export let file;

	const dispatch = createEventDispatcher();

	/** @type {HTMLDivElement} */
	let container;

	/** @type {import('monaco-editor')} */
	let monaco;

	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor}*/
	let editor;

	/** @type {import('monaco-editor').editor.ITextModel}*/
	let model;

	/** @type {import('$lib/types').File | null} */
	let active;

	onMount(() => {
		let destroyed = false;

		import('monaco-editor').then((module) => {
			if (destroyed) return;

			monaco = module;

			// @ts-ignore
			self.MonacoEnvironment = {
				/**
				 * @param {string} _moduleId
				 * @param {string} label
				 */
				getWorker: function (_moduleId, label) {
					switch (label) {
						case 'json':
							return new jsonWorker();
						case 'css':
						case 'scss':
						case 'less':
							return new cssWorker();
						case 'html':
							return new htmlWorker();
						case 'javascript':
						case 'typescript':
							return new tsWorker();
						default:
							return new editorWorker();
					}
				}
			};

			editor = monaco.editor.create(container);
		});

		return () => {
			if (editor) editor.dispose();
			destroyed = true;
		};
	});

	$: if (editor && file) {
		if (file === active) {
			// model.setValue(file.contents);
		} else {
			const type = file.basename.split('.').pop();

			model = monaco.editor.createModel(
				file.contents,
				type === 'svelte' ? 'html' : type, // TODO figure out how to do Svelte files with monaco.languages.register
				new monaco.Uri().with({ path: file.name })
			);

			model.onDidChangeContent(() => {
				dispatch('change', {
					value: model.getValue()
				});
			});

			editor.setModel(model);
			active = file;
		}
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
		padding: 1rem;
		box-sizing: border-box;
		tab-size: 2;
	}
</style>
