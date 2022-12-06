<script>
	import { page } from '$app/stores';
</script>

<h2>{$page.status}</h2>
<p>On no, something went wrong!</p>
<p>{$page.error.message}</p>
