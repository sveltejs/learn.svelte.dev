---
title: handleError
---

Le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> `handleError` vous permet d'intercepter des erreurs inattendues et de déclencher des comportements, comme alerter un canal Slack ou envoyer de la donnée vers un service de gestion d'erreur.

Comme nous l'avons vu dans un [exercice précédent](error-basics), une erreur est _inattendue_ si elle n'a pas été créée avec l'utilitaire `error` de `@sveltejs/kit`. Cela signifie généralement que votre application a besoin d'être réparée. Le comportement par défaut est d'afficher l'erreur :

```js
/// file: src/hooks.server.js
export function handleError({ event, error }) {
	console.error(error.stack);
}
```

Si vous naviguez vers `/the-bad-place`, vous verrez ceci en action — la page d'erreur est affichée, et si vous ouvrez le terminal (à l'aide du bouton à droite de la barre d'URL), vous verrez le message provenant de `src/routes/the-bad-place/+page.server.js`.

Notez que nous n'affichons _pas_ le message d'erreur aux utilisateurs et utilisatrices, car les messages d'erreur peuvent contenir des informations sensibles qui au mieux vont dérouter une personne lambda, au pire bénéficier à une personne mal intentionnée. À la place, l'objet d'erreur disponible dans votre application — représenté par `$page.error` dans `+error.svelte`, ou `%sveltekit.error%` dans le fichier de secours `src/error.html` — ne contient que ça :

```js
/// no-file
{
	message: 'Internal Error' // ou 'Not Found' pour une 404
}
```

Dans certaines situations, vous pourriez vouloir personnaliser cet objet. Pour faire cela, vous pouvez renvoyer un objet depuis `handleError` :

```js
/// file: src/hooks.server.js
export function handleError({ event, error }) {
	console.error(error.stack);

	return {
		message: 'tout va bien',
		code: 'JEREMYBEARIMY'
	};
}
```

Vous pouvez désormais référencer des propriétés autres que `message` depuis une page d'erreur personnalisée. Créez `src/routes/+errors.svelte` :

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error.message}</p>
<p>code d'erreur: {$page.error.code}</p>
```
