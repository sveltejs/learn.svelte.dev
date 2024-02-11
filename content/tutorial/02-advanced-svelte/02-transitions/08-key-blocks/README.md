---
title: Les blocs key
---

Les blocs `key` détruisent et recréent leur contenu lorsque la valeur d'une expression change. C'est utile lorsque vous voulez qu'un élément joue sa transition à chaque fois qu'une valeur change plutôt qu'uniquement quand l'élément entre ou sort du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>.

Ici, nous aimerions jouer la transition `typewriter` de `transition.js` à chaque fois que le message de chargement change (c'est à dire `i`). Enveloppez l'élément `<p>` dans un bloc clé :

```svelte
/// file: App.svelte
+++{#key i}+++
	<p in:typewriter={{ speed: 10 }}>
		{messages[i] || ''}
	</p>
+++{/key}+++
```
