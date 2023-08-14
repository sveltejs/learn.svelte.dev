<script>
	import Keypad from './Keypad.svelte';

	let pin;
	$: view = pin
		? pin.replace(/\d(?!$)/g, '•')
		: 'entrez votre code';

	function handleSubmit() {
		alert(`votre code : ${pin}`);
	}
</script>

<h1 style="opacity: {pin ? 1 : 0.4}">
	{view}
</h1>

<Keypad
	bind:value={pin}
	on:submit={handleSubmit}
/>
