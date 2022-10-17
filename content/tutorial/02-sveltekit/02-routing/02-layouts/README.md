---
title: Layouts
---

Sections of your app often share a common UI. To not repeat that code, we can use layouts.

In this app we have two routes — `src/routes/+page.svelte`, and `src/routes/about/+page.svelte`. Both contain the same header which enables us to navigate around.

We can deduplicate this code by moving the common UI into a `+layout.svelte` file. All pages in the same folder or below this file will share that UI. The layout itself needs a `<slot />` at minimum to define where the content is projected.

Let's move the duplicate content from `src/routes/+page.svelte` and `src/routes/about/+page.svelte` into `src/routes/+layout.svelte`:

```svelte
+++<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>
+++
<slot />
+++
<style>
	nav {
		display: flex;
		justify-content: space-between;
		padding: 1em;
		background-color: #eee;
	}
</style>
+++
```

> Layouts can also be nested
