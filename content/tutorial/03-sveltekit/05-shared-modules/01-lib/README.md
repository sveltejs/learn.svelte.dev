---
title: L'alias $lib
---

Parce que SvelteKit utilise un <span class="vo">[routing](SVELTE_SITE_URL/docs/web#routing)</span> basé sur l'architecture de dossiers, il est aisé de placer les modules et les composants au niveau des routes qui les utilisent. Une bonne pratique est de "mettre le code là où il est utilisé".

Parfois, du code est utilisé à plusieurs endroits. Lorsque cela arrive, il est pratique d'avoir un endroit pour le ranger qui soit accessible par toutes les routes sans avoir besoin de préfixer les imports par `../../../..`. Dans SvelteKit, cet endroit est le dossier `src/lib`. Tout ce qui se trouve dans ce dossier est accessible par tous les modules dans `src` via l'alias `$lib`.

Les deux fichiers `+page.svelte` de cet exercice importent `src/lib/message.js`. Mais si vous naviguez vers `/a/deeply/nested/route`, l'application casse, parce que le préfixe est mal défini. Mettez le à jour pour utiliser `$lib/message.js` à la place :

```svelte
/// file: src/routes/a/deeply/nested/route/+page.svelte
<script>
	import { message } from +++'$lib/message.js'+++;
</script>

<h1>une route très profonde</h1>
<p>{message}</p>
```

Faites la même chose pour `src/routes/+page.svelte` :

```svelte
/// file: src/routes/+page.svelte
<script>
	import { message } from +++'$lib/message.js'+++;
</script>

<h1>accueil</h1>
<p>{message}</p>
```
