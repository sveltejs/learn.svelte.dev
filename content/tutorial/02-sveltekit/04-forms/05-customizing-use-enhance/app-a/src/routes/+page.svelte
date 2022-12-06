<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<p>Please log in</p>

<form method="POST" action="?/login" use:enhance>
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
	<button formAction="?/register">Register</button
	>
</form>
