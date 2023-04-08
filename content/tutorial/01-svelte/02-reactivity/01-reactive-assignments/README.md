---
title: Assignments
---

At the heart of Svelte is a powerful system of _reactivity_ for keeping the DOM in sync with your application state — for example, in response to an event.

To demonstrate it, we first need to wire up an event handler (we'll learn more about these [later](/tutorial/dom-events)):

```svelte
/// file: App.svelte
<button +++on:click={increment}+++>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>
```

Inside the `increment` function, all we need to do is change the value of `count`:

```js
/// file: App.svelte
function increment() {
	+++count += 1;+++
}
```

Svelte 'instruments' this assignment with some code that tells it the DOM will need to be updated.
