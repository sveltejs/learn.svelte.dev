<script>
	import { page } from '$app/stores';

	let words = ['how', 'deep', 'does', 'the', 'rabbit', 'hole', 'go'];

	$: depth = $page.params.path.split('/').filter(Boolean).length;

	$: href =
		depth === words.length
			? '/'
			: `/${words.slice(0, depth + 1).join('/')}`;
</script>

<a {href}>{words[depth] ?? '?'}</a>

<style>
	:global(html),
	:global(body) {
		height: 100%;
		margin: 0;
	}

	a {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		font-size: 20vmin;
	}
</style>
