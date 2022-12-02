---
title: Customizing `use:enhance`
---

In the last chapter we have seen how to progressively enhance our `<form>` by adding the `enhance` action to it, which enables the native form behavior just without the full page reload. We can further customize the submission experience by adding a custom callback to the `enhance` action. Let's do that by disabling the buttons while an action is in progress:

```svelte
<script>
	import { enhance } from '$app/forms';
	export let form;
	+++let submitting = false;+++
</script>

<form method="POST" action="?/login" use:enhance+++={() => {
	submitting = true;
	return async ({ update }) => {
		await update();
		submitting = false;
	}
}}+++>
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	{#if form?.message}
		<span>{form?.message}</span>
	{/if}
	<button +++disabled={submitting}+++>Log in</button>
	<button +++disabled={submitting}+++ formAction="?/register">Register</button>
</form>
```

`submitting = true` is set as soon as the user presses on of the buttons. The returned callback function is called as soon as the form submission was processed by the server and a response was returned. We call the `update` function to get the native browser behavior without the reloads (updating the `form` prop and so on) and set `submitting` to `false` afterwards.

> `use:enhance` provides a range of properties which makes it very customizable. You can also abort submissions by calling a `cancel` function for example. Play around with it a little to see what's possible!
