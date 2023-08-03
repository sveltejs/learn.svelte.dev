---
title: Inputs checkbox 
---

Les checkbox servent à inverser des états. Au lieu de créer une liaison sur `input.value`, nous en créons une sur `input.checked` :

```svelte
/// file: App.svelte
<input type="checkbox" +++bind:+++checked={yes}>
```
