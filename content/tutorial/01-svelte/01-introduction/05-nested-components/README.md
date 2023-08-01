---
title: Composants imbriqués
---

Écrire toute une application dans un seul composant n'est pas très pratique. À la place, nous pouvons importer des composants depuis d'autres fichiers et les utiliser comme des éléments.

Ajoutons une balise `<script>` à `App.svelte` pour importer le fichier (notre composant) `Nested.svelte` dans notre application...

```svelte
/// file: App.svelte
+++<script>
	import Nested from './Nested.svelte';
</script>+++
```

... puis utilisons le composant `Nested` dans le <span class="vo">[markup](SITE_SVELTE/docs/web#markup)</span> de l'application :

```svelte
/// file: App.svelte
<p>Ceci est un paragraphe.</p>
+++<Nested />+++
```

Notez que même si `Nested.svelte` a un élément `<p>`, les styles définis dans `App.svelte` ne s'appliquent pas.

Notez également que le nom du composant, `Nested`, a sa première lettre en majuscule. C'est une convention adoptée pour mieux différencier entre les composants, que nous définissons, des éléments HTML classiques.
