---
title: Validation
---

Les utilisateurs et utilisatrices sont une espèce malicieuse, qui peut soumettre de la donnée absurde si on lui en laisse l'occasion. Pour les empêcher de répandre le chaos, il est important de valider la donnée.

La première ligne de défense est la [validation de formulaire native du navigateur](https://developer.mozilla.org/fr/docs/Learn/Forms/Form_validation#using_built-in_form_validation), qui rend simple par exemple de rendre un `<input>` obligatoire :

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/create">
	<label>
		ajouter une tâche
		<input
			name="description"
			autocomplete="off"
			+++required+++
		/>
	</label>
</form>
```

Essayer d'appuyer sur Entrée lorsque l'`<input>` est vide.

Ce genre de validation est pratique, mais insuffisant. Certaines règles de validation (par ex. l'unicité) ne peuvent pas être exprimées en utilisant des attributs d'`<input>`, et dans tous les cas, si la personne est une hackeuse d'élite, elle pourrait très simplement ignorer les attributs en utilisant les outils de développement du navigateur. Pour se prévenir de telles manigances, vous devriez toujours valider vos formulaires côté serveur.

Dans `src/lib/server/database.js`, valider que la description existe et qu'elle est unique :

```js
/// file: src/lib/server/database.js
export function createTodo(userid, description) {
+++	if (description === '') {
		throw new Error('une tâche doit avoir une description');
	}+++

	const todos = db.get(userid);

+++	if (todos.find((todo) => todo.description === description)) {
		throw new Error('les tâches doivent être uniques');
	}+++

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}
```

Essayez de créer une tâche dupliquées. Beurk ! SvelteKit nous emmène vers une page d'erreur très inhospitalière. Sur le serveur, nous voyons une erreur "les tâches doivent être uniques", mais SvelteKit cache aux utilisateurs et utilisatrices les messages d'erreurs inattendus car ils contiennent souvent de la donnée sensible.

Il serait plus approprié de rester sur la même page et de fournir une indication de ce qu'il s'est mal passé afin que la personne puisse corriger le problème. Pour faire cela, nous pouvons utiliser la fonction `fail` pour renvoyer de la donnée de l'action avec un code HTTP approprié :

```js
/// file: src/routes/+page.server.js
+++import { fail } from '@sveltejs/kit';+++
import * as db from '$lib/server/database.js';

export function load({ cookies }) {...}

export const actions = {
	create: async ({ cookies, request }) => {
		const data = await request.formData();

+++		try {+++
			db.createTodo(cookies.get('userid'), data.get('description'));
+++		} catch (error) {
			return fail(422, {
				description: data.get('description'),
				error: error.message
			});
		}+++
	}
```

Dans `src/routes/+page.svelte`, nous pouvons accéder à la valeur renvoyée via la <span class="vo">[prop](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span> `form`, qui n'est remplie qu'après la soumission d'un formulaire :

```svelte
/// file: src/routes/+page.svelte
<script>
	export let data;
	+++export let form;+++
</script>

<div class="centered">
	<h1>todos</h1>
	
	+++{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}+++
	
	<form method="POST" action="?/create">
		<label>
			ajouter une tâche :
			<input
				name="description"
				+++value={form?.description ?? ''}+++
				autocomplete="off"
				required
			/>
		</label>
	</form>
```

> Vous pouvez aussi renvoyer de la donnée depuis une action _sans_ utiliser `fail` — par exemple pour afficher un message "succès !" lorsque la donnée est enregistrée — elle sera également disponible dans la <span class="vo">[prop](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span> `form`.
