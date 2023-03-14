<script>
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import { indentUnit } from '@codemirror/language';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import { tags } from '@lezer/highlight';
	import { HighlightStyle } from '@codemirror/language';
	import { syntaxHighlighting } from '@codemirror/language';
	import { afterNavigate } from '$app/navigation';
	import { files, selected_file, selected_name, update_file } from './state.js';
	import './codemirror.css';

	// TODO add more styles (selection ranges, etc)
	const highlights = HighlightStyle.define([
		{ tag: tags.tagName, color: '#c05726' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' }
	]);

	const theme = syntaxHighlighting(highlights);

	/** @type {HTMLDivElement} */
	let container;

	let preserve_editor_focus = false;

	/** @type {any} */
	let remove_focus_timeout;

	/** @type {Map<string, import('@codemirror/state').EditorState>} */
	let editor_states = new Map();

	/** @type {import('@codemirror/view').EditorView} */
	let editor_view;

	$: if (editor_view && $selected_name) {
		select_state($selected_name);
	}

	/** @param {string} $selected_name */
	function select_state($selected_name) {
		const file = $files.find((file) => file.name === $selected_name);
		if (file?.type !== 'file') return;

		let state = editor_states.get(file.name);
		if (!state) {
			const extensions = [
				basicSetup,
				EditorState.tabSize.of(2),
				keymap.of([indentWithTab]),
				indentUnit.of('\t'),
				theme
			];

			if (file.name.endsWith('.js') || file.name.endsWith('.json')) {
				extensions.push(javascript());
			} else if (file.name.endsWith('.html')) {
				extensions.push(html());
			} else if (file.name.endsWith('.svelte')) {
				extensions.push(svelte());
			}

			state = EditorState.create({
				doc: file.contents,
				extensions
			});

			editor_states.set(file.name, state);
		}

		editor_view.setState(state);
	}

	onMount(() => {
		if (dev && !/chrome/i.test(navigator.userAgent)) {
			container.innerHTML =
				'<p style="text-align: center; width: 20em; max-width: calc(100% - 4rem)">The code editor requires Chrome during development, as it uses module workers</p>';
			return;
		}

		// TODO is this still necessary?
		let dark_mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		/** @param {MediaQueryListEvent} event */
		const on_mode_change = (event) => {
			const dark = event.matches;
			if (dark !== dark_mode) {
				dark_mode = dark;
			}
		};
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', on_mode_change);

		editor_view = new EditorView({
			parent: container,
			dispatch(transaction) {
				editor_view.update([transaction]);

				if (transaction.docChanged && $selected_file) {
					// TODO do we even need to update `$files`? maintaining separate editor states is probably sufficient
					update_file({
						...$selected_file,
						contents: editor_view.state.doc.toString()
					});

					// keep `editor_states` updated so that undo/redo history is preserved for files independently
					editor_states.set($selected_file.name, editor_view.state);
				}
			}
		});

		return () => {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', on_mode_change);

			editor_view.destroy();
		};
	});

	afterNavigate(() => {
		editor_states.clear();
		select_state($selected_name);
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
	on:keydown={(e) => {
		if (e.key === 'Tab') {
			preserve_editor_focus = false;

			setTimeout(() => {
				preserve_editor_focus = true;
			}, 200);
		}
	}}
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
</style>
