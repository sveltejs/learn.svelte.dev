---
title: La directive de classe
---

Comme pour tous les autres attributs, vous pouvez spécifier de classes avec un attribut JavaScript. Ici, nous pourrions ajouter une classe `flipped` à la carte :

```svelte
/// file: App.svelte
<button
	class="card +++{flipped ? 'flipped' : ''}+++"
	on:click={() => flipped = !flipped}
>
```

Cela fonctionne comme attendu — si maintenant vous cliquez sur la carte, elle va se retourner.

Nous pouvons toutefois faire mieux. Ajouter ou enlever une classe en fonction d'une condition est tellement courant dans le développement d'interface que Svelte inclut une directive spéciale pour le simplifier :

```svelte
/// file: App.svelte
<button
	class="card"
	+++class:flipped={flipped}+++
	on:click={() => flipped = !flipped}
>
```

La directive signifie "ajoute la classe `flipped` lorsque `flipped` est <span class="vo">[truthy](PUBLIC_SVELTE_SITE_URL/docs/javascript#falsy-truthy-truthy)</span>".
