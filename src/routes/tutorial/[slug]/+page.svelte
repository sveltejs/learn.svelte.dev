<script>
	import { afterNavigate } from '$app/navigation';
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Editor from './Editor.svelte';
	import Folder from './Folder.svelte';
	import { dev } from '$app/environment';
	import ImageViewer from './ImageViewer.svelte';
	import Sidebar from './Sidebar.svelte';
	import Chrome from './Chrome.svelte';
	import { Icon } from '@sveltejs/site-kit';
	import Loading from './Loading.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null>} */
	const selected = writable(
		/** @type {import('$lib/types').FileStub} */ (data.section.a[data.section.focus])
	);

	/** @type {Map<string, string>} */
	let expected;

	/** @type {Map<import('$lib/types').FileStub, import('monaco-editor').editor.ITextModel>} */
	const models = new Map();

	/** @type {import('monaco-editor').editor.ITextModel} */
	let current_model;

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;

	/** @type {Error | null} */
	let error = null;

	/** @type {Record<string, boolean>}*/
	let complete_states = {};
	let completed = false;
	let completing = false;
	let path = '/';

	$: b = { ...data.section.a, ...data.section.b };

	const { select } = setContext('filetree', {
		/** @param {import('$lib/types').FileStub} file */
		select: (file) => {
			$selected = file;
			current_model = /** @type {import('monaco-editor').editor.ITextModel} */ (models.get(file));
		},

		selected
	});

	/** @type {import('$lib/types').Adapter | undefined} */
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

		const stubs = Object.values(data.section.a);

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
						adapter?.update([{ ...stub, contents }]);
					}
				});

				models.set(stub, model);
			}
		});

		select(
			/** @type {import('$lib/types').FileStub} */ (
				stubs.find((stub) => stub.name === data.section.focus)
			)
		);

		completed = false;

		load_adapter();
	});

	async function load_adapter() {
		clearTimeout(timeout);
		loading = true;

		if (adapter) {
			await adapter.reset(Object.values(b));
		} else {
			const module = import.meta.env.VITE_USE_FILESYSTEM
				? await import('$lib/client/adapters/filesystem/index.js')
				: await import('$lib/client/adapters/webcontainer/index.js');

			try {
				adapter = await module.create(Object.values(b));
			} catch (e) {
				error = /** @type {Error} */ (e);
				return;
			}
		}

		set_iframe_src(adapter.base);

		try {
			await new Promise((fulfil, reject) => {
				let called = false;

				window.addEventListener('message', function handler(e) {
					console.log(
						'incoming message',
						e.origin !== adapter?.base,
						e.origin,
						adapter?.base,
						e.data
					);
					if (e.origin !== adapter?.base) return;
					if (e.data.type === 'ping') {
						window.removeEventListener('message', handler);
						called = true;
						fulfil(undefined);
					}
				});

				setTimeout(() => {
					if (!called && adapter) {
						// Updating the iframe too soon sometimes results in a blank screen,
						// so we try again after a short delay if we haven't heard back
						set_iframe_src(adapter.base);
					}
				}, 5000);

				setTimeout(() => {
					if (!called) {
						reject(new Error('Timed out (re)starting adapter'));
					}
				}, 10000);
			});

			expected = await get_transformed_modules(data.section.scope.prefix, Object.values(b));

			const stubs = Object.values(data.section.a);
			await adapter.reset(stubs);
			const actual = await get_transformed_modules(data.section.scope.prefix, stubs);

			for (const [name, transformed] of expected.entries()) {
				complete_states[name] = transformed === actual.get(name);
			}

			set_iframe_src(adapter.base);

			loading = false;
			initial = false;
		} catch (e) {
			error = /** @type {Error} */ (e);
			console.error(e);
		}
	}

	/** @type {NodeJS.Timeout} */
	let timeout;

	/** @param {MessageEvent} e */
	async function handle_message(e) {
		if (!adapter) return;
		if (e.origin !== adapter.base) return;

		if (e.data.type === 'ping') {
			path = e.data.data.path;

			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if ((dev && !iframe) || !adapter) return;

				// we lost contact, refresh the page
				loading = true;
				set_iframe_src(adapter.base + path);
				loading = false;
			}, 500);
		} else if (e.data.type === 'hmr') {
			const transformed = await fetch_from_vite(e.data.data.map(({ path }) => path));

			for (const { name, code } of transformed) {
				const normalised = normalise(code);
				complete_states[name] = normalised === expected.get(name);
				if (dev) compare(name, normalised, expected.get(name));
			}

			completed = Object.values(complete_states).every((value) => value);
		}
	}

	/**
	 * @param {string[]} names
	 * @return {Promise<Array<{ name: string, code: string }>>}
	 */
	async function fetch_from_vite(names) {
		/** @type {Window} */ (iframe.contentWindow).postMessage({ type: 'fetch', names }, '*');

		return new Promise((fulfil, reject) => {
			window.addEventListener('message', function handler(e) {
				if (e.data.type === 'fetch-result') {
					fulfil(e.data.data);
					window.removeEventListener('message', handler);
				}
			});

			setTimeout(() => {
				reject(new Error('Timed out fetching files from Vite'));
			}, 5000);
		});
	}

	/**
	 * @param {string} name
	 * @param {string} actual
	 * @param {string} expected
	 */
	async function compare(name, actual, expected) {
		if (actual === expected) return;

		const Diff = await import('diff');
		console.groupCollapsed(`diff: ${name}`);
		console.log(actual);
		console.log(Diff.diffLines(actual, expected));
		console.groupEnd();
	}

	/**
	 * @param {string} prefix
	 * @param {import('$lib/types').Stub[]} stubs
	 * @returns {Promise<Map<string, string>>}
	 */
	async function get_transformed_modules(prefix, stubs) {
		const names = stubs
			.filter((stub) => {
				if (stub.name === '/src/__client.js') return;
				if (stub.type !== 'file') return;
				if (!/\.(js|ts|svelte)$/.test(stub.name)) return;

				return stub.name.startsWith(prefix);
			})
			.map((stub) => stub.name);

		const transformed = await fetch_from_vite(names);

		const map = new Map();
		transformed.forEach(({ name, code }) => {
			map.set(name, normalise(code));
		});

		return map;
	}

	/** @param {string} code */
	function normalise(code) {
		return code
			.replace(/add_location\([^)]+\)/g, 'add_location(...)')
			.replace(/\?[tv]=[a-zA-Z0-9]+/g, '')
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
	}

	const hidden = new Set(['__client.js', 'node_modules']);
</script>

<svelte:window on:message={handle_message} />

<svelte:head>
	<title>{data.section.chapter.title} / {data.section.title} • Svelte Tutorial</title>
</svelte:head>

<div class="container">
	<SplitPane type="horizontal" min="360px" max="50%" pos="33%">
		<section class="content" slot="a">
			<Sidebar
				index={data.index}
				section={data.section}
				on:select={(e) => {
					select(/** @type {import('$lib/types').FileStub} */ (data.section.a[e.detail.file]));
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
									{...data.section.scope}
									files={Object.values(data.section.a).filter((stub) => !hidden.has(stub.basename))}
									expanded
								/>
							</div>

							<button
								class:completed
								disabled={Object.keys(data.section.b).length === 0}
								on:click={(e) => {
									completing = true;

									completed = !completed;

									const target = completed ? b : data.section.a;

									const changes = [];

									for (const name in target) {
										const model = models.get(
											/** @type {import('$lib/types').FileStub} */ (data.section.a[name])
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

									adapter?.update(changes);
									completing = false;
								}}
							>
								{#if completed && Object.keys(data.section.b).length > 0}
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
							if (adapter) {
								set_iframe_src(adapter.base + path);
							}
						}}
						on:change={(e) => {
							if (adapter) {
								const url = new URL(e.detail.value, adapter.base);
								path = url.pathname + url.search + url.hash;
								set_iframe_src(adapter.base + path);
							}
						}}
					/>

					<div class="content">
						<iframe bind:this={iframe} title="Output" />

						{#if loading || error}
							<Loading
								{initial}
								{error}
								on:reload={async () => {
									error = null;
									load_adapter();
								}}
							/>
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
		position: relative;
		background-color: var(--light-blue);
	}
</style>
