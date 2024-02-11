---
title: L'élément <form>
---

Dans le chapitre sur [le chargement de données](page-data), nous avons vu comment charger de la donnée depuis le serveur vers le navigateur. Parfois, il est nécessaire d'envoyer de la donnée dans l'autre direction, et c'est là que les éléments de formulaires `<form>` — la méthode standard du web pour soumettre de la donnée — entrent en jeu.

Construisons une application de tâches à faire. Nous avons déjà une base de données en mémoire en place dans `src/lib/server/database.js`, et notre fonction `load` dans `src/routes/+page.server.js` utilise l'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span> <span class="vo">[`cookies`](PUBLIC_KIT_SITE_URL/docs/load#cookies)</span> afin d'avoir une liste de tâches à faire par personne, mais nous avons besoin d'un `<form>` pour créer de nouvelles tâches :

```svelte
/// file: src/routes/+page.svelte
<h1>à faire</h1>

+++<form method="POST">
	<label>
		ajouter une tâche:
		<input
			name="description"
			autocomplete="off"
		/>
	</label>
</form>+++

<ul class="todos">
```

Si nous saisissons quelque chose dans l'`<input>` et que nous appuyons sur Entrée, le navigateur fait une requête POST (grâce à l'attribut `method="POST"`) sur la page actuelle. Mais cela renvoie une erreur, car nous n'avons pas créé d'_action_ côté serveur pour gérer la requête POST. Faisons cela maintenant :

```js
/// file: src/routes/+page.server.js
import * as db from '$lib/server/database.js';

export function load({ cookies }) {
	// ...
}

+++export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		db.createTodo(cookies.get('userid'), data.get('description'));
	}
};+++
```

La variable `request` est un objet [Request](https://developer.mozilla.org/fr/docs/Web/API/Request) standard ; `await request.formData()` renvoie une instance de [`FormData`](https://developer.mozilla.org/fr/docs/Web/API/FormData).

Lorsque nous appuyons sur Entrée, la base de données est mise à jour et la page se recharge avec la nouvelle donnée.

Notez que nous n'avons pas eu besoin d'écrire de code utilisant `fetch`, ou quelque chose similaire — la donnée est mise à jour automatiquement. Et parce que nous utilisons un élément `<form>`, cette application fonctionne également si JavaScript est désactivé ou indisponbile.

