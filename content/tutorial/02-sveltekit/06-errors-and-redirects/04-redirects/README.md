---
title: Redirects
---

Besides errors there's one more thing you can `throw`, and that's `redirect`s.

Let's use that to navigate the user from `/docs` to the first documentation page.

```js
/// file: src/routes/blog/+page.server.js
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(307, '/docs/introduction');
}
```

> You can also `throw redirect(..)` inside a [form action](/tutorial/the-form-element), for example to redirect the user after a successful login
