<script>
	export let data;
</script>

<h1>{data.greeting}</h1>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>

<slot />
