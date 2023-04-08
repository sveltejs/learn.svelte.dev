---
title: DOM event forwarding
---

Event forwarding works for DOM events too.

We want to get notified of clicks on our `<BigRedButton>` — to do that, we just need to forward `click` events on the `<button>` element in `BigRedButton.svelte`:

```svelte
/// file: BigRedButton.svelte
<button +++on:click+++>
	Push
</button>
```
