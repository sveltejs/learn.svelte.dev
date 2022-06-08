---
title: Nested components
---

It would be impractical to put your entire app in a single component. Instead, we can import components from other files and include them in our markup.

Add a `<script>` tag that imports `Nested.svelte`...

```svelte
+++<script>
	import Nested from './Nested.svelte';
</script>+++
```

...and include a `<Nested />` component:

```svelte
<p>This is a paragraph.</p>
+++<Nested />+++
```

Notice that even though `Nested.svelte` has a `<p>` element, the styles from `App.svelte` don't leak in.

> Component names are always capitalised, to distinguish them from HTML elements.
