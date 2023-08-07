---
title: Blocs each à clé
---

Par défaut, quand vous modifiez la valeur d'un bloc `each`, celui-ci va ajouter et enlever les éléments à la _fin_ du bloc, et mettre à jour les valeurs qui ont changé. cela n'est peut-être pas ce que vous souhaitez.

Ce cas est plus simple à montrer qu'à expliquer. Ouvrez la console du <span class="vo">[REPL](SVELTE_SITE_URL/docs/web#repl)</span> en cliquant sur "Console", puis cliquez sur "Supprimer le premier élément" quelques fois, et notez ce qu'il se passe : le premier composant `<Thing>` n'est pas supprimé, mais plutôt le _dernier_ noeud du <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span>. Puis la valeur `name` dans les noeuds DOM restants est mise à jour, mais pas l'emoji correspondant.

Nous aimerions plutôt supprimer unniquement le premier composant `<Thing>` ainsi que son noeud <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> associé, et laisser les autres inchangés.

Pour faire cela, nous allons spécifier un identifiant unique (une "clé") pour le bloc `each` :

```svelte
/// file: App.svelte
{#each things as thing (+++thing.id+++)}
	<Thing name={thing.name}/>
{/each}
```

Ici, `(thing.id)` est la _clé_, et aide Svelte à déterminer quel noeud <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> changer lorsque le composant se met à jour.

> Vous pouvez utiliser n'importe quel objet en tant que clé, puisque Svelte utilise une [`Map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map) en interne — en d'autres termes, vous pourriez utiliser `(thing)` au lieu de `(thing.id)`. Cependant, utiliser une <span class="vo">[string](SVELTE_SITE_URL/docs/development#string)</span> ou un <span class="vo">[number](SVELTE_SITE_URL/docs/development#number)</span> est généralement plus sécurisé, car l'identité sera persistée sans avoir à vérifier l'identité par référence, par exemple lorsque vous rafraîchissez de la donnée depuis une <span class="vo">[API](SVELTE_SITE_URL/docs/development#api)</span>.
