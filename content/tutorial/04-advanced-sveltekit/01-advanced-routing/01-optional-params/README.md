---
title: Optional parameters
---

Congratulations, you've gone through the whole advanced Svelte tutorial! Now let's get to the final chapter - the advanced SvelteKit tutorial. We'll start with optional route parameters.

A route like `[lang]/home` contains a parameter named `lang` which is required. Sometimes it's beneficial to make these parameters optional, so that in this example both `home` and `en/home` point to the same page (right now the former results in a 404 page). You can do that by using optional parameters.

An optional parameter looks like a required parameter with one more bracket pair around it: `[[optional]]`. The variable name inside - in this case `optional` - is available to the `load` function through the `params` object and also through the `$page.params` store.

Make the `[lang]` parameter optional by renaming the folder to `[[lang]]`:

```diff
src/
├ routes/
-│ ├ [lang]/
+│ ├ [[lang]]/
│ │ ├ [home]/
│ │ │ └ +page.svelte
│ ├ +layout.svelte
│ └ +page.svelte
```
