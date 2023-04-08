---
title: Checking for slot content
---

In some cases, you may want to control parts of your component based on whether slotted content was passed in. For example, if we remove the `<header>` from `App.svelte`...

```svelte
/// file: App.svelte
---<header slot="header" class="row">
	<span class="color" />
	<span class="name">name</span>
	<span class="hex">hex</span>
	<span class="rgb">rgb</span>
	<span class="hsl">hsl</span>
</header>---

<div class="row">
	<span class="color" style="background-color: {row.hex}" />
	<span class="name">{row.name}</span>
	<span class="hex">{row.hex}</span>
	<span class="rgb">{row.rgb}</span>
	<span class="hsl">{row.hsl}</span>
</div>
```

...we're left with an ugly double border because `FilterableList.svelte` is still rendering the `<div class="header">`.

We can fix that by using the special `$$slots` variable in `FilterableList.svelte`:

```svelte
/// file: FilterableList.svelte
+++{#if $$slots.header}+++
	<div class="header">
		<slot name="header"/>
	</div>
+++{/if}+++
```
