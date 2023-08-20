---
title: Fonctions POST
---

Vous pouvez aussi ajouter des gestionnaires qui mutent la donnée, comme `POST`. Dans la plupart des cas, vous devriez plutôt utiliser des [actions de formulaires](the-form-element) — vous écrirez moins de code et votre application fonctionnera même sans JavaScript, la rendant plus résiliante.

Dans le gestionnaire d'évènement `keydown` de l'`<input>` "ajouter une tâche", envoyons de la donnée vers le serveur :

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	on:keydown={async (e) => {
		if (e.key === 'Enter') {
			const input = e.currentTarget;
			const description = input.value;

+++			const response = await fetch('/todo', {
				method: 'POST',
				body: JSON.stringify({ description }),
				headers: {
					'Content-Type': 'application/json'
				}
			});+++

			input.value = '';
		}
	}}
/>
```

Ici, nous envoyons du <span class="vo">[JSON](SVELTE_SITE_URL/docs/web#json)</span> à la route d'<span class="vo">[API](SVELTE_SITE_URL/docs/development#api)</span> `/todo` — en utilisant `userid` venant des cookies — et recevons l'`id` de la tâche nouvellement créée en réponse.

Créez la route `/todo` en ajoutant un fichier `src/routes/todo/+server.js` avec une fonction `POST` qui appelle `createTodo` dans `src/lib/server/database.js` :

```js
/// file: src/routes/todo/+server.js
import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function POST({ request, cookies }) {
	const { description } = await request.json();

	const userid = cookies.get('userid');
	const { id } = await database.createTodo({ userid, description });

	return json({ id }, { status: 201 });
}
```

Comme avec les fonctions `load` et les actions de formulaire, la `request` est un objet [Request](https://developer.mozilla.org/fr/docs/Web/API/Request) standard ; `await request.json()` renvoie la donnée que nous avons envoyée depuis le gestionnaire d'évènement.

Nous renvoyons une réponse avec un statut [201 Created](https://httpstatusdogs.com/201-created) (en anglais), et l`id` de la tâche nouvellement générée dans notre base de données. Nous pouvons utiliser cela dans notre gestionnaire d'évènement pour mettre à jour la page :

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	on:keydown={async (e) => {
		if (e.key === 'Enter') {
			const input = e.currentTarget;
			const description = input.value;

			const response = await fetch('/todo', {
				method: 'POST',
				body: JSON.stringify({ description }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

+++			const { id } = await response.json();

			data.todos = [...data.todos, {
				id,
				description
			}];+++

			input.value = '';
		}
	}}
/>
```

> Il est recommandé de muter `data` de sorte à obtenir le même résultat en rechargeant la page.
