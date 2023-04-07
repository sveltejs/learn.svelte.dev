---
title: <svelte:head>
---

The `<svelte:head>` element allows you to insert elements inside the `<head>` of your document. This is useful for things like `<title>` and `<meta>` tags, which are critical for good SEO.

Since those are quite hard to show in the context of this tutorial, we'll use it for a different purpose — loading stylesheets.

```svelte
/// file: App.svelte
<script>
	const themes = ['margaritaville', 'retrowave', 'spaaaaace', 'halloween'];
	let selected = themes[0];
</script>

+++<svelte:head>
	<link rel="stylesheet" href="/stylesheets/{selected}.css" />
</svelte:head>+++

<h1>Welcome to my site!</h1>
```

> In server-side rendering (SSR) mode, contents of `<svelte:head>` are returned separately from the rest of your HTML.
