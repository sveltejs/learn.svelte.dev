---
title: Liaisons de store
---

Si un <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> est défini comme <span class="vo">[writable](SVELTE_SITE_URL/docs/development#writable)</span> — c'est-à-dire qu'il a une méthode `set` — vous pouvez créer une liaison avec sa valeur, comme vous le feriez avec n'importe quel état local de composant.

Dans cet exemple, nous avons un <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> d'écriture `name` et un store dérivé `greeting`. Modifiez l'élément `<input>` dans le fichier `App.svelte` :

```svelte
/// file: App.svelte
<input +++bind:+++value={$name}>
```

La modification de la valeur de l'`<input>` va maintenant mettre à jour `name` ainsi que toutes ces dépendances.

Nous pouvons aussi assigner directement la valeur d'un <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> à l'intérieur d'un composant. Ajoutez un élément `<button>` après l'élément `<input>` :

```svelte
/// file: App.svelte
<button +++on:click={() => $name += '!'}+++>
	Ajoutez un point d'exclamation !
</button>
```

L'assignation `$name += '!'` est équivalente à `name.set($name + '!')`.
