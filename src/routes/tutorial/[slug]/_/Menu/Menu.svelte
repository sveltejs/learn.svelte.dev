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

<nav class:open={is_open}>
	<div class="controls">
		<input type="search" placeholder="Search" bind:value={search} />
	</div>

	<div class="sections">
		<ul>
			{#each filtered as part (part.slug)}
				<li class="part" transition:slide|local={{ duration }}>
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

<button class="menu-toggle" on:click={() => (is_open = !is_open)} aria-label="Toggle menu">
	<Icon name={is_open ? 'close' : 'menu'} />
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

	li[aria-current='page'] {
		font-weight: bold;
	}

	li img {
		position: absolute;
		left: -2.5rem;
		top: 0.3rem;
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s;
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
		--color: hsl(240, 8%, 95%);
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
		color: white;
		padding: 0.2rem 0;
		display: block;
	}
</style>
