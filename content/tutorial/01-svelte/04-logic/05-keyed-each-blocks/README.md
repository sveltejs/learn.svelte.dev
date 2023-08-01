---
title: Blocs each à clé
---

Par défaut, quand vous modifiez la valeur d'un bloc `each`, celui-ci va ajouter et enlever les noeuds du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span> à la _fin_ du bloc, et mettre à jour les valeurs qui ont changé. cela n'est peut-être pas ce que vous souhaitez.

Ce cas est plus simple à montrer qu'à expliquer. Le composant `<Thing>` définit l'emoji comme une constante lors de l'initialisation, mais le nom est transmis via une props.

1. Le dernier composant est supprimé.
2. La valeur de `name` est ensuite mise à jour dans les noeuds <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span> restants, mais pas l'emoji, qui est fixé lors de la chaque composant `<Thing>` est créé.

Nous aimerions plutôt supprimer unniquement le premier composant `<Thing>` ainsi que son noeud <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span> associé, et laisser les autres inchangés.

Pour faire cela, nous allons spécifier un identifiant unique (une "clé") pour chaque élément du bloc `each` :

```svelte
/// file: App.svelte
{#each things as thing (+++thing.id+++)}
	<Thing name={thing.name}/>
{/each}
```

Ici, `(thing.id)` est la _clé_, et aide Svelte à déterminer quoi mettre à jour lorsque la valeur (de `name` dans l'exemple) est mise à jour.

> Vous pouvez utiliser n'importe quel objet en tant que clé, puisque Svelte utilise une [`Map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map) en interne — en d'autres termes, vous pourriez utiliser `(thing)` au lieu de `(thing.id)`. Cependant, utiliser une <span class="vo">[string](PUBLIC_SVELTE_SITE_URL/docs/development#string)</span> ou un <span class="vo">[number](PUBLIC_SVELTE_SITE_URL/docs/development#number)</span> est généralement plus sécurisé, car l'identité sera persistée sans avoir à vérifier l'identité par référence, par exemple lorsque vous rafraîchissez de la donnée depuis une <span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span>.
