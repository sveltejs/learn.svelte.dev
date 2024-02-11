---
title: Abonnements automatiques
---

L'application de l'exemple précédent fonctionne, mais il y a un bug subtil — on s'abonne bien au <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span>, mais on ne s'en désabonne jamais. Si le composant était instancié et détruit plusieurs fois, cela conduirait à une _fuite de mémoire_.

Commençons par déclarer `unsubscribe` dans `App.svelte` :

```js
/// file: App.svelte
+++const unsubscribe =+++ count.subscribe((value) => {
	count_value = value;
});
```

> La méthode `subscribe` retourne une fonction `unsubscribe` quand on l'exécute.

Vous avez maintenant déclaré `unsubscribe`, mais vous avez toujours besoin de l'exécuter, par exemple grâce à la méthode de cycle de vie `onDestroy` :

```svelte
/// file: App.svelte
<script>
	+++import { onDestroy } from 'svelte';+++
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';

	let count_value;

	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});

	+++onDestroy(unsubscribe);+++
</script>

<h1>Le compteur vaut {count_value}</h1>
```

Mais le code commence à devenir complexe, particulièrement si votre composant s'abonne à plusieurs <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span>.
Heureusement, Svelte a un atout dans sa manche — vous pouvez référencer la valeur d'un store en préfixant le nom du store avec `$` :

```svelte
/// file: App.svelte
<script>
	---import { onDestroy } from 'svelte';---
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';

	---let count_value;---

	---const unsubscribe = count.subscribe(value => {
		count_value = value;
	});---

	---onDestroy(unsubscribe);---
</script>

<h1>Le compteur vaut {+++$count+++}</h1>
```

> Les abonnements automatiques ne marchent qu'avec des variables de <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span> déclarées (ou importées) au niveau racine d'un composant.

Vous n'êtes pas non plus limité•e•s à utiliser `$count` dans le <span class="vo">[markup](PUBLIC_SVELTE_SITE_URL/docs/web#markup)</span> — vous pouvez également vous servir n'importe où dans le `<script>`, par exemple dans des gestionnaires d'évènement ou des déclarations réactives.

> Les noms commençant par `$` sont supposés faire référence à une valeur de store. C'est un caractère réservé — Svelte vous empêchera de déclarer vos propres variables avec le préfixe `$`.
