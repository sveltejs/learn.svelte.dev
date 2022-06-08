<script>
	import { onMount } from 'svelte';

	/** @type {HTMLDialogElement} */
	let modal;

	onMount(() => {
		if (modal.showModal) modal.showModal();
	});
</script>

<div class="modal-background" />

<dialog class="modal" tabindex="-1" bind:this={modal} on:close>
	<slot />
</dialog>

<style>
	/* when enough people have upgraded Safari, we can use
	   dialog::backdrop instead, but not yet */
	.modal-background {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: grayscale(0.7) blur(3px);
		z-index: 99998;
	}

	dialog {
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
		z-index: 99999;
	}
</style>
