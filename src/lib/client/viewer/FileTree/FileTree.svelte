<script>
	import Folder from './Folder.svelte';
	import { createEventDispatcher, setContext } from 'svelte';

	/** @type {Array<import('$lib/types').File | import('$lib/types').Directory>}*/
	export let files;

	const dispatch = createEventDispatcher();

	setContext('filetree', {
		dispatch
	});
</script>

<div class="filetree">
	<Folder prefix="/" depth={0} name="Project" {files} expanded />
</div>
