---
title: La directive animate
---

Dans le [chapitre précédent](/tutorial/deferred-transitions), nous avons utilisé des transitions retardées pour créer l'illusion du mouvement lorsque des éléments se déplacent d'une liste vers une autre.

Pour parfaire l'illusion, nous avons aussi besoin d'appliquer du mouvement sur les éléments qui ne transitionnent _pas_. Pour cela, il faut utiliser la directive `animate`.

D'abord, importez la fonction `flip` — "flip" est l'acronyme de ['First, Last, Invert, Play'](https://aerotwist.com/blog/flip-your-animations/) — depuis `svelte/animate` :

```svelte
/// file: TodoList.svelte
<script>
	+++import { flip } from 'svelte/animate';+++
	import { send, receive } from './transition.js';

	export let store;
	export let done;
</script>
```

Puis ajoutez le aux éléments `<li>` :

```svelte
/// file: TodoList.svelte
<li
	class:done
	in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
	+++animate:flip+++
>
```

Le mouvement est un peu lent dans ce cas, nous allons donc ajouter un paramètre `duration` :

```svelte
/// file: TodoList.svelte
<li
	class:done
	in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
	animate:flip+++={{ duration: 200 }}+++
>
```

> `duration` peut aussi être une fonction `d => milliseconds`, où `d` est le nombre de pixels que l'élément a à parcourir.

Notez que toutes les transitions et animations sont appliquées en CSS, plutôt qu'en JavaScript, ce qui veut dire qu'elles ne bloquent pas (ou ne sont pas bloquées par) le <span class="vo">[thread](PUBLIC_SVELTE_SITE_URL/docs/development#thread)</span> principal.
