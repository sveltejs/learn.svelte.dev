---
title: <svelte:window>
---

Just as you can add event listeners to any DOM element, you can add event listeners to the `window` object with `<svelte:window>`.

We've already got a `handleKeydown` function declared — now all we need to do is add a `keydown` listener:

```svelte
/// file: App.svelte
<svelte:window +++on:keydown={handleKeydown}+++ />
```

> As with DOM elements, you can add [event modifiers](/tutorial/event-modifiers) like `preventDefault`.
