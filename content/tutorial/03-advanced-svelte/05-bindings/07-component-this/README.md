---
title: Binding to component instances
---

Just as you can bind to DOM elements, you can bind to component instances themselves. For example, we can bind the instance of `<InputField>` to a variable named `field` in the same way we did when binding DOM Elements

```svelte
/// file: App.svelte
<script>
	import InputField from './InputField.svelte';

	+++let field;+++
</script>

<InputField +++bind:this={field}+++ />
```

Now we can programmatically interact with this component using `field`.

```svelte
/// file: App.svelte
<button +++on:click={() => field.focus()}+++>
	Focus field
</button>
```

> Note that we can't do `{field.focus}` since `field` is undefined when the button is first rendered.
