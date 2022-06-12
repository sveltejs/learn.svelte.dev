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
	import { dev } from '$app/env';
	import ImageViewer from './_/ImageViewer.svelte';
	import Sidebar from './_/Sidebar.svelte';
	import Chrome from './_/Chrome.svelte';
	import { Icon } from '@sveltejs/site-kit';
	import Loading from './_/Loading.svelte';

	/** @type {import('$lib/types').PartStub[]} */
	export let index;

	/** @type {import('$lib/types').Section} */
	export let section;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null>} */
	const selected = writable(
		/** @type {import('$lib/types').FileStub} */ (section.a[section.focus])
	);

	/** @type {Map<string, string>} */
	const expected = new Map();

	/** @type {Map<import('$lib/types').FileStub, import('monaco-editor').editor.ITextModel>} */
	const models = new Map();

	/** @type {import('monaco-editor').editor.ITextModel} */
	let current_model;

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;

	/** @type {Record<string, boolean>}*/
	let complete_states = {};
	let completed = false;
	let completing = false;
	let path = '/';

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
		function destroy() {
			if (adapter) {
				adapter.destroy();
			}
		}

		document.addEventListener('pagehide', destroy);
		return destroy;
	});

	afterNavigate(async () => {
		models.forEach((model) => {
			model.dispose();
		});
		models.clear();

		complete_states = {};

		const stubs = Object.values(section.a);

		const { monaco } = await import('$lib/client/monaco/monaco.js');

		stubs.forEach((stub) => {
			if (stub.type === 'file') {
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

		clearTimeout(timeout);
		loading = true;

		if (adapter) {
			expected.clear();

			await adapter.reset(Object.values(b));
			await get_transformed_modules(adapter.base, section.scope.prefix, Object.values(b), expected);
		} else {
			const module = await import('$lib/client/adapters/webcontainer/index.js');

			adapter = await module.create(Object.values(b));
			await get_transformed_modules(adapter.base, section.scope.prefix, Object.values(b), expected);
		}

		const actual = new Map();

		await adapter.reset(stubs);
		await get_transformed_modules(adapter.base, section.scope.prefix, stubs, actual);

		for (const [name, transformed] of expected.entries()) {
			complete_states[name] = transformed === actual.get(name);
		}

		set_iframe_src(adapter.base);
		initial = false;
	});

	/** @type {NodeJS.Timeout} */
	let timeout;

	/** @param {MessageEvent} e */
	function handle_message(e) {
		if (!adapter) return;
		if (e.origin !== adapter.base) return;

		if (e.data.type === 'ping') {
			path = e.data.data.path;

			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (dev && !iframe) return;

				// we lost contact, refresh the page
				loading = true;
				set_iframe_src(adapter.base + path);
			}, 500);
		} else if (e.data.type === 'hmr') {
			e.data.data.forEach((update) => handle_hmr_update(update.path));
		}
	}

	/** @param {string} name */
	async function handle_hmr_update(name) {
		if (Object.keys(section.b).length === 0) return;

		const res = await fetch(adapter.base + name);
		const transformed = normalise(await res.text());
		complete_states[name] = transformed === expected.get(name);

		if (dev) compare(name, transformed, expected.get(name));

		if (name.endsWith('.svelte') && transformed.includes('svelte&type=style&lang.css')) {
			name += '?svelte&type=style&lang.css';

			const res = await fetch(adapter.base + name);
			const transformed = normalise(await res.text());
			complete_states[name] = transformed === expected.get(name);

			if (dev) compare(name, transformed, expected.get(name));
		}

		completed = Object.values(complete_states).every((value) => value);
	}

	/**
	 * @param {string} name
	 * @param {string} actual
	 * @param {string} expected
	 */
	async function compare(name, actual, expected) {
		if (actual === expected) return;

		console.log(actual);

		const Diff = await import('diff');
		console.group(name);
		console.log(Diff.diffLines(actual, expected));
		console.groupEnd();
	}

	/**
	 * @param {string} base
	 * @param {string} prefix
	 * @param {import('$lib/types').Stub[]} stubs
	 * @param {Map<string, string>} map
	 */
	async function get_transformed_modules(base, prefix, stubs, map) {
		// TODO commented out because we run into CORS issues
		// for (const stub of stubs) {
		// 	if (stub.name === '/src/__client.js') continue;
		// 	if (stub.type !== 'file') continue;
		// 	if (!/\.(js|ts|svelte)$/.test(stub.name)) continue;
		// 	if (stub.name.startsWith(prefix)) {
		// 		const res = await fetch(base + stub.name);
		// 		const transformed = normalise(await res.text());
		// 		map.set(stub.name, transformed);
		// 		if (stub.name.endsWith('.svelte') && transformed.includes('svelte&type=style&lang.css')) {
		// 			const name = stub.name + '?svelte&type=style&lang.css';
		// 			const res = await fetch(base + name);
		// 			map.set(name, normalise(await res.text()));
		// 		}
		// 	}
		// }
	}

	/** @param {string} code */
	function normalise(code) {
		return code
			.replace(/add_location\([^)]+\)/g, 'add_location(...)')
			.replace(/\?t=\d+/g, '')
			.replace(/[&?]svelte&type=style&lang\.css/, '')
			.replace(/\/\/# sourceMappingURL=.+/, '');
	}

	/** @param {string} src */
	function set_iframe_src(src) {
		// removing the iframe from the document allows us to
		// change the src without adding a history entry, which
		// would make back/forward traversal very annoying
		const parentNode = /** @type {HTMLElement} */ (iframe.parentNode);
		parentNode?.removeChild(iframe);
		iframe.src = src;
		parentNode?.appendChild(iframe);

		loading = false;
	}

	const hidden = new Set(['__client.js', 'node_modules']);
</script>

<svelte:window on:message={handle_message} />

<svelte:head>
	<title>{section.chapter.title} / {section.title} • Svelte Tutorial</title>
</svelte:head>

<div class="container">
	<SplitPane type="horizontal" min="360px" max="50%" pos="33%">
		<section class="content" slot="a">
			<Sidebar
				{index}
				{section}
				on:select={(e) => {
					select(/** @type {import('$lib/types').FileStub} */ (section.a[e.detail.file]));
				}}
			/>
		</section>

		<section slot="b">
			<SplitPane type="vertical" min="100px" max="-100px" pos="50%">
				<section slot="a">
					<SplitPane type="horizontal" min="80px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<div class="filetree">
								<Folder
									{...section.scope}
									files={Object.values(section.a).filter((stub) => !hidden.has(stub.basename))}
									expanded
								/>
							</div>

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
								{#if completed && Object.keys(section.b).length > 0}
									reset
								{:else}
									solve <Icon name="arrow-right" />
								{/if}
							</button>
						</section>

						<section class="editor-container" slot="b">
							<Editor model={current_model} />
							<ImageViewer selected={$selected} />
						</section>
					</SplitPane>
				</section>

				<section class="preview" slot="b">
					<Chrome
						{path}
						{loading}
						on:refresh={() => {
							loading = true;
							set_iframe_src(adapter.base + path);
						}}
						on:change={(e) => {
							const url = new URL(e.detail.value, adapter.base);
							path = url.pathname + url.search + url.hash;
							set_iframe_src(adapter.base + path);
						}}
					/>

					<div class="content">
						<iframe bind:this={iframe} title="Output" />

						{#if loading}
							<Loading {initial} />
						{/if}
					</div>
				</section>
			</SplitPane>
		</section>
	</SplitPane>
</div>

<style>
	.container {
		--border-color: hsl(206, 44%, 90%);
		height: 100%;
		max-height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--light-blue);
		--menu-width: 5.4rem;
	}

	.navigator {
		position: relative;
		background: white;
		display: flex;
		flex-direction: column;
	}

	.navigator button {
		position: relative;
		background: #ddd;
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--border-color);
		opacity: 1;
	}

	.navigator button:disabled {
		background: #f9f9f9; /* TODO consistent grays */
		color: #ddd;
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
		overflow-x: hidden;
		padding: 2rem;
	}

	.filetree::before {
		content: '';
		position: absolute;
		width: 0;
		height: 100%;
		top: 0;
		right: 0;
		border-right: 1px solid var(--border-color);
	}

	.preview {
		display: flex;
		flex-direction: column;
	}

	.content {
		position: relative;
	}

	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
		background: white;
	}

	.editor-container {
		background-color: var(--light-blue);
	}
</style>
