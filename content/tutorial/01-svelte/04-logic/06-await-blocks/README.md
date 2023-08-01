---
title: Blocs await
---

La plupart des applications web doivent gérer de la donnée asynchrone à un moment ou à un autre. Svelte simplifie l'accès aux valeurs des [promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises) en utilisant [`await`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/await) directement dans votre <span class="vo">[markup](SITE_SVELTE/docs/web#markup)</span> :

```svelte
/// file: App.svelte
+++{#await promise}+++
	<p>...en attente</p>
+++{:then number}
	<p>Le nombre est {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}+++
```

> Seulement la `promise` la plus récente est considérée, ce qui implique que vous n'avez pas à vous soucier d'éventuelles <span class="vo">[race conditions](/docs/development#race-condition)</span>.

Si vous savez que votre promesse ne peut pas être rejetée, vous pouvez vous passer du bloc `catch`. Vous pouvez aussi ignorer le premier bloc si vous ne voulez rien afficher tant que la promesse n'est pas résolue :

```svelte
/// no-file
{#await promise then number}
	<p>Le nombre est {number}</p>
{/await}
```
