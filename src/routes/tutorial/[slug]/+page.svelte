<script>
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Editor from './Editor.svelte';
	import ContextMenu from '$lib/components/filetree/ContextMenu.svelte';
	import { browser, dev } from '$app/environment';
	import ImageViewer from './ImageViewer.svelte';
	import Sidebar from './Sidebar.svelte';
	import Chrome from './Chrome.svelte';
	import Icon from '@sveltejs/site-kit/components/Icon.svelte';
	import Loading from './Loading.svelte';
	import { PUBLIC_USE_FILESYSTEM } from '$env/static/public';
	import ScreenToggle from './ScreenToggle.svelte';
	import Filetree from '$lib/components/filetree/Filetree.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub[]>} */
	const files = writable([]);

	/** @type {import('svelte/store').Writable<Record<string, import('$lib/types').Stub>>} */
	const endstate = writable({});

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null>} */
	const selected = writable(null);

	/** @type {import('svelte/store').Writable<import('$lib/types').Scope>} */
	const scope = writable({ depth: 0, name: '', prefix: '' });

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

	let width = browser ? window.innerWidth : 1000;
	let selected_view = 0;

	$: mobile = writable(false);
	$: $mobile = width < 768;

	/** @type {import('svelte/store').Writable<import('$lib/types').EditingConstraints>} */
	const editing_constraints = writable({ create: [], remove: [] });

	$: {
		$endstate = { ...data.exercise.a };

		$editing_constraints.create = data.exercise.editing_constraints.create;
		$editing_constraints.remove = data.exercise.editing_constraints.remove;

		// TODO should this be an array in the first place?
		for (const stub of Object.values(data.exercise.b)) {
			if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
				// remove file
				if (!$editing_constraints.remove.includes(stub.name)) {
					$editing_constraints.remove.push(stub.name);
				}
				delete $endstate[stub.name];
			} else if (stub.name.endsWith('/__delete')) {
				// remove directory
				const parent = stub.name.slice(0, stub.name.lastIndexOf('/'));
				if (!$editing_constraints.remove.includes(parent)) {
					$editing_constraints.remove.push(parent);
				}
				delete $endstate[parent];
				for (const k in $endstate) {
					if (k.startsWith(parent + '/')) {
						delete $endstate[k];
					}
				}
			} else {
				if (!$endstate[stub.name] && !$editing_constraints.create.includes(stub.name)) {
					$editing_constraints.create.push(stub.name);
				}
				$endstate[stub.name] = data.exercise.b[stub.name];
			}
		}
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
			$files = Object.values(data.exercise.a);
			$scope = data.exercise.scope;
			selected.set(
				/** @type {import('$lib/types').FileStub} */ (
					$files.find((stub) => stub.name === data.exercise.focus)
				)
			);

			clearTimeout(timeout);
			loading = true;

			reset_complete_states();

			await load_files($files);

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
		const index = $files.findIndex((s) => s.name === stub.name);
		$files[index] = stub;
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

	/** Set `complete_states` and `expected` based on the end state */
	function reset_complete_states() {
		expected = {};
		complete_states = {};
		for (const stub of Object.values($endstate)) {
			if (stub.type === 'file') {
				complete_states[stub.name] = false;
				expected[stub.name] = normalise(stub.contents);
			}
		}
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
</script>

<svelte:window on:message={handle_message} bind:innerWidth={width} />

<svelte:head>
	<title>{data.exercise.chapter.title} / {data.exercise.title} • Svelte Tutorial</title>

	<meta name="twitter:title" content="{data.exercise.title} • Svelte Tutorial" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@sveltejs" />
	<meta name="twitter:creator" content="@sveltejs" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta property="twitter:domain" content="learn.svelte.dev" />
	<meta property="twitter:url" content="https://learn.svelte.dev" />

	<meta property="og:title" content="{data.exercise.title} • Svelte Tutorial" />
	<meta property="og:url" content="https://learn.svelte.dev" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<ContextMenu />

<div class="container" style="--toggle-height: {$mobile ? '4.6rem' : '0px'}">
	<SplitPane
		type="horizontal"
		min={$mobile ? '0px' : '360px'}
		max={$mobile ? '100%' : '50%'}
		pos={$mobile ? (selected_view === 0 ? '100%' : '0%') : '33%'}
	>
		<section slot="a" class="content">
			<Sidebar
				index={data.index}
				exercise={data.exercise}
				on:select={(e) => {
					selected.set(
						/** @type {import('$lib/types').FileStub} */ (data.exercise.a[e.detail.file])
					);
				}}
			/>
		</section>

		<section slot="b" class:hidden={$mobile && selected_view === 0}>
			<SplitPane
				type="vertical"
				min={$mobile ? '0px' : '100px'}
				max={$mobile ? '100%' : '50%'}
				pos={$mobile ? (selected_view === 1 ? '100%' : '0%') : '50%'}
			>
				<section slot="a">
					<SplitPane type="horizontal" min="80px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<Filetree
								{scope}
								{endstate}
								{files}
								readonly={mobile}
								constraints={editing_constraints}
								{selected}
								on:change={async () => {
									await load_files($files); // TODO make this automatic?
								}}
							/>

							<button
								class:completed
								disabled={Object.keys(data.exercise.b).length === 0}
								on:click={() => {
									$files = Object.values(completed ? data.exercise.a : $endstate);
									if (completed) {
										reset_complete_states();
									}
									load_files($files);
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
								stubs={$files}
								selected={$selected}
								read_only={$mobile}
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
						{#if browser}
							<iframe bind:this={iframe} title="Output" />
						{/if}

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
	{#if $mobile}
		<ScreenToggle labels={['Tutorial', 'Input', 'Output']} bind:selected={selected_view} />
	{/if}
</div>

<style>
	.container {
		height: calc(100% - var(--toggle-height));
		max-height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--sk-back-2);
		--menu-width: 5.4rem;
	}

	.navigator {
		position: relative;
		background: var(--sk-back-2);
		display: flex;
		flex-direction: column;
	}

	.navigator button {
		position: relative;
		background: var(--sk-theme-2);
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--sk-back-4);
		color: white;
		opacity: 1;
	}

	.navigator button:disabled {
		opacity: 0.5;
	}

	.navigator button:not(:disabled) {
		background: var(--sk-theme-1);
	}

	.navigator button.completed {
		background: var(--sk-theme-2);
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
		background: var(--sk-back-2);
	}

	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}

	.hidden {
		display: none;
	}
</style>
