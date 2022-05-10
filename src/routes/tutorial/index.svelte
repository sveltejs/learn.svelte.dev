<script context="module">
	/** @type {import('./index').Load} */
	export async function load({ stuff }) {
		return {
			props: {
				index: stuff.index
			}
		};
	}
</script>

<script>
	/** @type {import('$lib/types').SectionIndex} */
	export let index;
</script>

<main>
	<h1>Tutorial</h1>

	{#each index as part, i}
		<h2>Part {i + 1}. {part.title}</h2>

		<div class="grid">
			{#each part.chapters as chapter}
				<section>
					<h3>{chapter.title}</h3>

					<ul>
						{#each chapter.sections as section}
							<li><a href="/tutorial/{section.slug}">{section.title}</a></li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/each}
</main>

<style>
	main {
		padding: 4rem 1rem;
		max-width: 96rem;
		margin: 0 auto;
	}

	h1,
	h2 {
		font-weight: 400;
		margin: 0 0 0.5em 0;
	}

	h1 {
		font-size: 4rem;
	}

	h3 {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin: 0 0 0.5em 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1rem;
		margin: 0 0 8rem 0;
	}

	section {
		background-color: var(--second);
		color: white;
		padding: 1rem;
		border-radius: 4px;
	}

	section * {
		color: white;
	}

	ul {
		list-style: none;
		padding: 0;
	}
</style>
