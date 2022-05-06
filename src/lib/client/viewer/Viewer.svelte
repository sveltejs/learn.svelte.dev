<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import Editor from './Editor.svelte';
	import FileTree from './FileTree/FileTree.svelte';

	const dispatch = createEventDispatcher();

	/** @type {{ fulfil: (value?: any) => void, reject: (error: Error) => void }}*/
	let deferred;
	const ready = new Promise((fulfil, reject) => {
		deferred = { fulfil, reject };
	});

	/** @type {TODO} */
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

	/** @type {Array<import('$lib/types').File | import('$lib/types').Directory>}*/
	let files = [];

	/** @type {import('$lib/types').File | null}*/
	let current = null;

	let started = false;

	/** @param {Array<import('$lib/types').File | import('$lib/types').Directory>} data */
	export async function set(data) {
		files = data;
		dispatch('change', files);

		current = /** @type {import('$lib/types').File} */ (
			files.find((file) => file.name === '/src/routes/index.svelte')
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
			<FileTree
				{files}
				on:select={(e) => {
					current = e.detail;
				}}
			/>
		</div>

		<div class="right">
			<Editor
				file={current}
				on:input={(e) => {
					if (current) {
						// @ts-ignore for now
						current.contents = e.currentTarget.value;
						update([current]);
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
</style>
