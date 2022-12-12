---
title: $env/static/private
---

Environment variables — like API keys and database credentials — can be added to a `.env` file, and they will be made available to your application.

> You can also use `.env.local` or `.env.[mode]` files — see the [Vite documentation](https://vitejs.dev/guide/env-and-mode.html#env-files) for more information). Make sure you add any files containing sensitive information to your `.gitignore` file!

In this exercise, we want to allow the user to enter the website if they know the correct passphrase, using an environment variable.

First, in `.env`, add a new environment variable:

```env
/// file: .env
PASSPHRASE=+++"open sesame"+++
```

Open `src/routes/+page.server.js`. Import `PASSPHRASE` from `$env/static/private` and use it inside the [form action](/tutorial/the-form-element):

```js
/// file: src/routes/+page.server.js
import { redirect, fail } from '@sveltejs/kit';
+++import { PASSPHRASE } from '$env/static/private';+++

export function load({ cookies }) {
	if (cookies.get('allowed')) {
		throw redirect(307, '/welcome');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		if (data.get('passphrase') === +++PASSPHRASE+++) {
			cookies.set('allowed', 'true', {
				path: '/'
			});

			throw redirect(303, '/welcome');
		}

		return fail(403, {
			incorrect: true
		});
	}
};
```

The website is now accessible to anyone who knows the correct passphrase.

> Environment variables in `process.env` are also available via `$env/static/private`.

## Keeping secrets

It's important that sensitive data doesn't accidentally end up being sent to the browser, where it could easily be stolen by hackers and scoundrels.

SvelteKit makes it easy to prevent this from happening. Notice what happens if we try to import `PASSPHRASE` into `src/routes/+page.svelte`:

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { PASSPHRASE } from '$env/static/private';+++
	export let form;
</script>
```

An error overlay pops up, telling us that `$env/static/private` cannot be imported into client-side code. It can only be imported into server modules:

- `+page.server.js`
- `+layout.server.js`
- `+server.js`
- any modules ending with `.server.js`
- any modules inside `src/lib/server`

In turn, these modules can only be imported by _other_ server modules.

## Static vs dynamic

The `static` in `$env/static/private` indicates that these values are known at build time, and can be _statically replaced_. This enables useful optimisations:

```js
import { FEATURE_FLAG_X } from '$env/static/private';

if (FEATURE_FLAG_X === 'enabled') {
	// code in here will be removed from the build output
	// if FEATURE_FLAG_X is not enabled
}
```

In some cases you might need to refer to environment variables that are _dynamic_ — in other words, not known until we run the app. We'll cover this case in the next exercise.
