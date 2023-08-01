---
title: Définir les headers
---

Dans une fonction `load` (ainsi que dans les [actions de formulaire](the-form-element), les [hooks](handle) et les [routes d'API](get-handlers), que nous étudierons plus tard), vous avez accès à une fonction `setHeaders`, qui — sans grande surprise — permet de définir les <span class="vo">[headers](PUBLIC_SVELTE_SITE_URL/docs/web#header)</span> de réponse.

Le plus souvent, vous vous en servirez pour personnaliser le comportement de cache avec le <span class="vo">[header](PUBLIC_SVELTE_SITE_URL/docs/web#header)</span> de réponse [`Cache-Control`](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Cache-Control), mais dans le cadre de ce tutoriel, nous allons faire quelque chose de moins recommandé et donc plus dramatique :

```js
/// file: src/routes/+page.server.js
export function load(+++{ setHeaders }+++) {
+++	setHeaders({
		'Content-Type': 'text/plain'
	});+++
}
```

(Il se peut que vous deviez recharger l'<span class="vo">[iframe](PUBLIC_SVELTE_SITE_URL/docs/web#iframe)</span> pour en voir l'effet.)
