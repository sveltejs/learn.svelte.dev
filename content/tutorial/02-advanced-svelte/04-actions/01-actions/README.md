---
title: The use directive
---

Actions are essentially element-level lifecycle functions. They're useful for things like:

- interfacing with third-party libraries
- lazy-loaded images
- tooltips
- adding custom event handlers

In this app, you can scribble on the `<canvas>`, and change colours and brush size via the menu. But if you open the menu and cycle through the options with the Tab key, you'll soon find that the focus isn't _trapped_ inside the modal.

We can fix that with an action. Import `trapFocus` from `actions.js`...

```svelte
/// file: App.svelte
<script>
	import Canvas from './Canvas.svelte';
	+++import { trapFocus } from './actions.js';+++

	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];
	let selected = colors[0];
	let size = 10;

	let showMenu = true;
</script>
```

...then add it to the menu with the `use:` directive:

```svelte
/// file: App.svelte
<div class="menu" +++use:trapFocus+++>
```

Let's take a look at the `trapFocus` function in `actions.js`. An action function is called with a `node` — the `<div class="menu">` in our case — when the node is mounted to the DOM, and can return an action object with a `destroy` method.

First, we need to add an event listener that intercepts Tab key presses:

```js
/// file: actions.js
focusable()[0]?.focus();

+++node.addEventListener('keydown', handleKeydown);+++
```

Second, we need to do some cleanup when the node is unmounted — removing the event listener, and restoring focus to where it was before the element mounted:

```js
/// file: actions.js
focusable()[0]?.focus();

node.addEventListener('keydown', handleKeydown);

+++return {
	destroy() {
		node.removeEventListener('keydown', handleKeydown);
		previous?.focus();
	}
};+++
```

Now, when you open the menu, you can cycle through the options with the Tab key.
