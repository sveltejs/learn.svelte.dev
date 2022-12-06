---
title: Validation
---

Users are a mischievous bunch, who will submit all kinds of nonsensical data if given the chance. To prevent them from causing chaos, it's important to validate form data.

The first line of defense is the browser's [built-in form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#using_built-in_form_validation), which makes it easy to, for example, mark an `<input>` as required:

```svelte
<form method="POST" action="?/create">
	<input
		name="description"
		placeholder="What needs to be done?"
		+++required+++
	/>
</form>
```

Try hitting Enter while the `<input>` is empty.

This kind of validation is helpful, but insufficient. Some validation rules (e.g. uniqueness) can't be expressed using `<input>` attributes, and in any case, if the user is an elite hacker they might simply delete the attributes using the browser's devtools. To guard against these sorts of shenanigans, you should always use server-side validation.

In `src/lib/server/database.js`, validate that the description exists and is unique:

```js
/// file: src/lib/server/database.js
export function createTodo(userid, description) {
+++	if (description === '') {
		throw new Error('Todo must have a description');
	}+++

	if (!db.has(userid)) {
		db.set(userid, []);
	}

	const todos = db.get(userid);

+++	if (todos.find((todo) => todo.description === description)) {
		throw new Error('Todos must be unique');
	}+++

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}
```

Try submitting a duplicate todo. Yikes! SvelteKit takes us to an unfriendly-looking error page. On the server, we see a 'Todos must be unique' error, but SvelteKit hides unexpected error messages from users because they often contain sensitive data.

It would be much better to stay on the same page and provide an indication of what went wrong so that the user can fix it. To do this, we can use the `invalid` function to return data from the action along with an appropriate HTTP status code:

```js
/// file: src/routes/+page.server.js
+++import { invalid } from '@sveltejs/kit';+++

export function load({ cookies }) {...}

export const actions = {
	create: async ({ cookies, request }) => {
		const data = await request.formData();

+++		try {+++
			db.createTodo(cookies.get('userid'), data.get('description'));
+++		} catch (error) {
			return invalid(422, {
				description: data.get('description'),
				error: error.message
			});
		}+++
	}
```

In `src/routes/+page.svelte`, we can access the returned value via the `form` prop, which is only ever populated after a form submission:

```svelte
/// file: src/routes/+page.svelte
<script>
	export let data;
	+++export let form;+++
</script>

<h1>Todos</h1>

+++{#if form?.error}
	<p class="error">{form.error}</p>
{/if}+++

<form method="POST" action="?/create">
	<input
		name="description"
		+++value={form?.description ?? ''}+++
		placeholder="What needs to be done?"
		required
	/>
</form>
```

> You can also return data from an action _without_ wrapping it in `invalid` — for example to show a 'Success!' message when data was saved — and it will be available via the `form` prop.
