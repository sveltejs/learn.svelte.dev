---
title: Évènements de composant
---

Les composants peuvent aussi générer des évènements. Pour cela, ils doivent créer un générateur d'évènements (<span class="vo">[event dispatcher](PUBLIC_SVELTE_SITE_URL/docs/javascript#event-dispatcher)</span>). Modifiez `Inner.svelte` de la façon suivante :

```svelte
/// file: Inner.svelte
<script>
	+++import { createEventDispatcher } from 'svelte';+++

	+++const dispatch = createEventDispatcher();+++

	function sayHello() {
		dispatch('message', {
			text: 'Bonjour !'
		});
	}
</script>
```

> `createEventDispatcher` doit être appelé quand le composant est instancié la première fois — vous ne pouvez pas le faire plus tard, par ex. dans le <span class="vo">[callback](PUBLIC_SVELTE_SITE_URL/docs/development#callback)</span> d'un `setTimeout`. Cela permet de lier `dispatch` à l'instance du composant.

Puis ajouter `on:message` dans `App.svelte`:

```svelte
/// file: App.svelte
<Inner +++on:message={handleMessage}+++ />
```

> Vous pouvez aussi essayer de changer le nom de l'évènement. Par exemple, changer `dispatch('message', {...})` en `dispatch('greet', {...})` dans `Inner.svelte`, puis changez le nom de l'attribut `on:message` en `'on:greet` dans le composant `App.svelte`.
