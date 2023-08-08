<script>
	import { fly } from 'svelte/transition';

	let visible = true;
	let status = 'en cours de chargement...';
</script>

<p>statut : {status}</p>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<p transition:fly={{ y: 200, duration: 2000 }}>
		Entre et sort en volant
	</p>
{/if}
