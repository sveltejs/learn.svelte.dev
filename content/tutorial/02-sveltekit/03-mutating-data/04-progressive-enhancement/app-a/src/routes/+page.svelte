<script>
	export let form;
</script>

<p>Please log in</p>

<form method="POST" action="?/login">
	<input name="email" type="email" />
	<input name="password" type="password" />
	{#if form?.message}
		<span>{form?.message}</span>
	{/if}
	<button>Log in</button>
	<button formAction="?/register">Register</button
	>
</form>
