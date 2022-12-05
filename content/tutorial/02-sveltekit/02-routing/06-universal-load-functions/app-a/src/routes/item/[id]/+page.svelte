<script>
	import Comment from './Comment.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<article class="item">
		<h1>
			<a href={data.url}>
				{data.title}
			</a>
		</h1>

		{#if data.content}
			{@html data.content}
		{/if}
	</article>

	<div class="comments">
		{#each data.comments as comment}
			<Comment {comment} />
		{/each}
	</div>
</div>
