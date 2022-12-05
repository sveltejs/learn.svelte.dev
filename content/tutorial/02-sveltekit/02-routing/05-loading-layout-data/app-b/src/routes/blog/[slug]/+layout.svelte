<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="layout">
	<main>
		<slot />
	</main>

	<aside>
		<h2>More posts</h2>
		<ul>
			{#each data.summaries as { slug, title }}
				<li>
					<a
						href={slug === data.post.slug
							? ''
							: `/blog/${slug}`}
					>
						{title}
					</a>
				</li>
			{/each}
		</ul>
	</aside>
</div>
