---
title: prerender
---

Le pré-rendu (ou <span class="vo">[prerendering](PUBLIC_SVELTE_SITE_URL/docs/web#prerendering)</span>) signifie générer du HTML pour une page une seule fois, au moment de la compilation, plutôt que dynamiquement à chaque requête.

L'avantage est que servir des pages affichant de la donnée statique est extrêmement peu cher et très performant, ce qui vous permet facilement de servir un grand nombre d'utilisateurs et d'utilisatrices sans vous soucier des <span class="vo">[headers](PUBLIC_SVELTE_SITE_URL/docs/web#header)</span> `cache-control` (qu'il est facile de mal utiliser).

La contrepartie est que le processus de compilation est plus long, et que le contenu peut seulement être mis-à-jour en recompilant puis déployant une nouvelle version de l'application.

Pour pré-rendre une page, mettez `prerender` à `true` :

```js
/// file: src/routes/+page.server.js
export const prerender = true;
```

Dans ce tutoriel, ceci n'aura aucun effet observable, puisque l'application est exécutée en mode de dévelopement (`dev` mode).

Toutes les pages ne peuvent pas être pré-rendues. La règle de base est la suivante : pour que le contenu puisse être pré-rendu, deux personnes accédant à la page directement doivent voir le même contenu arriver du serveur, et la page ne doit pas contenir d'action de formulaire. Les pages avec des paramètres de route dynamiques peuvent être pré-rendues tant qu'elles sont déclarées avec l'option de configuration [`prerender.entries`](PUBLIC_KIT_SITE_URL/docs/configuration#prerender) ou qu'elles sont accessibles en suivant des liens depuis des pages qui _sont_ dans `prerender.entries`.

> Mettre `prerender` à `true` dans votre `+layout.server.js` racine transforme l'intégralité de votre application en un générateur de site statique (<span class="vo">[Static Site Generator](PUBLIC_SVELTE_SITE_URL/docs/web#ssg)</span>).
