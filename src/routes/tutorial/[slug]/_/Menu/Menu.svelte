<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	import { Icon } from '@sveltejs/site-kit';

	/** @type {import('$lib/types').PartStub[]}*/
	export let index;

	/** @type {import('$lib/types').Section} */
	export let current;

	let open = false;

	let expanded = {
		part: index[0],
		chapter: index[0].chapters[0]
	};

	afterNavigate(() => {
		// open = false;
	});

	$: console.log({ index, current });
</script>

<nav class:open>
	<div class="controls">
		<input type="search" placeholder="Search" />
	</div>

	<div class="sections">
		<ul>
			{#each index as part, i}
				<li>
					<a href="/tutorial/{part.chapters[0].sections[0].slug}">{part.title}</a>

					{#if part.slug === current.part.slug}
						<ul>
							{#each part.chapters as chapter}
								<li>
									<a href="/tutorial/{chapter.sections[0].slug}">{chapter.title}</a>

									{#if chapter.slug === current.chapter.slug}
										<ul>
											{#each chapter.sections as section}
												<li
													aria-current={$page.url.pathname === `/tutorial/${section.slug}`
														? 'page'
														: undefined}
												>
													<a href="/tutorial/{section.slug}">{section.title}</a>
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</nav>

<button class="menu-toggle" on:click={() => (open = !open)} aria-label="Toggle menu">
	<Icon name={open ? 'close' : 'menu'} />
</button>

<style>
	nav {
		--menu-width: 5.4rem;
		position: absolute;
		width: 100%;
		height: 100%;
		transition: transform 0.2s;
		transform: translate(calc(var(--menu-width) - 100%), 0);
		background: var(--second);
		z-index: 2;
		/* filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1)); */
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
	}

	nav.open {
		transform: none;
	}

	.controls {
		height: var(--menu-width);
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1rem 1rem 1rem calc(var(--menu-width) + 1rem);
	}

	.controls input {
		flex: 1;
		border-radius: 0.5rem;
		border: none;
		padding: 0.6rem 1rem 0.5rem 1rem;
		font-family: inherit;
		font-size: inherit;
		background: hsl(240, 8%, 54%);
		color: white;
	}

	.controls input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.controls input:focus {
		background: white;
		color: var(--text);
		outline: none;
	}

	.controls input:focus::placeholder {
		color: #333;
	}

	.menu-toggle {
		position: absolute;
		left: 0;
		top: 0;
		width: var(--menu-width);
		height: var(--menu-width);
		z-index: 2;
		/* background: linear-gradient(
			to right,
			var(--second),
			var(--second) calc(100% - 1rem),
			transparent
		); */
		background: var(--second);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}

	.sections {
		padding: 1rem;
		flex: 1;
		overflow: auto;
	}

	ul {
		list-style: none;
		padding: 0 0 0 1rem;
		margin: 0;
	}

	li[aria-current='page'] {
		font-weight: bold;
	}
</style>
