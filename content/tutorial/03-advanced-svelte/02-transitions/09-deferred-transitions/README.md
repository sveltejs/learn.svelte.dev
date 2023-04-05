---
title: Deferred transitions
---

A particularly powerful feature of Svelte's transition engine is the ability to _defer_ transitions, so that they can be coordinated between multiple elements.

Take this pair of todo lists, in which toggling a todo sends it to the opposite list. In the real world, objects don't behave like that — instead of disappearing and reappearing in another place, they move through a series of intermediate positions. Using motion can go a long way towards helping users understand what's happening in your app.

We can achieve this effect using the `crossfade` function, as seen in `transition.js`, which creates a pair of transitions called `send` and `receive`. When an element is 'sent', it looks for a corresponding element being 'received', and generates a transition that transforms the element to its counterpart's position and fades it out. When an element is 'received', the reverse happens. If there is no counterpart, the `fallback` transition is used.

Open `TodoList.svelte`. First, import the `send` and `receive` transitions from transition.js:

```svelte
/// file: TodoList.svelte
<script>
	+++import { send, receive } from './transition.js';+++

	export let store;
	export let done;
</script>
```

Then, add them to the `<li>` element, using the `todo.id` property as a key to match the elements:

```svelte
/// file: TodoList.svelte
<li
	class:done
	+++in:receive={{ key: todo.id }}+++
	+++out:send={{ key: todo.id }}+++
>
```

Now, when you toggle items, they move smoothly to their new location. The non-transitioning items still jump around awkwardly — we can fix that in the next chapter.
