---
title: Pages
---

SvelteKit utilise un <span class='vo'>[routing](SVELTE_SITE_URL/docs/web#routing)</span> basé sur l’arborescence de fichiers. Cela signifie que chaque _route_ (page affichée pour une URL donnée) de votre application seront définies par les répertoires de votre code.

Chaque fichier `+page.svelte` dans le dossier `src/routes` crée une page de votre application. Dans cette application, nous avons actuellement une page — `src/routes/+page.svelte`, qui correspond à `/`. Si nous naviguons sur `/about`, nous verrons une erreur "404 Not Found".

Corrigeons cela. Ajoutez une seconde page, `src/routes/about/+page.svelte`, copiez le contenu de `src/routes/+page.svelte`, et mettez-la à jour :

```svelte
/// file: src/routes/about/+page.svelte
<nav>
	<a href="/">Accueil</a>
	<a href="/about">À propos</a>
</nav>

<h1>+++À propos+++</h1>
<p>Cette page est la page +++à propos+++.</p>
```

Nous pouvons maintenant naviguer entre `/` et `/about`.

> Contrairement aux applications multi-pages traditionnelles, naviguer vers `/about` et revenir met à jour le contenu de la page actuelle, comme une application à page unique. Cela nous donne le meilleur des deux mondes - un démarrage rapide avec le rendu côté serveur, puis une navigation instantanée (ce comportement peut être [configuré](https://kit.svelte.dev/docs/page-options)).
