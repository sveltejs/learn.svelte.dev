---
title: Page de secours
---

Si les choses tournent _vraiment_ mal — une erreur pendant le chargement du <span class="vo">[layout](SVELTE_SITE_URL/docs/web#layout)</span> racine, ou pendant le rendu de la page d'erreur — SvelteKit se rabattra sur une page d'erreur statique de secours.

Ajoutez un nouveau fichier `src/routes/+layout.server.js` pour voir ceci en action :

```js
/// file: src/routes/+layout.server.js
export function load() {
	throw new Error('beurk');
}
```

Vous pouvez personnaliser la page d'erreur de secours. Créer un fichier `src/error.html` :

```html
/// file: src/error.html
<h1>Perdu</h1>
<p>Code %sveltekit.status%</p>
<p>%sveltekit.error.message%</p>
```

Ce fichier peut inclure les choses suivantes :
- `%sveltekit.status%` — le code HTTP
- `%sveltekit.error.message%` — le message d'erreur
