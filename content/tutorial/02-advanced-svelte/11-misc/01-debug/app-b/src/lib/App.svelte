<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

<label>
	<input bind:value={user.firstname} />
	prénom
</label>

<label>
	<input bind:value={user.lastname} />
	nom
</label>

{@debug user}

<h1>Bonjour {user.firstname}!</h1>
