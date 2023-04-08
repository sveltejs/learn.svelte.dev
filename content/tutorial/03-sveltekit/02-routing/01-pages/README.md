---
title: Pages
---

SvelteKit uses filesystem-based routing, which means that the _routes_ of your app — in other words, what the app should do when a user navigates to a particular URL — are defined by the directories in your codebase.

Every `+page.svelte` file inside `src/routes` creates a page in your app. In this app we currently have one page — `src/routes/+page.svelte`, which maps to `/`. If we navigate to `/about`, we'll see a 404 Not Found error.

Let's fix that. Add a second page, `src/routes/about/+page.svelte`, copy the contents of `src/routes/+page.svelte`, and update it:

```svelte
/// file: src/routes/about/+page.svelte
<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

<h1>+++about+++</h1>
<p>this is the +++about+++ page.</p>
```

We can now navigate between `/` and `/about`.

> Unlike traditional multi-page apps, navigating to `/about` and back updates the contents of the current page, like a single-page app. This gives us the best of both worlds — fast server-rendered startup, then instant navigation. (This behaviour can be [configured](https://kit.svelte.dev/docs/page-options).)
