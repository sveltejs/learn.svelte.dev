---
title: Pages d'erreur
---

Lorsque quelque chose se passe mal dans une fonction `load`, SvelteKit affiche une page d'erreur.

La page d'erreur par défaut est quelque peu fade. Nous pouvons la personnaliser en créant un composant `src/routes/+error.svelte` :

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/stores';
	import { emojis } from './emojis.js';
</script>

<h1>{$page.status} {$page.error.message}</h1>
<span style="font-size: 10em">
	{emojis[$page.status] ?? emojis[500]}
</span>
```

Remarquez que le composant `+error.svelte` est rendu à l'intérieur du `+layout.svelte` racine. Nous pouvons créer des frontières `+error.svelte` plus granulaires :

```svelte
/// file: src/routes/expected/+error.svelte
<h1>cette erreur est attendue</h1>
```

Ce composant sera rendu pour la route `/expected`, tandis que la page `src/routes/+error.svelte` sera rendue pour toute autre erreur.
