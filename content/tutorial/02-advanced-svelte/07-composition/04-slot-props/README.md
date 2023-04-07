---
title: Slot props
---

Components can pass data _back_ to their slotted content via _slot props_. In this app, we have a list of named CSS colours. Typing into the `<input>` will filter the list.

Right now every row is showing `AliceBlue`, and as lovely a colour as it is, that's not what we want.

Open `FilterableList.svelte`. The `<slot>` is being rendered for each filtered item in the list. Pass the data into the slot:

```svelte
/// file: FilterableList.svelte
<div class="content">
	{#each data.filter(matches) as item}
		<slot +++{item}+++ />
	{/each}
</div>
```

(As in other contexts, `{item}` is shorthand for `item={item}`.)

Then, on the other side, expose the data to the slotted content with the `let:` directive:

```svelte
/// file: App.svelte
<FilterableList
	data={colors}
	field="name"
	+++let:item={row}+++
>
	<div class="row">
		<span class="color" style="background-color: {row.hex}" />
		<span class="name">{row.name}</span>
		<span class="hex">{row.hex}</span>
		<span class="rgb">{row.rgb}</span>
		<span class="hsl">{row.hsl}</span>
	</div>
</FilterableList>
```

Finally, get rid of the placeholder variable, which we no longer need:

```svelte
/// file: App.svelte
<script>
	import FilterableList from './FilterableList.svelte';
	import { colors } from './colors.js';

	---let row = colors[0];---
</script>
```

> Named slots can also have props; use the `let` directive on an element with a `slot="..."` attribute, instead of on the component itself.
