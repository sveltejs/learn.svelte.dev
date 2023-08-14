---
title: Liaisons contenteditable
---

Les éléments avec l'attribut `contenteditable` permettent les liaisons avec [`innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML), [`innerText`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/innerText) et [`textContent`](https://developer.mozilla.org/fr/docs/Web/API/Node/textContent) :

```svelte
/// file: App.svelte
<div +++bind:innerHTML={html}+++ contenteditable />
```
