<script>
	import { afterNavigate } from '$app/navigation';
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Editor from './Editor.svelte';
	import Folder from './Folder.svelte';
	import { browser, dev } from '$app/environment';
	import ImageViewer from './ImageViewer.svelte';
	import Sidebar from './Sidebar.svelte';
	import Chrome from './Chrome.svelte';
	import { Icon } from '@sveltejs/site-kit';
	import Loading from './Loading.svelte';
	import { PUBLIC_USE_FILESYSTEM } from '$env/static/public';
	import ContextMenu from './ContextMenu.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null>} */
	const selected = writable(
		/** @type {import('$lib/types').FileStub} */ (data.section.a[data.section.focus])
	);

	/** @type {Map<string, string>} */
	let expected;

	/**
	 * Only available in the browser
	 * @type {Promise<typeof import('$lib/client/monaco/monaco.js')>}
	 * */
	const monaco_import = browser ? import('$lib/client/monaco/monaco.js') : new Promise(() => {});

	/** @type {import('monaco-editor').editor.ITextModel} */
	let current_model;
	/** @type {import('$lib/types').Stub[]}*/
	let current_stubs = [];

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

	/** @type {import('$lib/types').FileTreeContext} */
	const { select } = setContext('filetree', {
		select: async (file) => {
			$selected = file;
			const { get_model } = await monaco_import;
			current_model = /** @type {import("monaco-editor").editor.ITextModel} */ (
				get_model(file.name)
			);
		},

		add: async (stubs) => {
			current_stubs = [...current_stubs, ...stubs];

			const { update_files } = await monaco_import;
			update_files(current_stubs, () => adapter);

			await load_files(current_stubs);

			if (stubs[0].type === 'file') {
				select(stubs[0]);
			}
		},

		edit: async (to_rename, new_name) => {
			/** @type {Array<[import('$lib/types').Stub, import('$lib/types').Stub]>}*/
			const changed = [];
			current_stubs = current_stubs.map((s) => {
				if (!s.name.startsWith(to_rename.name)) {
					return s;
				}

				const name =
					s.name.slice(0, to_rename.name.length - to_rename.basename.length) +
					new_name +
					s.name.slice(to_rename.name.length);
				const basename = s === to_rename ? new_name : s.basename;
				const new_stub = { ...s, name, basename };

				changed.push([s, new_stub]);
				return new_stub;
			});

			const { update_files } = await monaco_import;
			update_files(current_stubs, () => adapter);

			await load_files(current_stubs);

			if (to_rename.type === 'file') {
				select(/** @type {any} */ (changed.find(([old_s]) => old_s === to_rename))[1]);
			}
		},

		remove: async (stub) => {
			const out = current_stubs.filter((s) => s.name.startsWith(stub.name));
			current_stubs = current_stubs.filter((s) => !out.includes(s));

			const { update_files } = await monaco_import;
			update_files(current_stubs, () => adapter);

			if ($selected && out.includes($selected)) {
				$selected = null;
			}

			await load_files(current_stubs);
		},

		selected
	});

	/** @type {import('$lib/types').Adapter | undefined} */
	let adapter;

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
		complete_states = {};
		current_stubs = Object.values(data.section.a);

		const { update_files } = await monaco_import;
		update_files(current_stubs, () => adapter);

		select(
			/** @type {import('$lib/types').FileStub} */ (
				current_stubs.find((stub) => stub.name === data.section.focus)
			)
		);

		completed = false;

		load_exercise();
	});

	/**
	 * Loads the adapter initially or resets it. This method can throw.
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	async function reset_adapter(stubs) {
		if (adapter) {
			await adapter.reset(stubs);
			return adapter;
		} else {
			const module = PUBLIC_USE_FILESYSTEM
				? await import('$lib/client/adapters/filesystem/index.js')
				: await import('$lib/client/adapters/webcontainer/index.js');

			adapter = await module.create(stubs);
		}

		set_iframe_src(adapter.base);

		await new Promise((fulfil, reject) => {
			let called = false;

			window.addEventListener('message', function handler(e) {
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
					reject(new Error('Timed out (re)setting adapter'));
				}
			}, 10000);
		});

		return adapter;
	}

	async function load_exercise() {
		try {
			clearTimeout(timeout);
			loading = true;

			// Load expected output first so we can compare it to the actual output to determine when it's completed
			await reset_adapter(Object.values(b));
			expected = await get_transformed_modules(data.section.scope.prefix, Object.values(b));

			const stubs = Object.values(data.section.a);
			await load_files(stubs);

			loading = false;
			initial = false;
		} catch (e) {
			loading = false;
			error = /** @type {Error} */ (e);
			console.error(e);
		}
	}

	/**
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	async function load_files(stubs) {
		adapter = await reset_adapter(stubs);
		const actual = await get_transformed_modules(data.section.scope.prefix, stubs);

		for (const [name, transformed] of expected.entries()) {
			complete_states[name] = transformed === actual.get(name);
		}

		set_iframe_src(adapter.base);
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

<ContextMenu />

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
									files={current_stubs.filter((stub) => !hidden.has(stub.basename))}
									expanded
								/>
							</div>

							<button
								class:completed
								disabled={Object.keys(data.section.b).length === 0}
								on:click={async () => {
									completing = true;

									completed = !completed;
									current_stubs = Object.values(completed ? b : data.section.a);
									const { update_files } = await monaco_import;
									update_files(current_stubs, () => adapter, false);
									adapter?.reset(current_stubs);

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
									load_exercise();
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
