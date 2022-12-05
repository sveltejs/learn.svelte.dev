<script>
	let user = {};

	async function getUser() {
		const response = await fetch('/api/user');
		user = await response.json();
	}
</script>

<button on:click={getUser}>Get User</button>

<span>User Info:</span>
<pre>
    {JSON.stringify(user, null, 2)}
</pre>
