<script>
	import { afterNavigate } from '$app/navigation';
	import { setContext, getContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Viewer from '$lib/client/viewer/Viewer.svelte';
	import TableOfContents from './_/TableOfContents.svelte';

	/** @type {any} */
	export let section;

	const index = getContext('index');

	let completed = false;

	$: b = { ...section.a, ...section.b };

	/** @type {import('svelte/store').Writable<import('$lib/types').Section>}*/
	const current = writable(section);

	/** @type {import('svelte/store').Writable<Array<import('$lib/types').File | import('$lib/types').Directory>>} */
	const files = writable([]);

	/** @type {import('svelte/store').Writable<import('$lib/types').File | null>} */
	const selected = writable(null);

	const started = writable(false);

	const base = writable('');

	setContext('filetree', {
		/** @param {import('$lib/types').File} file */
		select: (file) => {
			selected.set(file);
		},

		current,

		files,

		selected,

		started,

		base,

		/** @param {Array<import('$lib/types').File | import('$lib/types').Directory>} data */
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
		};
	});

	afterNavigate(async () => {
		const data = Object.values(section.a);

		files.set(data);

		selected.set(
			/** @type {import('$lib/types').File} */ (
				data.find((file) => file.name === section.group.focus)
			)
		);

		current.set(section);

		await ready;
		await adapter.update(data);

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

<div class="grid">
	<div class="left">
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
								data.find((file) => file.name === section.group.focus);

							adapter.update(data);
						}}
					/>
					{completed ? 'show completed (uncheck to reset)' : 'show completed'}
				</label>
			</div>
		{/if}
	</div>

	<div class="right">
		<Viewer />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 400px 1fr;
		height: 100%;
		max-height: 100%;
	}

	.left {
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
		background: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		margin: 0 0 1em 0;
		line-height: 1.3;
		border-radius: 2px;
	}

	.text :global(pre) :global(code) {
		color: white;
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

	.controls {
		padding: 1rem 3rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>
