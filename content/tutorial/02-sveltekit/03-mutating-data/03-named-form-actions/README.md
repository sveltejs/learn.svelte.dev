---
title: Named Form Actions
---

Some pages have more than one `<form>`. That's why SvelteKit supports named form actions.

Let's add a "Register" button to our existing form and introduce two form actions named `login` and `register`:

```svelte
<script>
	export let form;
</script>

<form method="POST" +++action="?/login">
	<input name="email" type="email">
	<input name="password" type="password">
	{#if form?.message}
		<span>{form?.message}</span>
	{/if}
	<button>Log in</button>
	+++<button formAction="?/register">Register</button>+++
</form>
```

The `?` means that this string is appended as a query string to the existing URL, the `/` is used to uniquly identify the query parameter as a form action, and the name can then be whatever we want.

> The `action`/`formAction` attributes are standard HTML attributes, and you can also link to actions on other pages through them.

In `+page.server.js`, we react to these named actions by adding them as properties to the `actions` object:

```js
import { redirect, invalid } from '@sveltejs/kit';

export const actions = {
	---default---+++login+++: async (request) => {
		const fields = await request.formData();
		if (fields.get('email') !== 'svelte@kit.dev' || fields.get('password') !== 'tutorial') {
			return invalid(422, { message: 'Invalid Credentials' });
		}
		throw redirect(307, '/user');
	},
	+++register: async (request) => {
		const fields = await request.formData();
		if (fields.get('email') === 'svelte@kit.dev') {
			return invalid(422, { message: 'Email already in use' });
		}
		throw redirect(307, '/user');
	}+++
}
```

> We can't have default actions next to named actions, because if you POST to a named action without a redirect, the query parameter is persisted in the URL, which means the next default POST would go through the named action from before.
