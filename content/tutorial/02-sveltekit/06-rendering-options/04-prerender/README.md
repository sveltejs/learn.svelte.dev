---
title: Prerendering
---

The `prerender` option controls whether a page is rendered at build time or at runtime.

By default this option is set to `false`. Setting this option to `true` will render the page into a good ol' HTML file at build time.

Setting it to `true` is useful if you have pages that don't have any dependency on runtime data such as a static about page. Let's add this option to ours inside `+page.js`:

```js
+++export const prerender = true;+++
```

To really see this in effect, you'd need to run the build step and look at the result in preview mode, which we can't in this tutorial.

> If you set `prerender` to `true` inside your root `+layout.js`, you turn SvelteKit into a static site generator!
