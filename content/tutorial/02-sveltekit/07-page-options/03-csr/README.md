---
title: csr
---

Client-side rendering is what makes the page interactive — such as incrementing the counter when you click the button in this app — and enables SvelteKit to update the page upon navigation without a full-page reload.

As with `ssr`, you can disable client-side rendering altogether:

```js
/// file: src/routes/+page.server.js
export const csr = false;
```

This means that no JavaScript is served to the client, but it also means that your components are no longer interactive. It can be a useful way to check whether or not your application is usable for people who — for whatever reason — cannot use JavaScript.
