---
title: Autres fonctions
---

De même, nous pouvons ajouter des gestionnaires pour d'autres verbes HTTP. Ajoutez une route `/todo/[id]` en créant un fichier `src/routes/todo/[id]/+server.js` avec des fonctions `PUT` et `DELETE` pour activer et supprimer les tâches, en utilisant les fonctions `toggleTodo` et `deleteTodo` dans `src/lib/server/database.js` :

```js
/// file: src/routes/todo/[id]/+server.js
import * as database from '$lib/server/database.js';

export async function PUT({ params, request, cookies }) {
	const { done } = await request.json();
	const userid = cookies.get('userid');

	await database.toggleTodo({ userid, id: params.id, done });
	return new Response(null, { status: 204 });
}

export async function DELETE({ params, cookies }) {
	const userid = cookies.get('userid');

	await database.deleteTodo({ userid, id: params.id });
	return new Response(null, { status: 204 });
}
```

Puisque nous n'avons pas besoin de renvoyer de la donnée au navigateur, nous renvoyons un objet [Response](https://developer.mozilla.org/fr/docs/Web/API/Response) vide avec un statut [204 No Content](https://httpstatusdogs.com/204-no-content) (en anglais).

Nous pouvons maintenant interagir avec ce [endpoint](SVELTE_SITE_URL/docs/web#endpoint) dans notre gestionnaire d'évènement :

```svelte
/// file: src/routes/+page.svelte
<label>
	<input
		type="checkbox"
		checked={todo.done}
		on:change={async (e) => {
			const done = e.currentTarget.checked;

+++			await fetch(`/todo/${todo.id}`, {
				method: 'PUT',
				body: JSON.stringify({ done }),
				headers: {
					'Content-Type': 'application/json'
				}
			});+++
		}}
	/>
	<span>{todo.description}</span>
	<button
		aria-label="Marquer comme terminée"
		on:click={async (e) => {
+++			await fetch(`/todo/${todo.id}`, {
				method: 'DELETE'
			});

			data.todos = data.todos.filter((t) => t !== todo);+++
		}}
	/>
</label>
```
