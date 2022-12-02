---
title: Server-side rendering
---

The `ssr` option controls whether or not a page is rendered on the server.

By default this option is set to `true`. Setting this option to `false` will make the page render on the client only.

Setting it to `false` is useful if you have things on your page that should not or even cannot run on the server. Let's add this option to ours inside `+page.js`:

```js
+++export const ssr = false;+++
```

> If you set `ssr` to `false` inside your root `+layout.js`, you turn your SvelteKit app into an SPA!
