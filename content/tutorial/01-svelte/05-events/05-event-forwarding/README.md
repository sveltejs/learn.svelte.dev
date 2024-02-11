---
title: Relais d'évènement
---

À la différence des évènements du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, les évènements de composant ne <span class="vo">[bubblent](PUBLIC_SVELTE_SITE_URL/docs/javascript#bubble-capture)</span> pas. Si vous souhaitez écouter un évènement provenant d'un composant profondément imbriqué, les composants intermédiaires doivent _relayer_ l'évènement.

Ici, nous avons les mêmes `App.svelte` et `Inner.svelte` que dans le [chapitre précédent](/tutorial/component-events), mais il y a également le composant `Outer.svelte` qui instancie `<Inner/>`.

Une façon de résoudre le problème est d'ajouter `createEventDispatcher` à `Outer.svelte`, d'écouter l'évènement `message`, et de le gérer via un gestionnaire :

```svelte
/// file: Outer.svelte
<script>
	import Inner from './Inner.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function forward(event) {
		dispatch('message', event.detail);
	}
</script>

<Inner on:message={forward}/>
```

Mais cela fait beaucoup de code à écrire. Svelte nous fournit un raccourci équivalent — une directive d'évènement `on:message` sans valeur signifie "relaye tous les évènements `message`".

```svelte
/// file: Outer.svelte
<script>
	import Inner from './Inner.svelte';
</script>

<Inner +++on:message+++/>
```
