---
title: Layouts
---

Les différentes routes de votre application partageront souvent une interface utilisateur commune. Au lieu de la répéter dans chaque composant `+page.svelte`, nous pouvons utiliser un composant `+layout.svelte` qui s'applique à toutes les routes dans le même répertoire.

Dans cette application, nous avons deux routes, `src/routes/+page.svelte` et `src/routes/about/+page.svelte`, qui contiennent la même interface de navigation. Créons un nouveau fichier, `src/routes/+layout.svelte`...

```
src/routes/
├ about/
│ └ +page.svelte
+++├ +layout.svelte+++
└ +page.svelte
```

...et déplacez le contenu dupliqué des fichiers `+page.svelte` dans le nouveau fichier `+layout.svelte`. L'élément `<slot />` est l'endroit où le contenu de la page sera rendu :

```svelte
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">Accueil</a>
	<a href="/about">À propos</a>
</nav>

<slot />
```

Un fichier `+layout.svelte` s'applique à chaque route enfant, y compris la `+page.svelte` sœur (si elle existe). Vous pouvez imbriquer autant de layouts que vous le souhaitez.
