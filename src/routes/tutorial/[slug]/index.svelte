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

	let completed = false;

	$: b = { ...section.a, ...section.b };

	/** @type {import('svelte/store').Writable<import('$lib/types').Section>}*/
	const current = writable(section);

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub[]>} */
	const files = writable(Object.values(section.a));

	/** @type {import('svelte/store').Writable<import('monaco-editor').editor.ITextModel>} */
	const active = writable();

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub | null>} */
	const selected = writable(section.a[section.chapter.focus]);

	const started = writable(false);

	const base = writable('');

	/** @type {Map<import('$lib/types').FileStub, import('monaco-editor').editor.ITextModel>} */
	const models = new Map();

	const { select } = setContext('filetree', {
		/** @param {import('$lib/types').FileStub} file */
		select: (file) => {
			$selected = file;
			$active = /** @type {import('monaco-editor').editor.ITextModel} */ (models.get(file));
		},

		current,

		files,

		active,

		selected,

		started,

		base,

		/** @param {import('$lib/types').Stub[]} data */
		async update(data) {
			await ready;
			await adapter.update(data);

			completed = false;

			const expected = new Set(Object.keys(b));

			for (const file of $files) {
				expected.delete(file.name);

				if (file.type === 'file') {
					if (b[file.name]?.contents !== file.contents) {
						completed = false;
						return;
					}
				}
			}

			completed = expected.size === 0;
		}
	});

	/** @type {{ fulfil: (value?: any) => void, reject: (error: Error) => void }}*/
	let deferred;
	const ready = new Promise((fulfil, reject) => {
		deferred = { fulfil, reject };
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
			if (!destroyed) adapter = await module.create();
			base.set(adapter.base);
			deferred.fulfil();
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
		const stubs = Object.values(section.a);

		files.set(stubs);

		models.forEach((model) => {
			model.dispose();
		});
		models.clear();

		stubs.forEach((stub) => {
			if (stub.type === 'file') {
				const type = /** @type {string} */ (stub.basename.split('.').pop());

				const model = monaco.editor.createModel(
					stub.contents,
					types[type] || type,
					new monaco.Uri().with({ path: stub.name })
				);

				model.onDidChangeContent(() => {
					const value = model.getValue();
					stub.contents = value;
					adapter.update([stub]);
				});

				models.set(stub, model);
			}
		});

		select(
			/** @type {import('$lib/types').FileStub} */ (
				stubs.find((stub) => stub.name === section.chapter.focus)
			)
		);

		current.set(section);

		await ready;
		await adapter.update(stubs);

		while (!$started) {
			try {
				await fetch(adapter.base, {
					mode: 'no-cors'
				});
				$started = true;
			} catch {
				await new Promise((f) => setTimeout(f, 250));
			}
		}

		completed = false;
	});
</script>

<div class="container">
	<SplitPane type="horizontal" min="360px" max="50%" pos="360px">
		<section class="content" slot="a">
			<TableOfContents {index} {section} />

			<div class="text">{@html section.html}</div>

			{#if Object.keys(section.b).length > 0}
				<div class="controls">
					<label>
						<input
							type="checkbox"
							checked={completed}
							on:change={(e) => {
								completed = e.currentTarget.checked;
								const selected_name = $selected.name;

								const data = Object.values(completed ? b : section.a);

								$files = data;
								$selected =
									data.find((file) => file.name === selected_name) ||
									data.find((file) => file.name === section.chapter.focus);

								adapter.update(data);
							}}
						/>
						{completed ? 'show completed (uncheck to reset)' : 'show completed'}
					</label>
				</div>
			{/if}
		</section>

		<section slot="b">
			<SplitPane type="vertical" min="100px" max="-100px" pos="50%">
				<section slot="a">
					<SplitPane type="horizontal" min="20px" max="-20px" pos="200px">
						<section slot="a">
							<div class="filetree">
								<Folder {...$current.chapter.scope} files={$files} expanded />
							</div>
						</section>

						<section slot="b">
							<Editor model={$active} />
						</section>
					</SplitPane>
				</section>

				<section slot="b">
					{#if $started}
						<iframe title="Output" src={$base} />
					{/if}
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
		padding: 3rem;
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
		margin: 2em 0 0 0;
	}

	.text :global(code) {
		background: none;
		color: white;
	}

	.text :global(code)::before,
	.text :global(code)::after {
		content: '`';
	}

	.text :global(pre) {
		background: white;
		padding: 1rem;
		margin: 0 0 1em 0;
		line-height: 1.3;
		border-radius: 2px;
	}

	.text :global(pre) :global(code) {
		color: var(--code-base);
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

	iframe {
		width: 100%;
		height: 100%;
		resize: none;
		box-sizing: border-box;
		border: none;
	}

	.filetree {
		background: #f9f9f9;
		padding: 1rem;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
