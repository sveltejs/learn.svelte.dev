---
title: Default values
---

Nous pouvons facilement définir des valeurs par défaut pour les <span class="vo">[props](SVELTE_SITE_URL/docs/sveltejs#props)</span> de `Nested.svelte` :

```svelte
/// file: Nested.svelte
<script>
	export let answer +++= 'un mystère'+++;
</script>
```

Si nous ajoutons maintenant un second appel au composant _sans_ la <span class="vo">[props](SVELTE_SITE_URL/docs/sveltejs#props)</span> `answer`, celle-ci prendra la valeur par défaut :

```svelte
/// file: App.svelte
<Nested answer={42}/>
+++<Nested />+++
```
