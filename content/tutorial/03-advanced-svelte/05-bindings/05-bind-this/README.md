---
title: This
---

The readonly [`this`]($docs#template-syntax-element-directives-bind-this) binding applies to every element ([and component]($docs#template-syntax-component-directives-bind-this)) and allows you to obtain a reference to rendered elements. For example, we can get a reference to a `<canvas>` element:

```svelte
<canvas
	bind:this={canvas}
	width={32}
	height={32}
></canvas>
```

Note that the value of `canvas` will be `undefined` until the component has mounted, so we put the logic inside the `onMount` [lifecycle function](/tutorial/onmount).
