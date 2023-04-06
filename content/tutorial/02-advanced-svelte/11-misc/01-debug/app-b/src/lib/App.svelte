<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

<label>
	<input bind:value={user.firstname} />
	first name
</label>

<label>
	<input bind:value={user.lastname} />
	last name
</label>

{@debug user}

<h1>Hello {user.firstname}!</h1>
