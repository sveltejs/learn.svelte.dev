---
title: Server-side rendering
---

Server-side rendering (SSR) is the generation of HTML on the server. It's what SvelteKit does by default for the initial page load when a user visits your site.

SSR tends to improve performance and makes your app accessible to users if JavaScript fails or is disabled (which happens [more often than you probably think](https://kryogenix.org/code/browser/everyonehasjs.html)). It is also preferred for search engine optimization (SEO) — while some search engines can index content that is rendered in the browser with JavaScript, it happens less frequently and reliably.

The `ssr` option controls whether or not a page is rendered on the server.

By default this option is set to `true`. Setting this option to `false` will make the page render on the client only.

Setting it to `false` is useful if you have things on your page that should not or even cannot run on the server. Let's add this option to ours inside `+page.js`:

```js
+++export const ssr = false;+++
```

> If you set `ssr` to `false` inside your root `+layout.js`, you turn your SvelteKit app into an SPA!
