<script>
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	/** @type {HTMLDialogElement} */
	let modal;

	onMount(() => {
		if (modal.showModal) {
			modal.showModal();
		}

		modal.addEventListener('close', () => {
			dispatch('close');
		});
	});
</script>

<div
	class="modal-background"
	on:click={(e) => {
		if (e.target === e.currentTarget) dispatch('close');
	}}
>
	<dialog class="modal" tabindex="-1" bind:this={modal}>
		<slot />
	</dialog>
</div>

<style>
	.modal-background {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: grayscale(0.7) blur(3px);
		z-index: 99999;
	}

	.modal {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: calc(100vw - 2rem);
		max-width: 56rem;
		background: white;
		padding: 2rem;
		border: none;
		border-radius: 0.5rem;
		filter: drop-shadow(3px 5px 10px rgba(0, 0, 0, 0.1));
	}
</style>
