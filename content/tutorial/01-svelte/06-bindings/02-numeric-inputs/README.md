---
title: Inputs numériques
---

Dans le <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, tout est une chaîne de caractères. Cela est particulièrement peu pratique lorsque vous avez à faire à des `<input>` numériques — `type=number` et `type=range` — puisque vous devez vous rappeler de transformer `input.value` avant de vous en servir.

Avec `bind:value`, Svelte s'en occupe pour vous :

```svelte
/// file: App.svelte
<label>
	<input type="number" +++bind:+++value={a} min="0" max="10" />
	<input type="range" +++bind:+++value={a} min="0" max="10" />
</label>

<label>
	<input type="number" +++bind:+++value={b} min="0" max="10" />
	<input type="range" +++bind:+++value={b} min="0" max="10" />
</label>
```
