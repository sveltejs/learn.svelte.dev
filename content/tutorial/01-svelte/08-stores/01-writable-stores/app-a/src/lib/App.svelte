<script>
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';

	let count_value;

	count.subscribe((value) => {
		count_value = value;
	});
</script>

<h1>Le compteur vaut {count_value}</h1>

<Incrementer />
<Decrementer />
<Resetter />
