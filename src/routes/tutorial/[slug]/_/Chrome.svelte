<script>
	import { createEventDispatcher } from 'svelte';
	import refresh from './refresh.svg';

	/** @type {string} */
	export let path;

	const dispatch = createEventDispatcher();
</script>

<div class="chrome">
	<button on:click={() => dispatch('refresh')} aria-label="reload">
		<img src={refresh} alt="Reload icon" />
	</button>

	<input
		aria-label="URL"
		value={path}
		on:change={(e) => {
			dispatch('change', { value: e.currentTarget.value });
		}}
	/>
</div>

<style>
	.chrome {
		width: 100%;
		height: 4rem;
		display: flex;
		gap: 0.5rem;
		padding: 0.4rem;
		background: #f9f9f9;
	}

	.chrome button {
		padding: 0.5rem;
	}

	.chrome button img {
		height: 100%;
		width: auto;
		transition: 0.2s ease-out;
		transform: none;
	}

	.chrome button:active img {
		transform: rotate(-180deg);
		transition: none;
	}

	.chrome input {
		flex: 1;
		padding: 0.5rem 1rem 0.4rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
		font-family: inherit;
		font-size: 1.6rem;
	}
</style>
