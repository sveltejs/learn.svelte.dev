---
title: <svelte:component>
---

Un composant peut changer de catégorie en utilisant `<svelte:component>`. Dans cet exercice, nous voulons afifcher `RedThing.svelte` si la couleur est `red`, `GreenThing.svelte` si la couleur est `green`, et ainsi de suite.

Nous _pourrions_ faire ça avec une séquence de blocs `if`...

```svelte
/// file: App.svelte
{#if selected.color === 'red'}
	<RedThing/>
{:else if selected.color === 'green'}
	<GreenThing/>
{:else if selected.color === 'blue'}
	<BlueThing/>
{/if}
```

...mais c'est un assez fastidieux. À la place, nous pouvons instancier un seul composant dynamique :

```svelte
/// file: App.svelte
<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option.color}</option>
	{/each}
</select>

+++<svelte:component this={selected.component}/>+++
```

La valeur `this` peut être n'importe quel constructeur de composant, ou une valeur <span class="vo">[falsy](SVELTE_SITE_URL/docs/javascript#falsy-truthy-falsy)</span> — si la valeur est <span class="vo">[falsy](SVELTE_SITE_URL/docs/javascript#falsy-truthy-falsy)</span>, aucun composant n'est rendu.

