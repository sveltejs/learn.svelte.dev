---
title: Inputs texte
---

De manière générale, la donnée dans une application Svelte circule _de haut en bas_ — un composant parent peut donner des <span class="vo">[DOM](SITE_SVELTE/docs/sveltejs#props)</span> à un composant enfant, un composant peut donner des attributs à un élément, mais pas dans l'autre sens.

Néanmoins, il est parfois pratique de contourner cette règle. Prenez le cas d'un élément `<input>` dans ce composant — nous _pourrions_ ajouter un gestionnaire d'évènement `on:input` qui assignerait la valeur de `name` à `event.target.value`, mais cette méthode rend le code un peu... compliqué. Et c'est encore pire avec les autres éléments de formulaire, vous verrez.

À la place, nous pouvons utiliser la directive `bind:value` :

```svelte
/// file: App.svelte
<input +++bind:+++value={name}>
```

Cela signifie que les changements de valeur de `name` impacteront la valeur de l'`<input>`, mais les changement de valeur de l'`<input>` affecteront également `name`.
