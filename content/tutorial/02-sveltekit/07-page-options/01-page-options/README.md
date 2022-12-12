---
title: Basics
---

In the chapter on [loading data](/tutorial/page-data), we saw how you can export `load` functions from `+page.js`, `+page.server.js`, `+layout.js` and `+layout.server.js` files. We can also export various **page options** from these modules:

- `ssr` — whether or not pages should be server-rendered
- `csr` — whether to load the SvelteKit client
- `prerender` — whether to prerender pages at build time, instead of per-request
- `trailingSlash` — whether to strip, add, or ignore trailing slashes in URLs

In the following exercises, we'll learn about each of these in turn.

Page options can apply to individual pages (if exported from `+page.js` or `+page.server.js`), or groups of pages (if exported from `+layout.js` or `+layout.server.js`). To define an option for the whole app, export it from the root layout. Child layouts and pages override values set in parent layouts, so — for example — you can enable prerendering for your entire app then disable it for pages that need to be dynamically rendered.

You can mix and match these options in different areas of your app — you could prerender your marketing pages, dynamically server-render your data-driven pages, and treat your admin pages as a client-rendered SPA. This makes SvelteKit very versatile.
