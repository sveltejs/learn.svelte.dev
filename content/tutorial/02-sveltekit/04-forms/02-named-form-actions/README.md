---
title: Named form actions
---

A page that only has a single action is, in practice, quite rare. Most of the time you'll need to have multiple actions on a page. In this app, creating a todo isn't enough — we'd like to delete them once they're complete.

Begin by replacing our `default` action with named `create` and `delete` actions:

```js
/// file: src/routes/+page.server.js
export const actions = {
	+++create+++: async ({ cookies, request }) => {
		const data = await request.formData();
		db.createTodo(cookies.get('userid'), data.get('description'));
	}+++,+++

+++	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		db.deleteTodo(cookies.get('userid'), data.get('id'));
	}+++
};
```

> Default actions cannot coexist with named actions.

The `<form>` element has an optional `action` attribute, which is similar to an `<a>` element's `href` attribute. Update the existing form so that it points to the new `create` action:

```svelte
/// file: src/routes/+page.svelte
<form method="POST" +++action="?/create"+++>
	<label>
		add a todo:
		<input name="description" />
	</label>
</form>
```

> The `action` attribute can be any URL — if the action was defined on another page, you might have something like `/todos?/create`. Since the action is on _this_ page, we can omit the pathname altogether, hence the leading `?` character.

Next, we want to create a form for each todo, complete with a hidden `<input>` that uniquely identifies it:

```svelte
/// file: src/routes/+page.svelte
<ul>
	{#each data.todos as todo (todo.id)}
		<li class="todo">
+++			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={todo.id} />
				<button aria-label="Mark as complete">✔</button>+++
				{todo.description}
+++			</form>+++
		</li>
	{/each}
</ul>
```
