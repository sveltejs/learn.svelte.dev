<script>
	import { onMount, createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import Folder from './FileTree/Folder.svelte';

	const dispatch = createEventDispatcher();

	console.log('>>>> INITING VIEWER');

	/** @type {{ fulfil: (value?: any) => void, reject: (error: Error) => void }}*/
	let deferred;
	const ready = new Promise((fulfil, reject) => {
		deferred = { fulfil, reject };
	});

	/** @type {import('$lib/types').Adapter} */
	let adapter;

	onMount(() => {
		let destroyed = false;

		import('../adapters/filesystem/index.js').then(async (module) => {
			if (!destroyed) adapter = await module.create();
			deferred.fulfil();
		});

		return () => {
			destroyed = true;
			if (adapter) {
				adapter.destroy();
			}
		};
	});

	/** @type {import('svelte/store').Writable<Array<import('$lib/types').File | import('$lib/types').Directory>>} */
	const files = writable([]);

	/** @type {import('svelte/store').Writable<import('$lib/types').File | null>} */
	const selected = writable(null);

	setContext('filetree', {
		/** @param {import('$lib/types').File} file */
		select: (file) => {
			selected.set(file);
			dispatch('select', { file });
		},

		files,

		selected
	});

	let started = false;

	/** @param {Array<import('$lib/types').File | import('$lib/types').Directory>} data */
	export async function set(data) {
		console.log('set', data);
		files.set(data);
		dispatch('change', data);

		selected.set(
			/** @type {import('$lib/types').File} */ (
				data.find((file) => file.name === '/src/routes/index.svelte')
			)
		);

		await ready;
		await adapter.update(data);

		while (!started) {
			try {
				await fetch(adapter.base, {
					mode: 'no-cors'
				});
				started = true;
			} catch {
				await new Promise((f) => setTimeout(f, 250));
			}
		}
	}

	/** @param {Array<import('$lib/types').File | import('$lib/types').Directory>} data */
	async function update(data) {
		dispatch('change', data);

		await ready;
		await adapter.update(data);
	}
</script>

<div class="viewer">
	<div class="top">
		<div class="left">
			<div class="filetree">
				<Folder prefix="/" depth={0} name="project" files={$files} expanded toggleable={false} />
			</div>
		</div>

		<div class="right">
			<Editor
				file={$selected}
				on:input={(e) => {
					if ($selected) {
						// @ts-ignore for now
						$selected.contents = e.currentTarget.value;
						update([$selected]);
					}
				}}
			/>
		</div>
	</div>

	<div>
		{#if started}
			<iframe title="Output" src={adapter.base} />
		{/if}
	</div>
</div>

<style>
	.viewer {
		display: grid;
		grid-template-rows: 1fr 1fr;
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		resize: none;
		box-sizing: border-box;
		border: none;
	}

	.top {
		display: grid;
		grid-template-columns: 200px 1fr;
	}

	.left,
	.right {
		width: 100%;
		height: 100%;
	}

	.filetree {
		padding: 1rem;
	}
</style>
