---
title: page
---

Comme nous l'avons appris [précédemment](writable-stores), les <span class="vo">[stores](SVELTE_SITE_URL/docs/sveltejs#store)</span> Svelte sont un endroit pour stocker de la donnée qui n'appartient pas à un composant particulier.

SvelteKit met à disposition trois <span class="vo">[stores](SVELTE_SITE_URL/docs/sveltejs#store)</span> en lecture seule via le module `$app/stores` — `page`, `navigating` et `updated`. Celui que vous utiliserez le plus souvent est [`page`](KIT_SITE_URL/docs/types#public-types-page), qui fournit de l'information à propos de la page courante :

* `url` — l'[URL](https://developer.mozilla.org/fr/docs/Web/API/URL) de la page courante
* `params` — les [paramètres](params) de la page courante
* `route` — un objet avec une propriété `id` représentant la route courante
* `status` — le code de statut HTTP de la page courante
* `error` — l'objet d'erreur de la page courante, s'il existe (vous en saurez plus sur la gestion d'erreur dans de [futurs](error-basics) [exercices](handleerror))
* `data` — la donnée de la page courante, combinant les valeurs de retour de toutes les fonctions `load`
* `form` — la donnée renvoyée depuis une [action de formulaire](the-form-element)

Comme avec n'importe quel <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span>, vous pouvez référencer sa valeur dans un composant en préfixant son nom avec le symbole `$`. Par exemple, nous pouvons accéder au chemin courant avec `$page.url.pathname` :

```svelte
/// file: src/routes/+layout.svelte
+++<script>
	import { page } from '$app/stores';
</script>+++

<nav>
	<a href="/" +++aria-current={$page.url.pathname === '/'}+++>
		accueil
	</a>

	<a href="/about" +++aria-current={$page.url.pathname === '/about'}+++>
		à propos
	</a>
</nav>

<slot />
```
