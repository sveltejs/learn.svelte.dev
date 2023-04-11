<script>
	import { page } from '$app/stores';

	let words = ['how', 'deep', 'does', 'the', 'rabbit', 'hole', 'go'];

	$: depth = $page.params.path.split('/').filter(Boolean).length;
	$: next = depth === words.length ? '/' : `/${words.slice(0, depth + 1).join('/')}`;
</script>

<div class="flex">
	{#each words.slice(0, depth) as word}
		<p>{word}</p>
	{/each}

	<p><a href={next}>{words[depth] ?? '?'}</a></p>
</div>

<style>
	.flex {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	p {
		margin: 0.5rem 0;
		line-height: 1;
	}

	a {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
	}
</style>
