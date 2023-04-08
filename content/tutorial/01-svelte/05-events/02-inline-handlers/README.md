---
title: Inline handlers
---

You can also declare event handlers inline:

```svelte
/// file: App.svelte
<script>
	let m = { x: 0, y: 0 };

	---function handleMove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}---
</script>

<div
	on:pointermove={+++(e) => {
		m = { x: e.clientX, y: e.clientY };
	}+++}
>
	The mouse position is {m.x} x {m.y}
</div>
```

> In some frameworks you may see recommendations to avoid inline event handlers for performance reasons, particularly inside loops. That advice doesn't apply to Svelte — the compiler will always do the right thing, whichever form you choose.
