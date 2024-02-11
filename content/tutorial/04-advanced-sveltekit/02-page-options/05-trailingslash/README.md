---
title: trailingSlash
---

Deux URLs comme `/foo` et `/foo/` peuvent se ressembler, mais sont en vérité différentes. Une URL relative comme `./bar` sera traitée pour pointer vers `/bar` dans le premier cas, et vers `/foo/bar` dans le deuxième, et les moteurs de recherches les traiteront comme des points d'entrée différents, dégradant votre référencement.

Pour simplifier, être approximatif sur ces slashs de fin d'URL (ou <span class="vo">[trailing slashs](PUBLIC_SVELTE_SITE_URL/docs/web#trailing-slash)</span>) est une mauvaise pratique. Par défaut, SvelteKit supprime les trailing slashs, ce qui implique qu'une requête vers `/foo/` sera en réalité redirigée vers `/foo`.

Si à la place vous souhaitez vous assurer qu'un <span class="vo">[trailing slashs](PUBLIC_SVELTE_SITE_URL/docs/web#trailing-slash)</span> est toujours présent, vous pouvez préciser l'option `trailingSlash` en conséquence :

```js
/// file: src/routes/always/+page.server.js
export const trailingSlash = 'always';
```

Pour permettre les deux options (ce n'est pas recommandé !), utilisez la valeur `'ignore'` :

```js
/// file: src/routes/ignore/+page.server.js
export const trailingSlash = 'ignore';
```

La valeur par défaut est `'never'`.

La présence ou l'absence de <span class="vo">[trailing slashs](PUBLIC_SVELTE_SITE_URL/docs/web#trailing-slash)</span> affecte le pré-rendu. Une URL comme `/always/` sera enregistrée sur le disque en tant que `always/index.html` alors qu'une URL comme `/never` sera enregistrée en tant que `never.html`.
