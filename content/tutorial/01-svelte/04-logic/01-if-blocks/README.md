---
title: If blocks
---

HTML doesn't have a way of expressing _logic_, like conditionals and loops. Svelte does.

To conditionally render some markup, we wrap it in an `if` block:

```svelte
/// file: App.svelte
+++{#if user.loggedIn}+++
	<button on:click={toggle}>
		Log out
	</button>
+++{/if}+++

+++{#if !user.loggedIn}+++
	<button on:click={toggle}>
		Log in
	</button>
+++{/if}+++
```

Try it — update the component, and click on the buttons.
