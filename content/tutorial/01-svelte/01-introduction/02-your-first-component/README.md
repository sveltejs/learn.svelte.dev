---
title: Votre premier composant
---

En Svelte, une application est composée d'un ou plusieurs _composants_. Un composant est un
In Svelte, an application is composed from one or more _components_. Un composant est un bloc de code autonome réutilisable qui encapsule du HTML, du CSS et du JavaScript qui vont ensemble, écrit dans un fichier `.svelte`. Le fichier `App.svelte`, ouvert dans l'éditeur de code à droite, est un composant simple.

## Ajouter de la donnée

Un composant qui se contente d'afficher du <span class="vo">[markup](SVELTE_SITE_URL/docs/web#markup)</span> statique n'est pas très intéressant. Ajoutons-lui de la donnée.

D'abord, ajoutez une balise `<script>` à votre composant, et déclarez une variable `name` :

```svelte
/// file: App.svelte
+++<script>
	let name = 'Svelte';
</script>+++

<h1>Bonjour tout le monde !</h1>
```

Puis, vous pouvez utilisez `name` dans le <span class="vo">[markup](SVELTE_SITE_URL/docs/web#markup)</span> :

```svelte
/// file: App.svelte
<h1>Bonjour +++{name}+++!</h1>
```

À l'intérieur des accolades, il est possible d'utiliser n'importe quelle expression JavaScript. Essayez de remplacer `name` par `name.toUpperCase()` pour un accueil plus bruyant.

```svelte
/// file: App.svelte
<h1>Bonjour {name+++.toUpperCase()+++}!</h1>
```
