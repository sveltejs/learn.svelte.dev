<script>
	export let comment;
</script>

{#if !comment.deleted}
	<article class="comment">
		<p class="meta">
			<a href="/user/{comment.user}">
				{comment.user}
			</a>

			{comment.time_ago}
		</p>

		<div class="body">
			{@html comment.content}
		</div>

		{#if comment.comments.length > 0}
			<ul class="children">
				{#each comment.comments as child}
					<li><svelte:self comment={child} /></li>
				{/each}
			</ul>
		{/if}
	</article>
{/if}

<style>
	.comment .children {
		padding: 0 0 0 1em;
		margin: 0;
		list-style: none;
	}

	.meta {
		font-weight: bold;
	}

	.comment :global(pre) {
		overflow-x: auto;
	}
</style>
