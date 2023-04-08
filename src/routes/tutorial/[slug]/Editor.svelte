<script>
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit } from '@codemirror/language';
	import { acceptCompletion } from '@codemirror/autocomplete';
	import { setDiagnostics } from '@codemirror/lint';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import { tags } from '@lezer/highlight';
	import { HighlightStyle } from '@codemirror/language';
	import { syntaxHighlighting } from '@codemirror/language';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { files, selected_file, selected_name, update_file, warnings } from './state.js';
	import './codemirror.css';

	/** @type {HTMLDivElement} */
	let container;

	let preserve_editor_focus = false;
	let skip_reset = true;

	/** @type {any} */
	let remove_focus_timeout;

	/** @type {Map<string, import('@codemirror/state').EditorState>} */
	let editor_states = new Map();

	/** @type {import('@codemirror/view').EditorView} */
	let editor_view;

	const extensions = [
		basicSetup,
		EditorState.tabSize.of(2),
		keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
		indentUnit.of('\t'),
		syntaxHighlighting(
			HighlightStyle.define([
				// TODO add more styles
				{ tag: tags.tagName, color: '#c05726' },
				{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
				{ tag: tags.comment, color: 'var(--sk-code-comment)' },
				{ tag: tags.string, color: 'var(--sk-code-string)' }
			])
		)
	];

	$: reset($files);

	$: select_state($selected_name);

	$: if (editor_view) {

		if ($selected_name) {
			const current_warnings = $warnings[$selected_name];

			if (current_warnings) {
				const diagnostics = current_warnings.map((warning) => {
					/** @type {import('@codemirror/lint').Diagnostic} */
					const diagnostic = {
						from: warning.start.character,
						to: warning.end.character,
						severity: 'warning',
						message: warning.message
					};

					return diagnostic;
				});

				const transaction = setDiagnostics(editor_view.state, diagnostics);

				editor_view.dispatch(transaction);
			}
		}
	}

	let installed_vim = false;

	/** @param {import('$lib/types').Stub[]} $files */
	async function reset($files) {
		if (skip_reset) return;

		let should_install_vim = localStorage.getItem('vim') === 'true';

		const q = new URLSearchParams(location.search);
		if (q.has('vim')) {
			should_install_vim = q.get('vim') === 'true';
			localStorage.setItem('vim', should_install_vim.toString());
		}

		if (!installed_vim && should_install_vim) {
			installed_vim = true;
			const { vim } = await import('@replit/codemirror-vim');
			extensions.push(vim());
		}

		for (const file of $files) {
			if (file.type !== 'file') continue;

			let state = editor_states.get(file.name);

			if (state) {
				const existing = state.doc.toString();

				if (file.contents !== existing) {
					const transaction = state.update({
						changes: {
							from: 0,
							to: existing.length,
							insert: file.contents
						}
					});

					editor_states.set(file.name, transaction.state);
					state = transaction.state;

					if ($selected_name === file.name) {
						editor_view.setState(state);
					}
				}
			} else {
				let lang;

				if (file.name.endsWith('.js') || file.name.endsWith('.json')) {
					lang = javascript();
				} else if (file.name.endsWith('.html')) {
					lang = html();
				} else if (file.name.endsWith('.svelte')) {
					lang = svelte();
				}

				state = EditorState.create({
					doc: file.contents,
					extensions: lang ? [...extensions, lang] : extensions
				});

				editor_states.set(file.name, state);
			}
		}
	}

	/** @param {string | null} $selected_name */
	function select_state($selected_name) {
		if (skip_reset) return;

		const state =
			($selected_name && editor_states.get($selected_name)) ||
			EditorState.create({
				doc: '',
				extensions: [EditorState.readOnly.of(true)]
			});

		editor_view.setState(state);
	}

	onMount(() => {
		editor_view = new EditorView({
			parent: container,
			async dispatch(transaction) {
				editor_view.update([transaction]);

				if (transaction.docChanged && $selected_file) {
					skip_reset = true;

					// TODO do we even need to update `$files`? maintaining separate editor states is probably sufficient
					update_file({
						...$selected_file,
						contents: editor_view.state.doc.toString()
					});

					// keep `editor_states` updated so that undo/redo history is preserved for files independently
					editor_states.set($selected_file.name, editor_view.state);

					await tick();
					skip_reset = false;
				}
			}
		});

		return () => {
			editor_view.destroy();
		};
	});

	beforeNavigate(() => {
		skip_reset = true;
	});

	afterNavigate(async () => {
		skip_reset = false;

		editor_states.clear();
		await reset($files);

		if (editor_view) {
			// could be false if onMount returned early
			select_state($selected_name);
		}

		// clear warnings
		warnings.set({});
	});
</script>

<svelte:window
	on:pointerdown={(e) => {
		if (!container.contains(/** @type {HTMLElement} */ (e.target))) {
			preserve_editor_focus = false;
		}
	}}
	on:message={(e) => {
		if (preserve_editor_focus && e.data.type === 'iframe_took_focus') {
			editor_view.focus();
		}
	}}
/>

<div
	class="container"
	bind:this={container}
	on:focusin={() => {
		clearTimeout(remove_focus_timeout);
		preserve_editor_focus = true;
	}}
	on:focusout={() => {
		// Heuristic: user did refocus themmselves if iframe_took_focus
		// doesn't happen in the next few miliseconds. Needed
		// because else navigations inside the iframe refocus the editor.
		remove_focus_timeout = setTimeout(() => {
			preserve_editor_focus = false;
		}, 200);
	}}
>
	{#if !browser && $selected_file}
		<div class="fake">
			<div class="fake-gutter">
				{#each $selected_file.contents.split('\n') as _, i}
					<div class="fake-line">{i + 1}</div>
				{/each}
			</div>
			<div class="fake-content">
				{#each $selected_file.contents.split('\n') as line}
					<pre>{line || ' '}</pre>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}

	.fake {
		display: grid;
		grid-template-columns: 4rem 1fr;
		grid-gap: 1rem;
		padding: 1rem 0;
		font-size: 1.3rem;
		line-height: 2rem;
	}

	.fake * {
		font-family: var(--font-mono) !important;
		color: #ccc;
	}

	.fake-gutter {
		text-align: right;
		padding-right: 3px;
	}

	.fake-content {
		padding: 0 1rem;
	}

	@media (prefers-color-scheme: dark) {
		.fake * {
			color: #666;
		}
	}
</style>
