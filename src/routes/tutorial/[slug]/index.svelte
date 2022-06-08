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
	import { Icon } from '@sveltejs/site-kit';
	import Menu from './_/Menu/Menu.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { dev } from '$app/env';

	/** @type {import('$lib/types').PartStub[]} */
	export let index;

	/** @type {import('$lib/types').Section} */
	export let section;

	const namespace = 'learn.svelte.dev';
	const copy_enabled = `${namespace}:copy_enabled`;
	let show_modal = false;

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub | null>} */
	const selected = writable(section.a[section.focus]);

	/** @type {Map<string, string>} */
	const expected = new Map();

	/** @type {Map<import('$lib/types').FileStub, import('monaco-editor').editor.ITextModel>} */
	const models = new Map();

	/** @type {HTMLElement} */
	let sidebar;

	/** @type {import('svelte').SvelteComponent} */
	let menu;

	/** @type {import('monaco-editor').editor.ITextModel} */
	let current_model;

	/** @type {HTMLIFrameElement} */
	let iframe;

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
		// TODO ideally we would associate scroll state with
		// history. That's a little tricky to do right now,
		// so for now just always reset sidebar scroll
		sidebar.scrollTop = 0;

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
		set_iframe_src('/loading.html');

		if (adapter) {
			expected.clear();

			await adapter.reset(Object.values(b));
			await get_transformed_modules(adapter.base, section.scope.prefix, Object.values(b), expected);
		} else {
			const module = await import('$lib/client/adapters/filesystem/index.js');

			adapter = await module.create(Object.values(b));
			await get_transformed_modules(adapter.base, section.scope.prefix, Object.values(b), expected);
		}

		const actual = new Map();

		await adapter.update(stubs);
		await get_transformed_modules(adapter.base, section.scope.prefix, stubs, actual);

		for (const [name, transformed] of expected.entries()) {
			complete_states[name] = transformed === actual.get(name);
		}

		set_iframe_src(adapter.base);
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
				set_iframe_src('/loading.html');
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
		for (const stub of stubs) {
			if (stub.name === '/src/__client.js') continue;
			if (stub.type !== 'file') continue;
			if (!/\.(js|ts|svelte)$/.test(stub.name)) continue;

			if (stub.name.startsWith(prefix)) {
				const res = await fetch(base + stub.name);
				const transformed = normalise(await res.text());
				map.set(stub.name, transformed);

				if (stub.name.endsWith('.svelte') && transformed.includes('svelte&type=style&lang.css')) {
					const name = stub.name + '?svelte&type=style&lang.css';
					const res = await fetch(base + name);
					map.set(name, normalise(await res.text()));
				}
			}
		}
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
			<Menu bind:this={menu} {index} current={section} />

			<header on:click={() => menu.open()}>
				<h1>
					Part {section.part.index + 1} > {section.chapter.title} >
					<strong>{section.title}</strong>
				</h1>
			</header>

			<div
				bind:this={sidebar}
				class="text"
				on:copy={(e) => {
					if (sessionStorage[copy_enabled]) return;

					/** @type {HTMLElement | null} */
					let node = /** @type {HTMLElement} */ (e.target);

					while (node && node !== e.currentTarget) {
						if (node.nodeName === 'PRE') {
							show_modal = true;

							e.preventDefault();
							return;
						}

						node = /** @type {HTMLElement | null} */ (node.parentNode);
					}
				}}
			>
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
					<SplitPane type="horizontal" min="80px" max="300px" pos="200px">
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
								{completed && Object.keys(section.b).length > 0 ? 'reset' : 'solve'}
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
								set_iframe_src('/loading.html');
								set_iframe_src(adapter.base + path);
							}}
							aria-label="reload"
						>
							<img src={refresh} alt="Reload icon" />
						</button>

						<input
							aria-label="URL"
							value={path}
							on:change={(e) => {
								const url = new URL(e.currentTarget.value, adapter.base);
								path = url.pathname + url.search + url.hash;
								set_iframe_src(adapter.base + path);
							}}
						/>
					</div>

					<iframe bind:this={iframe} title="Output" src="/loading.html" />
				</section>
			</SplitPane>
		</section>
	</SplitPane>
</div>

{#if show_modal}
	<Modal on:close={() => (show_modal = false)}>
		<div class="modal-contents">
			<h2>Copy and paste is currently disabled!</h2>

			<p>
				We recommend typing the code into the editor to complete the exercise, as this results in
				better retention and understanding.
			</p>
			<label>
				<input
					type="checkbox"
					on:change={(e) => {
						sessionStorage[copy_enabled] = e.currentTarget.checked ? 'true' : '';
					}}
				/>
				enable copy-and-paste for the duration of this session
			</label>

			<button on:click={() => (show_modal = false)}>OK</button>
		</div>
	</Modal>
{/if}

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
	header h1 {
		font-size: 1.4rem;
	}

	header strong {
		color: hsl(240, 8%, 94%);
	}

	header h1 {
		color: hsl(240, 8%, 84%);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-weight: 400;
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

	.text :global(ul) {
		padding: 0 0 0 2rem;
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
		margin: 0 0 1.6rem 0;
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

	.text :global(pre) :global(.highlight) {
		--color: rgba(220, 220, 0, 0.2);
		background: var(--color);
		outline: 2px solid var(--color);
		border-radius: 2px;
	}

	.text :global(pre) :global(.highlight.add) {
		--color: rgba(0, 255, 0, 0.2);
	}

	.text :global(pre) :global(.highlight.remove) {
		--color: rgba(255, 0, 0, 0.2);
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

	.modal-contents h2 {
		font-size: 2.4rem;
		margin: 0 0 0.5em 0;
	}

	.modal-contents label {
		user-select: none;
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
