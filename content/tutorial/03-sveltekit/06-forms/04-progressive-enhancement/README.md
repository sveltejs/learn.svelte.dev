---
title: Amélioration progressive
---

Parce que nous utilisons des éléments `<form>`, notre application fonctionne même si les utilisateurs et utilisatrices n'ont pas JavaScript, [ce qui arrive plus souvent que vous ne le pensez](https://kryogenix.org/code/browser/everyonehasjs.html) (en anglais). C'est super, car cela signifie que notre application est résiliente.

La plupart du temps, les gens _ont_ JavaScript. Dans ce cas-là, nous pouvons _améliorer progressivement_ l'expérience de la même façon que SvelteKit améliore progressivement l'expérience des éléments `<a>` en utilisant la navigation côté client.

Importez la fonction `enhance` depuis `$app/forms`...

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { enhance } from '$app/forms';+++

	export let data;
	export let form;
</script>
```

...et ajoutez la directive `use:enhance` aux éléments `<form>` :

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/create" +++use:enhance+++>
```

```svelte
/// file: src/routes/+page.svelte
<form method="POST" action="?/delete" +++use:enhance+++>
```

Et c'est tout ! Désormais, lorsque JavaScript est disponible, `use:enhance` va émuler le comportement natif du navigateur sauf pour le rechargement complet de la page. Il va donc :

- mettre à jour la <span class="vo">[prop](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span> `form`
- invalider toute la donnée si la soumission est réussie, ce qui va rejouer la fonction `load`
- naviguer vers la nouvelle page si la réponse est une redirection
- afficher la page d'erreur la plus proche si une erreur se produit

Maintenant que nous mettons la page à jour plutôt que la recharger, nous pouvons faire des choses rigolotes comme des transitions :

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { fly, slide } from 'svelte/transition';+++
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>
```

```svelte
/// file: src/routes/+page.svelte
<li +++in:fly={{ y: 20 }} out:slide+++>...</li>
```
