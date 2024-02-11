---
title: Bases
---

Il y a deux types d'erreurs dans SvelteKit — les erreurs _attendues_ et les erreurs _inattendues_.

Une erreur attendue est une erreur créée avec la fonction utilitaire [`error`](PUBLIC_KIT_SITE_URL/docs/modules#sveltejs-kit-error) de `@sveltejs/kit`, comme dans `src/routes/expected/+page.server.js` :

```js
/// file: src/routes/expected/+page.server.js
import { error } from '@sveltejs/kit';

export function load() {
	throw error(420, 'Gardez votre calme !');
}
```

Toute autre erreur — comme celle dans `src/routes/unexpected/+page.server.js` — est considérée comme inattendue :

```js
/// file: src/routes/unexpected/+page.server.js
export function load() {
	throw new Error('Boum !');
}
```

Lorsque vous levez une erreur attendue, vous dites à SvelteKit "ne t'en fais pas, je sais ce que je fais". À l'inverse, une erreur inattendue est interprétée comme un <span class="vo">[bug](PUBLIC_SVELTE_SITE_URL/docs/development#bug)</span> de votre application. Quand une erreur inattendue est levée, son message et sa <span class="vo">[stack trace](PUBLIC_SVELTE_SITE_URL/docs/development#stack)</span> seront affichées dans la console.

> Dans un prochain chapitre, nous verrons comment personnaliser la gestion des erreurs en utilisant le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span>
`handleError`.

Si vous cliquez sur les liens de cette application, vous remarquerez une différence importante : le message de l'erreur attendue est affiché à l'utilisateur, tandis que le message de l'erreur inattendue est remplacé par un message générique "Internal Error" et un code 500. Il est courant de faire cela car les messages d'erreur peuvent contenir des données sensibles.
