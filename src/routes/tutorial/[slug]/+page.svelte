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
	import ScreenToggle from './ScreenToggle.svelte';
	import Modal from '$lib/components/Modal.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null>} */
	const selected = writable(
		/** @type {import('$lib/types').FileStub} */ (data.exercise.a[data.exercise.focus])
	);

	/** @type {import('$lib/types').Stub[]}*/
	let current_stubs = [];

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;

	/** @type {Error | null} */
	let error = null;

	/** @type {Record<string, string>} */
	let expected = {};
	/** @type {Record<string, boolean>}*/
	let complete_states = {};
	$: completed =
		Object.keys(complete_states).length > 0 && Object.values(complete_states).every(Boolean);

	let path = '/';
	let modal_text = '';

	let width = browser ? window.innerWidth : 1000;
	let selected_view = 0;
	$: mobile = width < 768;

	/** @type {Record<string, import('$lib/types').Stub>} */
	let b;
	/** @type {import('$lib/types').EditingConstraints} list of files user is allowed to create/delete in the tutorial chapter */
	let editing_constraints;
	$: {
		b = { ...data.exercise.a };
		editing_constraints = {
			create: [],
			remove: []
		};
		for (const key in data.exercise.b) {
			const stub = data.exercise.b[key];

			if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
				// remove file
				editing_constraints.remove.push(key);
				delete b[key];
			} else if (key.endsWith('/__delete')) {
				// remove directory
				const parent = key.slice(0, key.lastIndexOf('/'));
				editing_constraints.remove.push(parent);
				delete b[parent];
				for (const k in b) {
					if (k.startsWith(parent + '/')) {
						delete b[k];
					}
				}
			} else {
				if (!b[key]) {
					editing_constraints.create.push(key);
				}
				b[key] = data.exercise.b[key];
			}
		}
	}

	/** @type {import('$lib/types').FileTreeContext} */
	const { select } = setContext('filetree', {
		select: async (file) => {
			$selected = file;
		},

		add: async (name, type) => {
			const new_stubs = add_stub(name, type, current_stubs);

			const illegal_create = new_stubs.some(
				(s) => !editing_constraints.create.some((c) => s.name === c)
			);
			if (illegal_create) {
				modal_text =
					'Only the following files and folders are allowed to be created in this tutorial chapter:\n' +
					editing_constraints.create.join('\n');
				return;
			}

			current_stubs = [...current_stubs, ...new_stubs];
			await load_files(current_stubs);

			if (new_stubs[0].type === 'file') {
				select(new_stubs[0]);
			}
		},

		edit: async (to_rename, new_name) => {
			// treat edit as a remove followed by an add
			const out = current_stubs.filter((s) => s.name.startsWith(to_rename.name));
			const updated_stubs = current_stubs.filter((s) => !out.includes(s));
			/** @type {Map<string, import('$lib/types').Stub>} */
			const new_stubs = new Map();
			for (const s of out) {
				const name =
					s.name.slice(0, to_rename.name.length - to_rename.basename.length) +
					new_name +
					s.name.slice(to_rename.name.length);
				// deduplicate
				for (const to_add of add_stub(name, s.type, updated_stubs)) {
					if (s.type === 'file' && to_add.type === 'file') {
						to_add.contents = s.contents;
					}
					new_stubs.set(to_add.name, to_add);
				}
			}

			const illegal_rename =
				!editing_constraints.remove.some((r) => to_rename.name === r) ||
				[...new_stubs.keys()].some((name) => !editing_constraints.create.some((c) => name === c));
			if (illegal_rename) {
				modal_text =
					'Only the following files and folders are allowed to be renamed in this tutorial chapter:\n' +
					editing_constraints.remove.join('\n') +
					'\n\nThey can only be renamed to the following:\n' +
					editing_constraints.create.join('\n');
				return;
			}

			current_stubs = updated_stubs.concat(...new_stubs.values());
			await load_files(current_stubs);

			if (to_rename.type === 'file' && $selected?.name === to_rename.name) {
				select(/** @type {any} */ ([...new_stubs.values()].find((s) => s.type === 'file')));
			}
		},

		remove: async (stub) => {
			const illegal_delete = !editing_constraints.remove.some((r) => stub.name === r);
			if (illegal_delete) {
				modal_text =
					'Only the following files and folders are allowed to be deleted in this tutorial chapter:\n' +
					editing_constraints.remove.join('\n');
				return;
			}

			const out = current_stubs.filter((s) => s.name.startsWith(stub.name));
			current_stubs = current_stubs.filter((s) => !out.includes(s));

			if ($selected && out.includes($selected)) {
				$selected = null;
			}

			await load_files(current_stubs);
		},

		selected
	});

	/**
	 * @param {string} name
	 * @param {'file' | 'directory'} type
	 * @param {import('$lib/types').Stub[]} current
	 */
	function add_stub(name, type, current) {
		// find directory which contains the new file
		/** @type {import('$lib/types').DirectoryStub} */
		let dir = /** @type {any} we know it will be assigned after the loop */ (null);
		for (const stub of current) {
			if (
				stub.type === 'directory' &&
				name.startsWith(stub.name) &&
				(!dir || dir.name.length < stub.name.length)
			) {
				dir = stub;
			}
		}

		const new_name = name.slice(dir.name.length + 1);
		const prefix = dir.name + '/';
		const depth = prefix.split('/').length - 2;
		const parts = new_name.split('/');
		/** @type {import('$lib/types').Stub[]} */
		const stubs = [];

		for (let i = 1; i <= parts.length; i++) {
			const part = parts.slice(0, i).join('/');
			const basename = /** @type{string} */ (part.split('/').pop());
			const name = prefix + part;
			if (!current.some((s) => s.name === name)) {
				if (i < parts.length || type === 'directory') {
					stubs.push({ type: 'directory', name, depth: depth + i, basename });
				} else if (i === parts.length && type === 'file') {
					stubs.push({
						type: 'file',
						name,
						depth: depth + i,
						basename,
						text: true,
						contents: ''
					});
				}
			}
		}

		return stubs;
	}

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

	afterNavigate(load_exercise);

	/**
	 * Loads the adapter initially or resets it. This method can throw.
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	async function reset_adapter(stubs) {
		let reload_iframe = true;
		if (adapter) {
			reload_iframe = await adapter.reset(stubs);
		} else {
			const module = PUBLIC_USE_FILESYSTEM
				? await import('$lib/client/adapters/filesystem/index.js')
				: await import('$lib/client/adapters/webcontainer/index.js');

			adapter = await module.create(stubs);
			set_iframe_src(adapter.base);
		}

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

		if (reload_iframe) {
			await new Promise((fulfil) => setTimeout(fulfil, 200));
			set_iframe_src(adapter.base);
		}

		return adapter;
	}

	async function load_exercise() {
		try {
			current_stubs = Object.values(data.exercise.a);
			select(
				/** @type {import('$lib/types').FileStub} */ (
					current_stubs.find((stub) => stub.name === data.exercise.focus)
				)
			);

			clearTimeout(timeout);
			loading = true;

			expected = {};
			complete_states = {};
			for (const stub of Object.values(b)) {
				if (stub.type === 'file') {
					complete_states[stub.name] = false;
					expected[stub.name] = normalise(stub.contents);
				}
			}

			await load_files(current_stubs);

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
		update_complete_states(stubs);
	}

	/**
	 * @param {CustomEvent<import('$lib/types').FileStub>} event
	 */
	function update_stub(event) {
		const stub = event.detail;
		const index = current_stubs.findIndex((s) => s.name === stub.name);
		current_stubs[index] = stub;
		adapter?.update([stub]).then((reload) => {
			if (reload) {
				schedule_iframe_reload();
			}
		});
		update_complete_states([stub]);
	}

	/** @type {any} */
	let reload_timeout;
	function schedule_iframe_reload() {
		clearTimeout(reload_timeout);
		reload_timeout = setTimeout(() => {
			if (adapter) {
				set_iframe_src(adapter.base);
			}
		}, 1000);
	}

	/**
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	function update_complete_states(stubs) {
		for (const stub of stubs) {
			if (stub.type === 'file' && stub.name in complete_states) {
				complete_states[stub.name] = expected[stub.name] === normalise(stub.contents);
				if (dev) {
					compare(stub.name, normalise(stub.contents), expected[stub.name]);
				}
			}
		}
	}

	/** @type {any} */
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
		}
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

	/** @param {string} code */
	function normalise(code) {
		// TODO think about more sophisticated normalisation (e.g. truncate multiple newlines)
		return code.replace(/\s+/g, ' ').trim();
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

<svelte:window on:message={handle_message} bind:innerWidth={width} />

<svelte:head>
	<title>{data.exercise.chapter.title} / {data.exercise.title} • Svelte Tutorial</title>
</svelte:head>

<ContextMenu />

{#if modal_text}
	<Modal on:close={() => (modal_text = '')}>
		<div class="modal-contents">
			<h2>This action is not allowed</h2>

			<p>
				{modal_text}
			</p>

			<button on:click={() => (modal_text = '')}>OK</button>
		</div>
	</Modal>
{/if}

<div class="container" style="--toggle-height: {mobile ? '4.6rem' : '0px'}">
	<SplitPane
		type="horizontal"
		min={mobile ? '0px' : '360px'}
		max={mobile ? '100%' : '50%'}
		pos={mobile ? (selected_view === 0 ? '100%' : '0%') : '33%'}
	>
		<section slot="a" class="content">
			<Sidebar
				index={data.index}
				exercise={data.exercise}
				on:select={(e) => {
					select(/** @type {import('$lib/types').FileStub} */ (data.exercise.a[e.detail.file]));
				}}
			/>
		</section>

		<section slot="b" class:hidden={mobile && selected_view === 0}>
			<SplitPane
				type="vertical"
				min={mobile ? '0px' : '100px'}
				max={mobile ? '100%' : '50%'}
				pos={mobile ? (selected_view === 1 ? '100%' : '0%') : '50%'}
			>
				<section slot="a">
					<SplitPane type="horizontal" min="80px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<div class="filetree">
								<Folder
									{...data.exercise.scope}
									files={current_stubs.filter((stub) => !hidden.has(stub.basename))}
									expanded
									read_only={mobile}
									can_create={!!editing_constraints.create.length}
									can_remove={!!editing_constraints.remove.length}
								/>
							</div>

							<button
								class:completed
								disabled={Object.keys(data.exercise.b).length === 0}
								on:click={() => {
									current_stubs = Object.values(completed ? data.exercise.a : b);
									load_files(current_stubs);
								}}
							>
								{#if completed && Object.keys(data.exercise.b).length > 0}
									reset
								{:else}
									solve <Icon name="arrow-right" />
								{/if}
							</button>
						</section>

						<section class="editor-container" slot="b">
							<Editor
								stubs={current_stubs}
								selected={$selected}
								read_only={mobile}
								on:change={update_stub}
							/>
							<ImageViewer selected={$selected} />
						</section>
					</SplitPane>
				</section>

				<section slot="b" class="preview">
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
	{#if mobile}
		<ScreenToggle labels={['Tutorial', 'Input', 'Output']} bind:selected={selected_view} />
	{/if}
</div>

<style>
	.container {
		--border-color: hsl(206, 44%, 90%);
		height: calc(100% - var(--toggle-height));
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

	.navigator button:not(:disabled).completed {
		background: var(--second);
	}

	.filetree {
		--font-size: 1.4rem;
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

	.hidden {
		display: none;
	}

	.modal-contents p {
		white-space: pre-line;
	}

	.modal-contents button {
		display: block;
		background: var(--prime);
		color: white;
		padding: 1rem;
		width: 10em;
		margin: 1em 0 0 0;
		border-radius: var(--border-r);
		line-height: 1;
	}
</style>
