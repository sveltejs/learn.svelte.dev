---
title: DOM events
---

As we've briefly seen already, you can listen to any DOM event on an element (such as click or [pointermove](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event)) with the `on:` directive:

```svelte
/// file: App.svelte
<div +++on:pointermove={handleMove}+++>
	The pointer is at {m.x} x {m.y}
</div>
```
