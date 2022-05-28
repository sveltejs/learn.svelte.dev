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
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Editor from './_/Editor.svelte';
	import Folder from './_/Folder.svelte';
	import refresh from './_/refresh.svg';
	import { monaco } from '$lib/client/monaco/monaco.js';
	import { Icon } from '@sveltejs/site-kit';
	import Menu from './_/Menu/Menu.svelte';

	/** @type {import('$lib/types').PartStub[]} */
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
	let completing = false;
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

					if (!completing) {
						adapter.update([{ ...stub, contents }]);
					}

					complete_states[stub.name] = contents === target.contents;
					completed = Object.values(complete_states).every((value) => value);
				});

				models.set(stub, model);
			}
		});

		select(
			/** @type {import('$lib/types').FileStub} */ (
				stubs.find((stub) => stub.name === section.focus)
			)
		);

		completed = false;

		if (adapter) {
			await adapter.reset(stubs);
			if (path !== '/') iframe.src = adapter.base;
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
			iframe.src = '/loading.html';
			iframe.src = adapter.base + path;
		}, 500);
	}

	const hidden = new Set(['__client.js', 'node_modules']);
</script>

<svelte:window on:message={handle_message} />

<div class="container">
	<SplitPane type="horizontal" min="360px" max="50%" pos="480px">
		<section class="content" slot="a">
			<Menu {index} current={section} />

			<header>
				<span>
					Part {section.part.index + 1} > {section.chapter.title} >
					<strong>{section.title}</strong>
				</span>
			</header>

			<div class="text">
				{@html section.html}

				{#if section.next}
					<p><a href="/tutorial/{section.next.slug}">Next: {section.next.title}</a></p>
				{/if}
			</div>

			<footer>
				<a class="edit" href="https://github.com/sveltejs/learn.svelte.dev/tree/main/{section.dir}">
					<Icon size={16} name="edit" /> Edit this page
				</a>
			</footer>
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
									completing = true;

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
									completing = false;
								}}
							>
								{completed ? 'reset' : 'solve'}
							</button>

							<div class="filetree">
								<Folder
									{...section.scope}
									files={Object.values(section.a).filter((stub) => !hidden.has(stub.basename))}
									expanded
								/>
							</div>
						</section>

						<section slot="b">
							<Editor model={current_model} />
						</section>
					</SplitPane>
				</section>

				<section class="preview" slot="b">
					<div class="chrome">
						<button
							on:click={() => {
								iframe.src = '/loading.html';
								iframe.src = adapter.base + path;
							}}
							aria-label="reload"
						>
							<img src={refresh} alt="Reload icon" />
						</button>

						<input
							value={path}
							on:change={(e) => {
								const url = new URL(e.currentTarget.value, adapter.base);
								path = url.pathname + url.search + url.hash;
								iframe.src = adapter.base + path;
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
		--menu-width: 5.4rem;
	}

	header {
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0 0 0 calc(var(--menu-width) + 2.2rem);
		height: var(--menu-width);
		align-items: center;
	}

	header strong,
	header span {
		font-size: 1.4rem;
	}

	header strong {
		color: hsl(240, 8%, 94%);
	}

	header span {
		color: hsl(240, 8%, 84%);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.text {
		flex: 1 1;
		overflow-y: auto;
		padding: 2.2rem 2.2rem 2.2rem calc(var(--menu-width) + 2.2rem);
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
		padding: 1rem 1.5rem;
		margin: 0 0 1em 0;
		line-height: 1.3;
		border-radius: 0.5rem;
		filter: drop-shadow(2px 4px 12px hsl(240, 8%, 40%));
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
		background: var(--second);
		margin: 2rem 0;
		padding: 2rem;
		color: white;
		border-radius: 0.5rem;
		border: 1.5px solid var(--flash);
		filter: drop-shadow(2px 4px 12px hsl(240, 8%, 36%));
	}

	.text :global(blockquote)::before {
		content: '!';
		position: relative;
		top: -0.1rem;
		right: -0.1rem;
		float: right;
		color: var(--flash);
		width: 2rem;
		height: 2rem;
		display: block;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--flash);
		background: var(--flash);
		color: var(--second);
		border-radius: 50%;
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
		line-height: 1.9;
		margin: 0 0 1rem 1rem;
		opacity: 0.8;
	}

	.text :global(ul) {
		list-style-position: inside;
	}

	.content footer {
		padding: 1rem 2.2rem 1rem calc(var(--menu-width) + 2.2rem);
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.content footer a {
		color: var(--sidebar-text);
		font-size: 1.4rem;
		display: flex;
		gap: 0.5rem;
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
		gap: 0.5rem;
		padding: 0.4rem;
		background: #f9f9f9;
	}

	.chrome button {
		padding: 0.5rem;
	}

	.chrome button img {
		height: 100%;
		width: auto;
		transition: 0.2s ease-out;
		transform: none;
	}

	.chrome button:active img {
		transform: rotate(-180deg);
		transition: none;
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

	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
	}
</style>
