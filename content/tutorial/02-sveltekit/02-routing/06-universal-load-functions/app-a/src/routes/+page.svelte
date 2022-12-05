<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Top news</h1>

{#each data.items as item}
	<article>
		<h2>{item.title}</h2>
		<p>
			<a href={item.url}> link </a>

			<a href="/item/{item.id}">
				{item.comments_count} comments
			</a>

			posted {item.time_ago}
		</p>
	</article>
{/each}
