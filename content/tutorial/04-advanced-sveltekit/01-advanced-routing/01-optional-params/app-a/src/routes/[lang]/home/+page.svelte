<script>
	import { page } from '$app/stores';
</script>

<h1>
	Welcome to the {$page.params.optional ??
		'default'} home page
</h1>
