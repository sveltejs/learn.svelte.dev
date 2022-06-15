---
title: Pages
---

SvelteKit uses filesystem-based routing, which means that the _routes_ of your app — in other words, what the app should do when a user navigates to a particular URL — follow the same structure as your source code.

In this app we have two routes — `src/routes/index.svelte`, which maps to `/`, and `src/routes/about.svelte`, which maps to `/about`. Clicking the `about` link will take you from the home page to the about page.

> Unlike traditional multi-page apps, navigating to `/about` updates the contents of the current page, like a single-page app. This gives us the best of both worlds — fast server-rendered startup, then instant navigation.

Let's add a link in `src/routes/about.svelte` back to the homepage:

```svelte
<p>This is the about page.</p>
<p>Go to the +++<a href="/">+++home+++</a>+++ page</p>
```
