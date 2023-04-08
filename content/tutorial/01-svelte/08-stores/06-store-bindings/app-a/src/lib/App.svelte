<script>
	import { name, greeting } from './stores.js';
</script>

<h1>{$greeting}</h1>
<input value={$name} />

<button>
	Add exclamation mark!
</button>