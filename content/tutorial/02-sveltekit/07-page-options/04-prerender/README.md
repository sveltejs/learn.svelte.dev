---
title: prerender
---

Prerendering means generating HTML for a page once, at build time, rather than dynamically for each request.

The advantage is that serving static data is extremely cheap and performant, allowing you to easily serve large numbers of users without worrying about cache-control headers (which are easy to get wrong).

The tradeoff is that the build process takes longer, and prerendered content can only be updated by building and deploying a new version of the application.

To prerender a page, set `prerender` to `true`:

```js
/// file: src/routes/+page.server.js
export const prerender = true;
```

Here in the tutorial, this won't have any observable effect, since the application is running in `dev` mode.

Not all pages can be prerendered. The basic rule is this: for content to be prerenderable, any two users hitting it directly must get the same content from the server, and the page must not contain form actions. Pages with dynamic route parameters can be prerendered as long as they are specified in the [`prerender.entries`](https://kit.svelte.dev/docs/configuration#prerender) configuration or can be reached by following links from pages that _are_ in `prerender.entries`.

> Setting `prerender` to `true` inside your root `+layout.server.js` effectively turns SvelteKit into a static site generator (SSG).
