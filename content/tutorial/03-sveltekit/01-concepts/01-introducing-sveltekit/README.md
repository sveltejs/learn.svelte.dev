---
title: C'est quoi SvelteKit ?
---

Alors que Svelte est un <span class="vo">[framework](SVELTE_SITE_URL/docs/web#framework)</span> pour construire des _composants_, SvelteKit est un framework pour construire des _applications_ (aussi appelé 'metaframework' selon la personne à qui l'on s'adresse) qui résout les problèmes délicats liés à la construction d'un produit prêt à être mis en production :

- Routing
- Rendu côté serveur
- Chargement des données
- Service workers
- TypeScript
- Prerendering
- Application de type <span class="vo">[SPA](SVELTE_SITE_URL/docs/web#spa)</span>
- Création de librairie
- Optimised production builds
- Déploiments chez différents hébergeurs
- ...et bien plus !

Les applications SvelteKit sont rendues côté serveur par défaut (comme les "applications multi-pages" (<span class="vo">[MPA](SVELTE_SITE_URL/docs/web#mpa)</span>) traditionnelles) pour d'excellentes performances de premier chargement de page et de référencement, mais peuvent ensuite passer à une navigation côté client (comme les "applications mono-page" (<span class="vo">[SPA](SVELTE_SITE_URL/docs/web#spa)</span>) modernes) pour éviter de tout recharger inutilement (y compris le code tiers) lorsque l'utilisateur navigue. Elles peuvent fonctionner partout où JavaScript s'exécute, même si - comme nous le verrons - vos utilisateurs n'auront peut-être pas besoin d'exécuter de JavaScript du tout.

Si cela vous semble compliqué, ne vous inquiétez pas : SvelteKit est le <span class="vo">[framework](SVELTE_SITE_URL/docs/web#framework)</span> qui évolue avec vous ! Commencez simplement et ajoutez de nouvelles fonctionnalités au fur et à mesure de vos besoins.

## Structure du projet

Sur la droite, dans l'arborescence des fichiers, vous verrez l'ensemble des fichiers que SvelteKit s'attend à trouver dans un projet.

`package.json` vous sera familier si vous avez déjà travaillé avec Node.js. Il liste les dépendances du projet - y compris `svelte` et `@sveltejs/kit` - et une variété de `scripts` pour interagir avec la <span class="vo">[CLI](SVELTE_SITE_URL/docs/development#cli)</span> de SvelteKit. (Nous lançons actuellement `npm run dev` dans la fenêtre du bas).

> Notez qu'il spécifie également `"type" : "module", ce qui signifie que les fichiers `.js` sont traités comme des modules JavaScript natifs par défaut, plutôt que comme le format CommonJS.

`svelte.config.js` contient la configuration de votre projet. Nous n'avons pas besoin de nous préoccuper de ce fichier pour l'instant, mais si vous êtes curieux, [visitez la documentation](https://kit.svelte.dev/docs/configuration).

`vite.config.js` contient la configuration de [Vite](https://vitejs.dev/). Comme SvelteKit utilise Vite, vous pouvez utiliser les [fonctionnalités de Vite](https://vitejs.dev/guide/features.html) comme le [hot reload](SVELTE_SITE_URL/docs/web#hmr), le support de TypeScript, la gestion des fichiers statiques et ainsi de suite.

`src` est l'endroit où se trouve le code source de votre application. `src/app.html` est votre modèle de page (SvelteKit remplace les chaînes `%sveltekit.head%` et `%sveltekit.body%` avec les éléments appropriés), et `src/routes` définit les [routes](/tutorial/pages) de votre application.

Enfin, `static` contient tous les fichiers statiques (comme `favicon.png` ou `robots.txt`) qui seront inclus lorsque votre application est déployée.
