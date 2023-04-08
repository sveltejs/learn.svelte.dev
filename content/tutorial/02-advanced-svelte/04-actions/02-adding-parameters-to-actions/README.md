---
title: Adding parameters
---

Like transitions and animations, an action can take an argument, which the action function will be called with alongside the element it belongs to.

In this exercise, we want to add a tooltip to the `<button>` using the [`Tippy.js`](https://atomiks.github.io/tippyjs/) library. The action is already wired up with `use:tooltip`, but if you hover over the button (or focus it with the keyboard) the tooltip contains no content.

First, the action needs to accept some options and pass them to Tippy:

```js
/// file: App.svelte
function tooltip(node, +++options+++) {
	const tooltip = tippy(node, +++options+++);

	return {
		destroy() {
			tooltip.destroy();
		}
	};
}
```

Then, we need to pass some options into the action:

```svelte
/// file: App.svelte
<button use:tooltip+++={{ content, theme: 'material' }}+++>
	Hover me
</button>
```

The tooltip now works — almost. If we change the text in the `<input>`, the tooltip will not reflect the new content. We can fix that by adding an `update` method to the returned object.

```js
/// file: App.svelte
function tooltip(node, options) {
	const tooltip = tippy(node, options);

	return {
+++		update(options) {
			tooltip.setProps(options);
		},+++
		destroy() {
			tooltip.destroy();
		}
	};
}
```
