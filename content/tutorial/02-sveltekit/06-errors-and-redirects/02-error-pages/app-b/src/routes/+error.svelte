<script>
	import { page } from '$app/stores';
</script>

<img
	src="https://httpstatusdogs.com/img/{$page.status}.jpg"
	alt={$page.error.message}
/>
