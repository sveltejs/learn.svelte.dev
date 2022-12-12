---
title: $env/dynamic/private
---

If you need to read the values of environment variables when the app runs, as opposed to when the app is built, you can use `$env/dynamic/private` instead of `$env/static/private`:

```js
/// file: src/routes/+page.server.js
import { redirect, fail } from '@sveltejs/kit';
import { +++env+++ } from '$env/+++dynamic+++/private';

export function load({ cookies }) {
	if (cookies.get('allowed')) {
		throw redirect(307, '/welcome');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		if (data.get('passphrase') === +++env.+++PASSPHRASE) {
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
