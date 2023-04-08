<svelte:options immutable />

<script>
	import { afterUpdate } from 'svelte';
	import flash from './flash.js';

	export let todo;

	let element;

	afterUpdate(() => {
		flash(element);
	});
</script>

<!-- the text will flash red whenever
     the `todo` object changes -->
<li bind:this={element}>
	<label>
		<input type="checkbox" checked={todo.done} on:change />
		{todo.text}
	</label>
</li>