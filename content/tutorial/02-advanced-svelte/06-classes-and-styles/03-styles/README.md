---
title: La directive de style
---

Comme pour `class`, vous pouvez écrirer vos attributs `style` directement en ligne, car écrire du Svelte revient à écrire du HTML un peu stylé :

```svelte
/// file: App.svelte
<button
	class="card"
	+++style="transform: {flipped ? 'rotateY(0)' : ''}; --bg-1: palegoldenrod; --bg-2: black; --bg-3: goldenrod"+++
	on:click={() => flipped = !flipped}
>
```

Quand vous avez beaucoup de styles, cela peut commencer à devenir brouillon. Nous pouvons ranger un peu en utilisant la directive `style:` :

```svelte
/// file: App.svelte
<button
	class="card"
+++	style:transform={flipped ? 'rotateY(0)' : ''}
	style:--bg-1="palegoldenrod"
	style:--bg-2="black"
	style:--bg-3="goldenrod"+++
	on:click={() => flipped = !flipped}
>
```
