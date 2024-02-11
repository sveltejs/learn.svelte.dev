---
title: In et out
---

Un élément peut avoir une directive `in` ou `out`, ou les deux à la fois, à la place de la directive `transition`. Importez `fade` en plus de `fly`...

```js
/// file: App.svelte
import { +++fade+++, fly } from 'svelte/transition';
```

...puis remplacez la directive `transition` par deux directives `in` et `out` distinctes :

```svelte
/// file: App.svelte
<p +++in+++:fly={{ y: 200, duration: 2000 }} +++out:fade+++>
	Entre en volant, +++sort en s'estompant+++
</p>
```

Dans ce cas, les transitions ne sont _pas_ réversibles.
