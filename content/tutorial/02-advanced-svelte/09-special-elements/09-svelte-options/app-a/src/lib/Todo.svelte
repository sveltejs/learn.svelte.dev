<script>
	import { afterUpdate } from 'svelte';
	import flash from './flash.js';

	export let todo;

	let label;

	afterUpdate(() => {
		flash(label);
	});
</script>

<!-- the text will flash red whenever
     the `todo` object changes -->
<label bind:this={label}>
	<input type="checkbox" checked={todo.done} on:change />
	{todo.text}
</label>
