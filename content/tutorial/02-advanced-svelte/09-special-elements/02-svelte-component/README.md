---
title: <svelte:component>
---

A component can change its type altogether with `<svelte:component>`. In this exercise, we want to show `RedThing.svelte` if the `color` is `red`, `GreenThing.svelte` if it's `green`, and so on.

We _could_ do this with a sequence of `if` blocks...

```svelte
/// file: App.svelte
{#if selected.color === 'red'}
	<RedThing/>
{:else if selected.color === 'green'}
	<GreenThing/>
{:else if selected.color === 'blue'}
	<BlueThing/>
{/if}
```

...but it's a little cumbersome. Instead, we can create a single dynamic component:

```svelte
/// file: App.svelte
<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option.color}</option>
	{/each}
</select>

+++<svelte:component this={selected.component} />+++
```

The `this` value can be any component constructor, or a falsy value — if it's falsy, no component is rendered.
