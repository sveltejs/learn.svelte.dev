---
title: Blocs each
---

Lorsque vous construisez des interfaces utilisateur, vous vous retrouvez souvent à travailler avec des listes de données. Dans cet exercice, nous avons répété le balisage `<button>` plusieurs fois - en changeant la couleur à chaque fois - mais il y a encore des choses à faire.

Au lieu de copier, coller et éditer laborieusement, nous pouvons nous supprimer tous les boutons sauf le premier, puis utiliser un bloc `each` :

```svelte
/// file: App.svelte
<div>
	+++{#each colors as color}+++
		<button
			aria-current={selected === 'red'}
			aria-label="red"
			style="background: red"
			on:click={() => selected = 'red'}
		></button>
	+++{/each}+++
</div>
```

> L'expression (`colors`, dans ce cas) peut être n'importe quel tableau ou objet assimilable à un tableau (c'est à dire qu'il a une propriété `length`). Vous pouvez boucler sur des itérables génériques avec `each [...iterable]`.

Nous devons maintenant utiliser la variable `color` à la place de `"red"` :

```svelte
/// file: App.svelte
<div>
	{#each colors as color}
		<button
			aria-current={selected === +++color+++}
			aria-label=+++{color}+++
			style="background: +++{color}+++"
			on:click={() => selected = +++color+++}
		></button>
	{/each}
</div>
```

Vous pouvez accéder à l'_indice_ courant en deuxième argument, comme ceci :

```svelte
/// file: App.svelte
<div>
	{#each colors as color, +++i}+++
		<button
			aria-current={selected === color}
			aria-label={color}
			style="background: {color}"
			on:click={() => selected = color}
		>+++{i + 1}+++</button>
	{/each}
</div>
```
