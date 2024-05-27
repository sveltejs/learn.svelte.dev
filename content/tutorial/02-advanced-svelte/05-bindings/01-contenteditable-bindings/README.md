---
title: Contenteditable bindings
---

Elements with a `contenteditable` attribute support `textContent` and `innerHTML` bindings:

```svelte
/// file: App.svelte
<div +++bind:innerHTML={html}+++ contenteditable></div>
```
