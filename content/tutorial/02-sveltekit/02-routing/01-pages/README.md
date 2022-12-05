---
title: Pages
---

SvelteKit uses filesystem-based routing, which means that the _routes_ of your app — in other words, what the app should do when a user navigates to a particular URL — are defined by the directories in your codebase.

The routes are located within `src/routes`. Every directory within which contains a `+page.svelte` file creates a route in your app.

In this app we currently have one route — `src/routes/+page.svelte`, which maps to `/`.

Let's add a second route, `src/routes/about/+page.svelte`, which maps to `/about`:

```svelte
/// file: src/routes/about/+page.svelte
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>

<h1>About</h1>

<p>This is the about page.</p>

<style>
	nav {
		display: flex;
		gap: 1em;
		padding: 1em;
		background-color: #eee;
	}
</style>
```

We can now navigate between `/` and `/about`.

> Unlike traditional multi-page apps, navigating to `/about` and back updates the contents of the current page, like a single-page app. This gives us the best of both worlds — fast server-rendered startup, then instant navigation.
