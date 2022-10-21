---
title: Error Pages
---

If something goes wrong during executing the `load` functions for a page, we can "catch" these errors with `+error.svelte` pages.

For teaching purposes, we created a `+page.js` `load` function which throws an error. That error will bubble up the file tree until it finds a `+error.svelte` or falls back to a generic error page if there's none. In this example we placed one right next to the erroring `+page.js` - notice how the outer layout still renders and keeps the app functioning.

Inside `+error.svelte`, you are free to put any content you like. Just play around with it a little!
