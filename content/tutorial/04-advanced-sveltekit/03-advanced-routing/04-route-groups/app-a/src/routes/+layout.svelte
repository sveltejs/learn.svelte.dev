<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
	<a href="/account">account</a>
	<a href="/app">app</a>
</nav>

<slot />

<style>
	nav {
		display: flex;
		gap: 1em;
		padding: 1em;
		background-color: #eee;
	}
</style>
