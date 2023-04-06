---
title: ssr
---

Server-side rendering (SSR) is the process of generating HTML on the server, and is what SvelteKit does by default. It's important for performance and [resilience](https://kryogenix.org/code/browser/everyonehasjs.html), and is very beneficial for search engine optimization (SEO) — while some search engines can index content that is rendered in the browser with JavaScript, it happens less frequently and reliably.

That said, some components _can't_ be rendered on the server, perhaps because they expect to be able to access browser globals like `window` immediately. If you can, you should change those components so that they _can_ render on the server, but if you can't then you can disable SSR:

```js
/// file: src/routes/+page.server.js
export const ssr = false;
```

> Setting `ssr` to `false` inside your root `+layout.server.js` effectively turns your entire app into an SPA.
