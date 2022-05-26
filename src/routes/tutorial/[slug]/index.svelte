<script context="module">
	/** @type {import('./__types/index').Load} */
	export function load({ props, stuff }) {
		return {
			props: {
				...props,
				index: stuff.index
			}
		};
	}
</script>

<script>
	import { afterNavigate } from '$app/navigation';
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import TableOfContents from './_/TableOfContents.svelte';
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Editor from './_/Editor.svelte';
	import Folder from './_/Folder.svelte';
	import { monaco } from '$lib/client/monaco/monaco.js';

	/** @type {import('$lib/types').SectionIndex} */
	export let index;

	/** @type {import('$lib/types').Section} */
	export let section;

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub | null>} */
	const selected = writable(section.a[section.chapter.focus]);

	/** @type {Map<import('$lib/types').FileStub, import('monaco-editor').editor.ITextModel>} */
	const models = new Map();

	/** @type {import('monaco-editor').editor.ITextModel} */
	let current_model;

	/** @type {HTMLIFrameElement} */
	let iframe;

	let completed = false;
	let path = '/';
	let src = '/loading.html';

	$: b = { ...section.a, ...section.b };

	const { select } = setContext('filetree', {
		/** @param {import('$lib/types').FileStub} file */
		select: (file) => {
			$selected = file;
			current_model = /** @type {import('monaco-editor').editor.ITextModel} */ (models.get(file));
		},

		selected
	});

	/** @type {import('$lib/types').Adapter} */
	let adapter;

	/** @type {Record<string, string>}*/
	const types = {
		js: 'javascript',
		ts: 'typescript',
		svelte: 'html' // TODO
	};

	onMount(() => {
		let destroyed = false;

		// TODO vary adapter based on situation, e.g. webcontainers
		import('$lib/client/adapters/filesystem/index.js').then(async (module) => {
			if (!destroyed) adapter = await module.create(Object.values(section.a));
			src = adapter.base;
		});

		document.addEventListener('pagehide', () => {
			adapter.destroy();
		});

		return () => {
			destroyed = true;
			if (adapter) {
				adapter.destroy();
			}

			clearInterval(interval);
		};
	});

	afterNavigate(async () => {
		models.forEach((model) => {
			model.dispose();
		});
		models.clear();

		/** @type {Record<string, boolean>}*/
		const complete_states = {};

		const stubs = Object.values(section.a);

		stubs.forEach((stub) => {
			if (stub.type === 'file') {
				const target = /** @type {import('$lib/types').FileStub} */ (b[stub.name]);
				complete_states[stub.name] = target.contents === stub.contents;

				const type = /** @type {string} */ (stub.basename.split('.').pop());

				const model = monaco.editor.createModel(
					stub.contents,
					types[type] || type,
					new monaco.Uri().with({ path: stub.name })
				);

				model.updateOptions({ tabSize: 2 });

				model.onDidChangeContent(() => {
					const contents = model.getValue();
					adapter.update([{ ...stub, contents }]);

					complete_states[stub.name] = contents === target.contents;
					completed = Object.values(complete_states).every((value) => value);
				});

				models.set(stub, model);
			}
		});

		select(
			/** @type {import('$lib/types').FileStub} */ (
				stubs.find((stub) => stub.name === section.chapter.focus)
			)
		);

		completed = false;

		if (adapter) {
			await adapter.update(stubs);
		}
	});

	/** @type {NodeJS.Timeout} */
	let timeout;

	/** @param {MessageEvent} e */
	function handle_message(e) {
		if (!adapter) return;
		if (e.origin !== adapter.base) return;
		if (e.data.type !== 'ping') return;

		path = e.data.data.path;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			// we lost contact, refresh the page
			iframe.src = iframe.src;
		}, 500);
	}
</script>

<svelte:window on:message={handle_message} />

<div class="container">
	<SplitPane type="horizontal" min="360px" max="50%" pos="360px">
		<section class="content" slot="a">
			<TableOfContents {index} {section} />

			<div class="text">{@html section.html}</div>

			{#if Object.keys(section.b).length > 0}
				<div class="controls" />
			{/if}
		</section>

		<section slot="b">
			<SplitPane type="vertical" min="100px" max="-100px" pos="50%">
				<section slot="a">
					<SplitPane type="horizontal" min="20px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<button
								class:completed
								disabled={Object.keys(section.b).length === 0}
								on:click={(e) => {
									completed = !completed;

									const target = completed ? b : section.a;

									const changes = [];

									for (const name in target) {
										const model = models.get(
											/** @type {import('$lib/types').FileStub} */ (section.a[name])
										);

										// if model exists, it's a file
										if (model) {
											const value = model.getValue();
											const stub = /** @type {import('$lib/types').FileStub} */ (target[name]);

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

												changes.push(stub);
											}
										}
									}

									adapter.update(changes);
								}}
							>
								{completed ? 'reset' : 'solve'}
							</button>

							<div class="filetree">
								<Folder {...section.chapter.scope} files={Object.values(section.a)} expanded />
							</div>
						</section>

						<section slot="b">
							<Editor model={current_model} />
						</section>
					</SplitPane>
				</section>

				<section class="preview" slot="b">
					<div class="chrome">
						<input
							value={path}
							readonly
							on:change={(e) => {
								// TODO enable URL bar to control iframe
								const url = new URL(e.target.value, adapter.base);
								path = url.pathname + url.search + url.hash;
							}}
						/>
					</div>

					<iframe bind:this={iframe} title="Output" {src} />
				</section>
			</SplitPane>
		</section>
	</SplitPane>
</div>

<style>
	.container {
		height: 100%;
		max-height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--second);
		color: white;
	}

	.text {
		flex: 1 1;
		overflow-y: auto;
		padding: 3rem 4rem;
		color: var(--sidebar-text);
	}

	.text :global(a) {
		color: inherit;
		text-decoration: underline;
	}

	.text :global(h2) {
		color: white;
		font-size: 2.8rem;
		font-weight: normal;
		margin: 1.5em 0 0.5em 0;
	}

	.text :global(code) {
		color: var(--sidebar-text);
		background: rgba(0, 0, 0, 0.12);
		padding: 0.2em 0.4em 0.3em;
		white-space: nowrap;
		position: relative;
		top: -0.1em;
	}

	.text :global(pre) {
		background: white;
		padding: 1rem;
		margin: 0 0 1em 0;
		line-height: 1.3;
		border-radius: 0.5rem;
	}

	.text :global(pre) :global(code) {
		background: none;
		color: var(--code-base);
		padding: 0;
		top: 0;
		white-space: pre;
	}

	.text :global(pre) :global(code)::before,
	.text :global(pre) :global(code)::after {
		content: none;
	}

	.text :global(blockquote) {
		background: rgba(255, 255, 255, 0.1);
		border-left: 2px solid white;
		color: white;
	}

	.text :global(ul) {
		list-style-position: inside;
	}

	.controls {
		padding: 1rem 3rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.navigator {
		background: #f9f9f9;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 1rem;
	}

	.navigator button {
		background: #ddd;
		padding: 0.5rem;
		border-radius: 0.5rem;
		width: 100%;
	}

	.navigator button:not(:disabled) {
		background: var(--prime);
		color: white;
	}

	.navigator button.completed {
		background: var(--second);
	}

	.filetree {
		flex: 1;
		overflow-y: auto;
	}

	.preview {
		display: flex;
		flex-direction: column;
	}

	.chrome {
		width: 100%;
		height: 4rem;
		display: flex;
		padding: 0.4rem;
		background: #f9f9f9;
	}

	.chrome input {
		flex: 1;
		padding: 0.5rem 1rem 0.4rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
		font-family: inherit;
		font-size: 1.6rem;
	}

	/* TODO change this once the input is interactive */
	.chrome input:focus {
		outline: none;
	}

	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
	}
</style>
