---
title: Redirections
---

Nous pouvons aussi utiliser la mécanique de `throw` pour rediriger d'une page vers une autre.

Créez une nouvelle fonction `load` dans `src/routes/a/+page.server.js` :

```js
/// file: src/routes/a/+page.server.js
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(307, '/b');
}
```

Naviguer vers la route `/a` nous emmènera maintenant directement vers la route `/b`.

Vous pouvez `throw redirect(...)` dans les fonctions `load`, les actions de formulaire, les routes d'<span class="vo">[API](SVELTE_SITE_URL/docs/development#api)</span> et le <span class="vo">[hook](SVELTE_SITE_URL/docs/sveltejs#hook)</span> `handle`, que nous verrons dans un prochain chapitre.

Les codes de statut les plus courants sont :

- `303` — pour les action de formulaire, à la suite d'une soumission réussie
- `307` — pour les redirections temporaires
- `308` — pour les redirections permanentes
