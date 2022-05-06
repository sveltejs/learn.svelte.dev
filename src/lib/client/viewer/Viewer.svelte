<script>
	import { onMount } from 'svelte';

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

	export async function update(files) {
		await ready;
		await adapter.update(files);
	}
</script>

<div>viewer</div>
