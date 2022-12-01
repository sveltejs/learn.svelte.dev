---
title: Pages
---

SvelteKit uses filesystem-based routing, which means that the _routes_ of your app — in other words, what the app should do when a user navigates to a particular URL — are defined by the directories in your codebase.

The routes are located within `src/routes`. Every directory within which contains a `+page.svelte` file creates a route in your app.

In this app we currently have one route — `src/routes/+page.svelte`, which maps to `/`.

Let's add a second route, `src/routes/about/+page.svelte`, which maps to `/about`:

```diff
src/routes/
+├ about/
+│ └ +page.svelte
└ +page.svelte
```

Clicking the `about` link on the home page will now take you to the about page (which is empty right now).

Let's add some content (including a link back to the homepage) to `src/routes/about/+page.svelte` :

```svelte
+++<h1>About</h1>

<p>This is the about page.</p>
<p>Go to the <a href="/">home</a> page</p>+++
```

> Unlike traditional multi-page apps, navigating to `/about` and back updates the contents of the current page, like a single-page app. This gives us the best of both worlds — fast server-rendered startup, then instant navigation.
