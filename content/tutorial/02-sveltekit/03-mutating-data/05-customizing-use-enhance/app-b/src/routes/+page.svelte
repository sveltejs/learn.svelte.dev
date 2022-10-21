<script>
	import { enhance } from '$app/forms';
	export let form;
	let submitting = false;
</script>

<p>Please log in</p>

<form
	method="POST"
	action="?/login"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}}
>
	<input name="email" type="email" />
	<input name="password" type="password" />
	{#if form?.message}
		<span>{form?.message}</span>
	{/if}
	<button disabled={submitting}>Log in</button>
	<button
		disabled={submitting}
		formAction="?/register"
	>
		Register
	</button>
</form>
