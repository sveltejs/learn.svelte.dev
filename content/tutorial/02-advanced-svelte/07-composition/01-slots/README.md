---
title: Slots
---

Just like elements can have children...

```html
/// no-file
<div>
	<p>I'm a child of the div</p>
</div>
```

...so can components. Before a component can accept children, though, it needs to know where to put them. We do this with the `<slot>` element. Put this inside `Card.svelte`:

```svelte
/// file: Card.svelte
<div class="card ">
	+++<slot />+++
</div>
```

You can now put things on the card:

```svelte
/// file: App.svelte
<Card>
	+++<span>Patrick BATEMAN</span>+++
	+++<span>Vice President</span>+++
</Card>
```
