---
title: Expected errors
---

You can also throw _expected_ errors, for example when your app is ending up in an illegal state. For this, use `error` from `@sveltejs/kit`.

Its first argument is the status code, the second is the error message. Let's use that to adjust our `load` function in `+page.js`.

```js
+++import { error } from '@sveltejs/kit';+++

export function load() {
    ---throw new Error('boom');---
	+++throw error(403, "I changed my mind, I don't want you to see this");+++
}
```

In contrast to unexpected error, the message of `error`s you throw yourself this way do _not_ call the `handleError` hook and are propagated to `$page.error` directly.

> If you defined the error shape through the `App.Error` interface, the second parameter passed to the `error` function expects this shape.
