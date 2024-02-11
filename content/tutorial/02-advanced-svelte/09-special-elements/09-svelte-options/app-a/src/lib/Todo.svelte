<script>
	import { afterUpdate } from 'svelte';
	import flash from './flash.js';

	export let todo;

	let element;

	afterUpdate(() => {
		flash(element);
	});
</script>

<!-- le texte clignote en rouge quand
     l'objet `todo` change -->
<li bind:this={element}>
	<label>
		<input type="checkbox" checked={todo.done} on:change />
		{todo.text}
	</label>
</li>
