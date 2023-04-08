<script>
	import Folder from './Folder.svelte';
	import { files } from './data.js';
</script>

<Folder name="Home" {files} expanded />
