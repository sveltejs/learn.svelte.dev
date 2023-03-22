---
title: Each blocks
---

When building user interfaces you'll often find yourself working with lists of data. In this exercise, we've repeated the `<button>` markup multiple times — changing the colour each time — but there's still more to add.

Instead of laboriously copying, pasting and editing, we can get rid of all but the first button, then use an `each` block:

```svelte
/// file: App.svelte
<div>
	+++{#each colors as color}+++
		<button
			aria-current="{selected === 'red' ? 'true' : undefined}"
			aria-label="red"
			style="background: red"
			on:click={() => selected = 'red'}
		></button>
	+++{/each}+++
</div>
```

> The expression (`colors`, in this case) can be any array or array-like object (i.e. it has a `length` property). You can loop over generic iterables with `each [...iterable]`.

Now we need to use the `color` variable in place of `"red"`:

```svelte
/// file: App.svelte
<div>
	{#each colors as color}
		<button
			aria-current="{selected === +++color+++ ? 'true' : undefined}"
			aria-label=+++{color}+++
			style="background: +++{color}+++"
			on:click={() => selected = +++color+++}
		></button>
	{/each}
</div>
```

You can get the current _index_ as a second argument, like so:

```svelte
/// file: App.svelte
<div>
	{#each colors as color, +++i}+++
		<button
			aria-current="{selected === color ? 'true' : undefined}"
			aria-label={color}
			style="background: {color}"
			on:click={() => selected = color}
		>+++{i + 1}+++</button>
	{/each}
</div>
```
