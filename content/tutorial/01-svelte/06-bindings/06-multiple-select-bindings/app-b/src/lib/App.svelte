<script>
	let scoops = 1;
	let flavours = [];

	const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
</script>

<h2>Nombre de boules</h2>

{#each [1, 2, 3] as number}
	<label>
		<input
			type="radio"
			name="scoops"
			value={number}
			bind:group={scoops}
		/>

		{number} {number === 1 ? 'boule' : 'boules'}
	</label>
{/each}

<h2>Parfums</h2>

<select multiple bind:value={flavours}>
	{#each ['Cookie crémeux', 'Éclats de menthe', 'Vague à la fraise'] as flavour}
		<option>{flavour}</option>
	{/each}
</select>

{#if flavours.length === 0}
	<p>Veuillez choisir au moins un parfum</p>
{:else if flavours.length > scoops}
	<p>Vous ne pouvez pas choisir plus de parfums que de boules !</p>
{:else}
	<p>
		Vous avez commandé {scoops} {scoops === 1 ? 'boule' : 'boules'}
		de {formatter.format(flavours)}
	</p>
{/if}