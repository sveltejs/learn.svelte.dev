---
title: In and out
---

Instead of the `transition` directive, an element can have an `in` or an `out` directive, or both together. Import `fade` alongside `fly`...

```js
/// file: App.svelte
import { +++fade+++, fly } from 'svelte/transition';
```

...then replace the `transition` directive with separate `in` and `out` directives:

```svelte
/// file: App.svelte
<p +++in+++:fly={{ y: 200, duration: 2000 }} +++out:fade+++>
	Flies in, +++fades out+++
</p>
```

In this case, the transitions are _not_ reversed.
