---
title: Binding to component instances
---

Just as you can bind to DOM elements, you can bind to component instances themselves with `bind:this`.

This is useful in the rare cases that you need to interact with a component programmatically (rather than by providing it with updated props). Revisiting our canvas app from [a few exercises ago](actions), it would be nice to add a button to clear the screen.

First, let's export a function from `Canvas.svelte`:

```svelte
/// file: Canvas.svelte
export let color;
export let size;

+++export function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}+++
```

Then, create a reference to the component instance:

```svelte
/// file: App.svelte
<script>
	import Canvas from './Canvas.svelte';
	import { trapFocus } from './actions.js';

	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];
	let selected = colors[0];
	let size = 10;

	let showMenu = true;
	+++let canvas;+++
</script>

<div class="container">
	<Canvas +++bind:this={canvas}+++ color={selected} size={size} />
```

Finally, add a button that calls the `clear` function:

```svelte
/// file: App.svelte
<div class="controls">
	<button class="show-menu" on:click={() => showMenu = !showMenu}>
		{showMenu ? 'close' : 'menu'}
	</button>

+++	<button on:click={() => canvas.clear()}>
		clear
	</button>+++
</div>
```