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
	<button disabled={submitting}>Log in</button>
	<button
		disabled={submitting}
		formAction="?/register"
	>
		Register
	</button>
</form>
