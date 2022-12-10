---
title: Basics
---

There are two types of errors in SvelteKit — _expected_ errors and _unexpected_ errors.

An expected error is one that was created with the [`error`](https://kit.svelte.dev/docs/modules#sveltejs-kit-error) helper from `@sveltejs/kit`, as in `src/routes/expected/+page.server.js`:

```js
/// file: src/routes/expected/+page.server.js
import { error } from '@sveltejs/kit';

export function load() {
	throw error(420, 'Enhance your calm');
}
```

Any other error — such as the one in `src/routes/unexpected/+page.server.js` — is treated as unexpected:

```js
/// file: src/routes/unexpected/+page.server.js
export function load() {
	throw new Error('Kaboom!');
}
```

When you throw an expected error, you're telling SvelteKit 'don't worry, I know what I'm doing here'. An unexpected error, by contrast, is assumed to be a bug in your app. When an unexpected error is thrown, its message and stack trace will be logged to the console.

> In a later chapter we'll learn about how to add custom error handling using the `handleError` hook.

If you click the links in this app, you'll notice an important difference: the expected error message is shown to the user, whereas the unexpected error message is redacted and replaced with a generic 'Internal Error' message and a 500 status code. That's because error messages can contain sensitive data.
