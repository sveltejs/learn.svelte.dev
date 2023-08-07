---
title: La directive de transition
---

Nous pouvons créer des interfaces utilisateur plus attrayantes en faisant entrer et sortir les éléments du DOM de manière élégante. Svelte rend ça très simple grâce à la directive `transition`.

Tout d'abord, importez la fonction `fade` depuis `svelte/transition`...

```svelte
/// file: App.svelte
<script>
	+++import { fade } from 'svelte/transition';+++
	let visible = true;
</script>
```

... et ajoutez-là à l'élément `<p>` :

```svelte
/// file: App.svelte
<p +++transition:fade+++>
	Entre et sort en s'estompant
</p>
```
