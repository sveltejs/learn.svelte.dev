<script>
	export let data;
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

<h2>Comments</h2>

{#await data.promises.comments}
	<p>loading comments...</p>
{:then comments}
	{#each comments as comment}
		<p><strong>{comment.author}</strong> {comment.content}</p>
	{/each}
{:catch}
	<p>failed to load comments</p>
{/await}