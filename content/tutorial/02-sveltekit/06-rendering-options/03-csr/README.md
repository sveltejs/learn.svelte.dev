---
title: Client-side rendering
---

The `csr` option controls whether or not a page is rendered on the client.

By default this option is set to `true`. Setting this option to `false` will make the page render on the server only - which means 0kb of JS!

Setting it to `false` is useful if you have pages that don't have any interactivity requirements such as a static about page. Let's add this option to ours inside `+page.js`:

```js
+++export const csr = false;+++
```
