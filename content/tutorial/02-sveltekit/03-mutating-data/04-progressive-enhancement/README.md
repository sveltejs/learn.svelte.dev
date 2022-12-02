---
title: Progressive Enhancement
---

So far, the `<form>` we have built works completely without JavaScript - which is great! If we have JavaScript enabled though ([which may be less often than you think](https://kryogenix.org/code/browser/everyonehasjs.html)), we can provide a better user experience by not reloading the whole page, showing loading animations, and more.

The easiest way to progressively enhance our `<form>` is to add the `enhance` action to it:

```svelte
<script>
	+++import { enhance } from '$app/forms';+++
	export let form;
</script>

<form method="POST" action="?/login" +++use:enhance+++>
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
	<button>Log in</button>
	<button formAction="?/register">Register</button>
</form>
```

And that's all! Now, when JavaScript is enabled, `use:enhance` will emulate the browser-native behaviour, just without the full-page reloads. It will:

- update the `form` property - but only if the action is on the same page you're submitting from. So for example if your form looks like `<form action="/somewhere/else" ..>`, `form` and `$page` will not be updated. This is because in the native form submission case you would be redirected to the page the action is on.
- invalidate all data on a successful response
- navigate to the new page on a redirect response
- render the nearest error page if an error occurs
