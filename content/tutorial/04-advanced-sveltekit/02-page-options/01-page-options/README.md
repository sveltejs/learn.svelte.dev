---
title: Bases
---

Dans le chapitre sur le [chargement de données](/tutorial/page-data), nous avons vu comment exporter des fonctions `load` depuis des fichiers `+page.js`, `+page.server.js`, `+layout.js` et `+layout.server.js`. Nous pouvons également exporter plusieurs **options de page** depuis ces modules :

- `ssr` — si les pages doivent être générées sur le serveur ou non
- `csr` — si le client SvelteKit doit être chargé ou non
- `prerender` — s'il faut prégénérer les pages au moment de la compilation, plutôt qu'à chaque requête
- `trailingSlash` — s'il faut retirer, ajouter ou ignorer les <span class="vo">[slashs](PUBLIC_SVELTE_SITE_URL/docs/development#slash)</span> à la fin des URLs

Dans les exercices à venir, nous apprendrons à nous servir de chacune de ces options.

Les options de page peuvent être appliquées aux pages individuellement (si exportées depuis `+page.js` ou `+page.server.js`), ou par groupes de pages (si exportées depuis `+layout.js` ou `layout.server.js`). Pour définir une option pour toute l'application, exportez la depuis le <span class="vo">[layout](PUBLIC_SVELTE_SITE_URL/docs/web#layout)</span> racine. Les layouts et pages enfants écrasent les valeurs d'options définies dans des layouts parents, ce qui vous permet — par exemple — de définir la prégénération statique pour toute votre application tout en la désactivant pour les pages qui ont besoin d'être rendues dynamiquement.

Vous pouvez combiner et mélanger ces options dans différentes sections de votre application — vous pourriez prégénérer vos pages marketing, générer dynamiquement sur le serveur vos pages affichant de la donnée, et traiter vos pages d'administration comme une <span class="vo">[SPA](PUBLIC_SVELTE_SITE_URL/docs/web#spa)</span> générée sur le client. Cela permet à SvelteKit d'être très polyvalent.
