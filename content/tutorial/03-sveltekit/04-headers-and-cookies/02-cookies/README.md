---
title: Lire et écrire les cookies
---

La fonction [`setHeaders`](headers) ne peut pas être utilisée avec le <span class="vo">[header](SVELTE_SITE_URL/docs/web#header)</span> `Set-Cookie`. Vous devez à la place utiliser l'<span class="vo">[API](SVELTE_SITE_URL/docs/development#api)</span> `cookies`.

Dans vos fonctions `load`, vous pouvez lire un cookie avec `cookies.get(name, options)` :

```js
/// file: src/routes/+page.server.js
export function load(+++{ cookies }+++) {
	+++const visited = cookies.get('visited');+++

	return {
		visited
	};
}
```

Pour définir un cookie, utilisez `cookies.set(name, value, options)`. Il est fortement recommandé que vous configuriez explicitement le `path` lorsque vous définissez un cookie, car les navigateurs définissent par défaut — et sans réelle raison — les cookies sur le chemin parent du chemin actuel.

```js
/// file: src/routes/+page.server.js
export function load({ cookies }) {
	const visited = cookies.get('visited');

	+++cookies.set('visited', 'true', { path: '/' });+++

	return {
		visited
	};
}
```

Si maintenant vous rechargez l'<span class="vo">[iframe](SVELTE_SITE_URL/docs/web#iframe)</span>, `Bonjour étranger !` devient `Bonjour mon ami !`.

Appeler `cookies.set(name, ...)` implique que le <span class="vo">[header](SVELTE_SITE_URL/docs/web#header)</span> `Set-Cookie` est modifié, mais cela met _également_ à jour le dictionnaire interne de cookies, signifiant que les appels suivants à `cookies.get(name)` durant la même requête renverront la valeur à jour. Sous le capot, l'<span class="vo">[API](SVELTE_SITE_URL/docs/development#api)</span> `cookies` utilise la libraire populaire `cookie` — les options passées à `cookies.get` et `cookies.set` correspondent aux options de `parse` et `serialize` définies dans la [documentation de la libraire `cookie`](https://github.com/jshttp/cookie#api). SvelteKit utilise les valeurs par défaut suivantes pour rendre vos cookies plus sécurisés :

```js
/// no-file
{
	httpOnly: true,
	secure: true,
	sameSite: 'lax'
}
```
