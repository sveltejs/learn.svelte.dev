---
title: Paramètres des routes
path: /blog
---

Pour créer des routes avec des paramètres dynamiques, utilisez des crochets autour d'un nom de variable valide. Par exemple, un fichier comme `src/routes/blog/[slug]/+page.svelte` créera une route qui correspondra à `/blog/one`, `/blog/two`, `/blog/three` et ainsi de suite.

Créons ce fichier :

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<h1>Article de blog</h1>
```

Nous pouvons maintenant naviguer de la page `/blog` à des articles de blog individuels. Dans le prochain chapitre, nous verrons comment charger leur contenu.

> Plusieurs paramètres de route peuvent apparaître _dans_ un segment d'URL, tant qu'ils sont séparés par au moins un caractère statique : `foo/[bar]x[baz]` est une route valide où `[bar]` et `[baz]` sont des paramètres dynamiques.
