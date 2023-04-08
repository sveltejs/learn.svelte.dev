---
title: Named slots
---

The previous example contained a _default slot_, which renders the direct children of a component. Sometimes you will need more control over placement. In those cases, we can use _named slots_.

Inside the `<Card>` component, we've got `<span slot="telephone">` and others for `company` and `address`. Let's add the corresponding named slots in `Card.svelte`:

```svelte
/// file: Card.svelte
<div class="card">
+++	<header>
		<slot name="telephone" />
		<slot name="company" />
	</header>+++

	<slot />
		
+++	<footer>
		<slot name="address" />
	</footer>+++
</div>
```

We need to add some styles to the `<small>` element in `App.svelte` so that it occupies its own line. The contents of `<Card>` inherit styles from `Card.svelte`, such as `font-family` (the lettering is something called ['Silian Rail'](https://www.youtube.com/watch?v=aZVkW9p-cCU)), but normal scoping rules apply — we need to add the styles to `App.svelte` because that's where the element is:

```svelte
/// file: App.svelte
<style>
	main {
		display: grid;
		place-items: center;
		height: 100%;
		background: url(./wood.svg);
	}

+++	small {
		display: block;
		font-size: 0.6em;
		text-align: right;
	}+++
</style>
```

Alternatively, we could use the `:global` modifier inside `Card.svelte` to target all `small` elements inside `.card`:

```svelte
/// file: Card.svelte
<style>
	/* ... */ 

	+++.card :global(small) {
		display: block;
		font-size: 0.6em;
		text-align: right;
	}+++
</style>
```