---
title: Error Pages
---

If something goes wrong during executing the `load` functions for a page, we can "catch" these errors with `+error.svelte` pages.

To showcase this, our `+page.js` `load` function throws an error. That error will bubble up the file tree until it finds a `+error.svelte` or falls back to a generic error page if there's none - which is what happens right now.

Let's place a `+error.svelte` file right next to the erroring `+page.js`:

```diff
src/routes/
├ about/
+│ ├ +error.svelte
│ ├ +page.js
│ └ +page.svelte
├ +layout.svelte
└ +page.svelte
```

Notice how now the outer layout still renders after the error and keeps the app functioning.

Inside `+error.svelte`, you are free to put any content you like. Just play around with it a little!
