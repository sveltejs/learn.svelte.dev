<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import arrow from './arrow.svg';

	import { Icon } from '@sveltejs/site-kit';
	import { browser } from '$app/env';
	import { afterNavigate } from '$app/navigation';

	/** @type {import('$lib/types').PartStub[]}*/
	export let index;

	/** @type {import('$lib/types').Section} */
	export let current;

	let is_open = false;
	let search = '';

	const duration = browser && matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;

	$: regex = new RegExp(`\\b${search.length >= 2 ? search : ''}`, 'i');

	$: filtered = index
		.map((part, i) => {
			const chapters = part.chapters
				.map((chapter, i) => ({
					...chapter,
					label: String.fromCharCode(97 + i),
					first: chapter.sections[0].slug,
					sections: chapter.sections.filter((section) => regex.test(section.title))
				}))
				.filter((chapter) => chapter.sections.length > 0 || regex.test(chapter.title));

			return {
				...part,
				label: i + 1,
				first: part.chapters[0].sections[0].slug,
				chapters
			};
		})
		.filter((part) => part.chapters.length > 0 || regex.test(part.title));

	afterNavigate(() => {
		search = '';
	});

	export function open() {
		is_open = true;
	}
</script>

<div class="menu-toggle-container">
	<button
		class="menu-toggle"
		on:click={() => (is_open = !is_open)}
		aria-label="Toggle menu"
		aria-expanded={is_open}
	>
		<Icon name={is_open ? 'close' : 'menu'} />
	</button>
</div>

<nav class:open={is_open} aria-label="tutorial sections">
	<div class="controls">
		<input
			type="search"
			placeholder="Search"
			bind:value={search}
			aria-hidden={!is_open ? 'true' : null}
			tabindex={!is_open ? -1 : null}
		/>
	</div>

	<div class="sections">
		<ul>
			{#each filtered as part (part.slug)}
				<li
					class="part"
					transition:slide|local={{ duration }}
					class:expanded={part.slug === current.part.slug}
				>
					<a sveltekit:prefetch href="/tutorial/{part.first}" data-label={part.label}>
						Part {part.label}: {part.title}
					</a>

					{#if search.length >= 2 || part.slug === current.part.slug}
						<ul class="chapter" transition:slide|local={{ duration }}>
							{#each part.chapters as chapter (chapter.slug)}
								<li class="chapter" class:expanded={chapter.slug === current.chapter.slug}>
									<img src={arrow} alt="Arrow icon" />
									<a sveltekit:prefetch href="/tutorial/{chapter.first}" data-label={chapter.label}
										>{chapter.title}</a
									>

									{#if search.length >= 2 || chapter.slug === current.chapter.slug}
										<ul transition:slide|local={{ duration }}>
											{#each chapter.sections as section (section.slug)}
												<li
													transition:slide|local={{ duration }}
													class="section"
													aria-current={$page.url.pathname === `/tutorial/${section.slug}`
														? 'page'
														: undefined}
												>
													<a
														sveltekit:prefetch
														href="/tutorial/{section.slug}"
														on:click={() => (is_open = false)}
													>
														{section.title}
													</a>
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

<style>
	nav {
		--menu-width: 5.4rem;
		position: absolute;
		width: 100%;
		height: 100%;
		transition: transform 0.2s;
		transform: translate(calc(var(--menu-width) - 100%), 0);
		background: var(--back-api);
		z-index: 2;
		/* filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1)); */
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
	}

	nav.open {
		transform: none;
	}

	.controls {
		height: var(--menu-width);
		display: flex;
		border-bottom: 1px solid var(--border-color);
		padding: 0 0 0 var(--menu-width);
	}

	.controls input {
		flex: 1;
		border: none;
		padding: 0.6rem 1rem 0.5rem 1rem;
		font-family: inherit;
		font-size: inherit;
		background: rgba(255, 255, 255, 0.5);
		border: 2px solid transparent;
		color: var(--text);
	}

	.controls input:focus {
		outline: none;
		border: 2px solid var(--flash);
	}

	.menu-toggle-container {
		position: absolute;
		left: 0;
		top: 0;
		width: var(--menu-width);
		height: var(--menu-width);
		z-index: 3;
		border-right: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
	}

	.menu-toggle {
		width: 100%;
		height: 100%;
		background: var(--back-api);
		border: 2px solid transparent;
		box-sizing: border-box;
	}

	/* .menu-toggle::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		border-bottom: 1px solid var(--border-color);
	} */

	.menu-toggle:focus-visible {
		outline: none;
		border: 2px solid var(--flash);
	}

	.sections {
		padding: 2rem 0;
		flex: 1;
		overflow: auto;
	}

	ul {
		position: relative;
		list-style: none;
		padding: 0 0 0 2rem;
		margin: 0;
	}

	ul.chapter {
		padding: 0 0 0 3rem;
	}

	li {
		position: relative;
	}

	li[aria-current='page'] a {
		color: var(--prime);
	}

	li img {
		position: absolute;
		left: -2.5rem;
		top: 0.3rem;
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s;
	}

	li.expanded > a {
		font-weight: bold;
	}

	li.expanded img {
		transform: rotate(90deg);
	}

	li a::before,
	li a::after {
		position: absolute;
	}

	.section {
		--dot-size: 1.2rem;
		--color: var(--second);
	}

	.section > a::before,
	.section > a::after {
		content: '';
		top: calc(1.3rem - 0.5 * var(--dot-size));
		right: calc(0.5 * (var(--menu-width) - var(--dot-size)));
		width: var(--dot-size);
		height: var(--dot-size);
		border-radius: 50%;
		border: 1px solid var(--color);
		box-sizing: border-box;
	}

	.section a::after {
		transform: scale(0);
		transition: transform 0.2s;
		background: var(--color);
	}

	.part > a::after,
	.chapter > a::after {
		content: attr(data-label);
		width: var(--menu-width);
		text-align: center;
		top: 0.2rem;
		right: 0;
		color: hsl(240, 8%, 64%);
	}

	.section[aria-current='page'] > a::after {
		transform: none;
	}

	a {
		color: var(--second);
		padding: 0.2rem 0;
		display: block;
		font-variant-numeric: tabular-nums;
	}
</style>
