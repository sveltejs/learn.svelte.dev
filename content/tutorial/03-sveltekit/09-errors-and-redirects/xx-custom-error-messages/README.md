---
title: Personnaliser le message d'erreur
---

La page d'erreur dans l'exercice précédent est plutôt statique. Vous souhaitez peut-être afficher le message d'erreur afin d'inciter les gens à se tourner vers vos canaux de support en cas de problème.

Pour cela, SvelteKit fournit `$page.error` et `$page.status`, qui contiennent des informations à propos de l'erreur et son statut. Ajoutons-le dans `+error.svelte` :

```svelte
/// file: src/routes/+error.svelte
<script>
	+++import { page } from '$app/stores';+++

	let online = typeof navigator !== 'undefined'
		? navigator.onLine
		: true;
</script>

+++{#if $page.status === 404}
	<h1>Page non trouvée</h1>
{:else +++if !online}
	<h1>Vous êtez hors ligne</h1>
{:else}
	<h1>Oups!</h1>
	---<p>Quelque chose s'est mal passé</p>---
	+++<p>{$page.error.message}</p>+++
{/if}
```

C'est mieux, mais `$page.error.message` contient toujours "Internal Error" — comment est-ce possible ? C'est parce que SvelteKit est prudent et vous empêche d'afficher accidentellement des informations sensibles dans un message d'erreur.

Pour personnaliser ce comportement, implémentez le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> `handleError` dans `hooks.server.js` et `hooks.client.js`, qui sont exécutés si une erreur inattendue est levée lors du chargement de données sur le serveur ou le client, respectivement.

```js
// hooks.server.js
export function handleError(+++{ error }+++) {
    ---return { message: 'Internal Error' }; // l'implémentation par défaut de ce hook---
    +++return { message: error instanceof Error ? error.message : 'Internal Error' };+++
}
```

```js
// hooks.client.js
export function handleError(+++{ error }+++) {
    ---return { message: 'Internal Error' }; // l'implémentation par défaut de ce hook---
    +++return { message: error instanceof Error ? error.message : 'Internal Error' };+++
}
```

Vous pourriez aussi envoyer des requêtes vers votre système d'analyse d'erreurs dans ces <span class="vo">[hooks](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span>.

Notez que vous pouvez renvoyer plus qu'un message d'erreur si vous le souhaitez. Tout objet que vous renverrez sera disponible dans `$page.error`, la seule contrainte étant la présence d'un champ `message`. Vous pouvez en apprendre plus sur tout ceci (et comment rendre le tout typé !) dans [le chapitre traitant des erreurs de la documentation](PUBLIC_KIT_SITE_URL/docs/errors).

> Lorsque vous gérez des erreurs, faites attention à ne pas supposer que ce sont des objets `Error`, n'importe quoi peut être levé. Faites également attention à ne pas exposer de la donnée sensible en relayant trop d'informations
