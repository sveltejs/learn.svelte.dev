---
title: Form Validation
---

In the previous section we created a form and redirected the user without even checking the credentials - a rather insecure application we built there. Let's change that by adding some validation!

In `+page.server.js` we do that by first getting the form data from the `request` object that is passed to the action function. We then check if the credentials are valid - let's hardcode them for the sake of this tutorial. If the credentials are invalid, we return `invalid` imported from `@sveltejs/kit` with a status code and an error object:

```js
import { redirect, +++invalid+++ } from '@sveltejs/kit';

export const actions = {
	default: +++async+++ (+++{ request }+++) => {
		+++const fields = await request.formData();
		if (fields.get('email') !== 'svelte@kit.dev' || fields.get('password') !== 'tutorial') {
			return invalid(422, { message: 'Invalid Credentials' });
		}+++
		throw redirect(307, '/user');
	}
}
```

What's left to do is displaying that error message. Whatever is returned from `invalid` will be part of the `forms` property in `+page.svelte`, which we can access through `export let forms`.

```svelte
+++<script>
	export let form;
</script>+++

<p>Please log in</p>

<form method="POST">
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	+++{#if form?.message}
		<span>{form?.message}</span>
	{/if}+++
	<button>Log in</button>
</form>
```

> `form` is set to `null` initially and will be filled with whatever you return from `invalid`. You can also return data in case of a successful submission.
