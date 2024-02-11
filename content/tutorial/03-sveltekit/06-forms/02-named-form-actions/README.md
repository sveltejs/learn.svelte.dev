---
title: Actions nommées
---

Une page qui a une seule action de formulaire est, en pratique, plutôt rare. La plupart du temps vous aurez besoin de plusieurs actions sur vos pages. Dans cette application, créer une tâche n'est pas suffisant — nous aimerions supprimer les tâches une fois qu'elles sont terminées.

Commencez par remplacer notre action `default` par des actions nommées `create` et `delete` :

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

> Les actions par défaut ne peuvent pas coexister avec les actions nommées.

L'élément `<form>` a un attribut `action` optionnel, qui est similaire à l'attribut `href` de l'élément `<a>`. Mettez à jour le formulaire existant pour qu'il pointe vers la nouvelle action `create` :

```svelte
/// file: src/routes/+page.svelte
<form method="POST" +++action="?/create"+++>
	<label>
		ajouter une tâche :
		<input
			name="description"
			autocomplete="off"
		/>
	</label>
</form>
```

> L'attribut `action` peut être n'importe quelle URL — si l'action était définie sur une autre page, vous auriez quelque chose comme `/todos?/create`. Comme l'action est sur _cette_ page, nous pouvons complètement nous passer du chemin, ce qui explique le `?` au début de l'URL.

Ensuite, nous voulons créer un formulaire pour chaque tâche, complété avec un `<input>` caché qui l'identifie de manière unique :

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	{#each data.todos as todo (todo.id)}
		<li>
+++			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={todo.id} />
				<span>{todo.description}</span>
				<button aria-label="Marquer comme terminée" />
			</form>+++
		</li>
	{/each}
</ul>
```
