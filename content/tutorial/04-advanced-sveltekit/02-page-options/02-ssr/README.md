---
title: ssr
---

Le rendu côté serveur (<span class="vo">[SSR](PUBLIC_SVELTE_SITE_URL/docs/web#ssr)</span>) est le processus de génération de HTML sur le serveur, et est le comportement par défaut de SvelteKit. Il est important pour la performance et la [résilience](https://kryogenix.org/code/browser/everyonehasjs.html) (en anglais), et est très bénéfique pour votre référencement (SEO) — bien que certains moteurs de recherche soient capables d'indexer du contenu généré par le navigateur avec JavaScript, cela arrive rarement et de manière moins fiable.

Cela étant dit, certains composants _ne peuvent pas_ être générés sur le serveur, peut-être parce qu'ils ont besoin d'accéder immédiatement à certaines variables globales du navigateur comme `window`. Si possible, vous devriez modifier ces composants afin qu'ils _puissent_ être générés sur le serveur, mais si c'est impossible, vous pouvez désactiver le <span class="vo">[SSR](PUBLIC_SVELTE_SITE_URL/docs/web#ssr)</span> :

```js
/// file: src/routes/+page.server.js
export const ssr = false;
```

> Définir `ssr` à `false` dans votre fichier `+layout.server.js` racine transforme l'intégralité de votre application en une [Single-Page Application (SPA)](PUBLIC_SVELTE_SITE_URL/docs/web#spa).
