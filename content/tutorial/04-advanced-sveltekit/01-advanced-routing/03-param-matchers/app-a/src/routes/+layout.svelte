<script>
	import { page } from '$app/stores';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/archive/3">Archive (Page 3)</a>
	<a href="/archive/potato"
		>Archive (Invalid Page)</a
	>
</nav>

<pre>
Page Params:
{JSON.stringify($page.params, null, 2)}
</pre>

<slot />
