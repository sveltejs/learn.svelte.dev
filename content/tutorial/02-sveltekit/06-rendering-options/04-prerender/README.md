---
title: Prerendering
---

Prerendering means computing the contents of a page at build time and saving the HTML.

This approach has the same benefits as traditional server-rendered pages, but avoids recomputing the page for each visitor and so scales nearly for free as the number of visitors increases. The tradeoff is that the build process takes longer, and prerendered content can only be updated by building and deploying a new version of the application.

The `prerender` option controls whether a page is rendered at build time or at runtime.

By default this option is set to `false`. Setting this option to `true` will render the page into a good ol' HTML file at build time.

Setting it to `true` is useful if you have pages that don't have any dependency on runtime data such as a static about page. Let's add this option to ours inside `+page.js`:

```js
+++export const prerender = true;+++
```

To really see this in effect, you'd need to run the build step and look at the result in preview mode, which we can't in this tutorial.

> If you set `prerender` to `true` inside your root `+layout.js`, you turn SvelteKit into a static site generator!

Not all pages can be prerendered. The basic rule is this: for content to be prerenderable, any two users hitting it directly must get the same content from the server, and the page must not contain actions. Note that you can still prerender content that is loaded based on the page's parameters as long as all users will be seeing the same prerendered content.
