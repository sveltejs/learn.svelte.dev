<script>
	export let form;
</script>

<form method="POST">
	<input name="email" type="email" />
	<input name="password" type="password" />
	{#if form?.message}
		<span>{form?.message}</span>
	{/if}
	<button>Log in</button>
</form>
