---
title: csr
---

Le rendu côté client est ce qui rend une page interactive – comme incrémenter un compteur lorsque vous cliquez ur le bouton de cette application — et permet à SvelteKit de mettre à jour la page lors des navigations sans recharger complètement la page.

Comme avec `ssr`, vous pouvez désactiver le rendu côté client de cette manière :

```js
/// file: src/routes/+page.server.js
export const csr = false;
```

Cela signifie qu'aucun JavaScript ne sera envoyé au client, mais cela signifie également que vos composants ne seront plus interactifs. Cela peut être pratique pour vérifier si votre application est utilisable par des personnes qui — quelqu'en soit la raison — ne peuvent pas utiliser JavaScript.
