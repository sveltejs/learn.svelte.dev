---
title: Redirects
---

Besides errors there's one more thing you can `throw`, and that's `redirect`s.

Let's use that to navigate away from our login page when we're logged in.

```js
// login/+page.js
+++import { redirect } from '@sveltejs/kit';+++

export function load() {
    // let's assume for simplicity we are always logged in
    +++throw redirect(307, '/user');+++
}
```

> You may remember this function from the form actions chapter, where it was used to navigate to the user page after a successful login
