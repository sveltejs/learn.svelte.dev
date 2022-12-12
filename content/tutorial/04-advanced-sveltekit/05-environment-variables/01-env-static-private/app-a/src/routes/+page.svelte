<script>
	export let form;
</script>

<form method="POST">
	<label>
		enter the passphrase
		<input name="passphrase" />
	</label>
</form>

{#if form?.incorrect}
	<p class="error">wrong passphrase!</p>
{/if}

<style>
	.error {
		color: red;
	}
</style>
