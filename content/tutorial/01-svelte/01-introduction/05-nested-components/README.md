---
title: Nested components
---

It would be impractical to put your entire app in a single component. Instead, we can import components from other files and include them in our markup.

Add a `<script>` tag to the top of `App.svelte` that imports `Nested.svelte`...

```svelte
/// file: App.svelte
+++<script>
	import Nested from './Nested.svelte';
</script>+++
```

...and include a `<Nested />` component:

```svelte
/// file: App.svelte
<p>This is a paragraph.</p>
+++<Nested />+++
```
Click on each of the 2 files `App.svelte` and `Nested.svelte` presented on the right.
Notice that even though `Nested.svelte` has a `<p>` element, the styles from `App.svelte` don't leak in.

> Component names are always capitalised, to distinguish them from HTML elements.
