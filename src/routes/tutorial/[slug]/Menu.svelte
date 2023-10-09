<script>
	import { page } from '$app/stores';
	import { click_outside, focus_outside } from '@sveltejs/site-kit/actions';
	import { Icon } from '@sveltejs/site-kit/components';
	import { open_nav } from '@sveltejs/site-kit/nav';
	import { mql, reduced_motion, theme } from '@sveltejs/site-kit/stores';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	/** @type {import('$lib/types').PartStub[]}*/
	export let index;

	/** @type {import('$lib/types').Exercise} */
	export let current;

	const is_mobile = mql('(max-width: 800px)');

	const duration = $reduced_motion ? 0 : 200;

	let is_open = false;

	$: expanded_part = current.part.slug;
	$: expanded_chapter = current.chapter.slug;
</script>

<div
	class="container"
	class:dark={$theme.current === 'dark'}
	use:focus_outside={() => (is_open = false)}
	use:click_outside={() => (is_open = false)}
>
	<header>
		<a
			class="prev-button"
			href={current.prev ? `/tutorial/${current.prev.slug}` : undefined}
			aria-label={current.prev && 'Previous'}
		>
			<Icon name="arrow-left" size={16} />
		</a>

		<button
			class="heading"
			on:click={() => ($is_mobile ? open_nav() : (is_open = !is_open))}
			class:open={is_open}
		>
			<h1>
				<div class="mobile">
					<div class="heading-row">
						<strong>{current.title}</strong>
					</div>
					<div class="heading-row">
						<span class="part-title">{current.part.label}</span>
						<span class="separator">/</span>
						<span class="chapter-title">{current.chapter.title}</span>
					</div>
				</div>

				<div class="desktop">
					<span class="part-title">{current.part.title}</span><span class="separator">/</span>
					<span class="chapter-title">{current.chapter.title}</span><span class="separator">/</span
					><strong>{current.title}</strong>
				</div>

				<span style="flex: 1 1 auto" />
			</h1>

			<span class="expand-icon" class:inverted={is_open}>
				<Icon name="chevron-down" />
			</span>

			{#if is_open}
				<nav
					aria-label="tutorial exercises"
					transition:slide={{ axis: 'y', easing: expoOut, duration: $reduced_motion ? 0 : 400 }}
				>
					<div class="exercises">
						<ul>
							{#each index as part, i (part.slug)}
								<li
									class="part"
									class:expanded={part.slug === expanded_part}
									aria-current={part.slug === current.part.slug ? 'step' : undefined}
									transition:slide={{ duration }}
								>
									<button
										on:click|stopPropagation={() => {
											if (expanded_part !== part.slug) {
												expanded_part = part.slug;
												expanded_chapter = part.chapters[0].slug;
											}
										}}
									>
										Phần {i + 1}: {part.title}
									</button>

									{#if part.slug === expanded_part}
										<ul class="chapter" transition:slide={{ duration }}>
											{#each part.chapters as chapter (chapter.slug)}
												<li
													class="chapter"
													class:expanded={chapter.slug === expanded_chapter}
													aria-current={chapter.slug === current.chapter.slug ? 'step' : undefined}
												>
													<button
														on:click|stopPropagation={() => (expanded_chapter = chapter.slug)}
														style="width: 100%; text-align: start;"
													>
														<!-- <img src={arrow} alt="Arrow icon" /> -->
														<Icon name="arrow-right-chevron" size={16} />
														{chapter.title}
													</button>

													{#if chapter.slug === expanded_chapter}
														<ul transition:slide={{ duration }}>
															{#each chapter.exercises as exercise (exercise.slug)}
																<li
																	transition:slide={{ duration }}
																	class="exercise"
																	aria-current={$page.url.pathname === `/tutorial/${exercise.slug}`
																		? 'page'
																		: undefined}
																>
																	<a
																		href="/tutorial/{exercise.slug}"
																		on:click={() => (is_open = false)}
																	>
																		{exercise.title}
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
			{/if}
		</button>

		<a
			class="next-button"
			href={current.next ? `/tutorial/${current.next.slug}` : undefined}
			aria-label="Next"
		>
			<Icon name="arrow-right" size={16} />
		</a>
	</header>
</div>

<style>
	.container {
		--shadow: 0px 0px 14px rgba(0, 0, 0, 0.1);

		position: relative;

		display: flex;
		justify-content: center;

		border-right: 1px solid var(--sk-back-4);

		width: 100%;
		padding: 1rem 0;

		background-color: transparent;

		isolation: isolate;
		z-index: 4;
	}

	.container.dark {
		--shadow: 0 0 0 1px var(--sk-back-4);
	}

	header {
		position: relative;
		/* z-index: 2; */

		display: grid;
		grid-template-columns: 4rem minmax(0, 1fr) 4rem;
		gap: 0.5rem;
		align-items: center;

		padding: 0;
		padding-right: 4px;
		height: var(--menu-width);
		width: 100%;
	}

	.heading.open {
		border-radius: var(--sk-border-radius) var(--sk-border-radius) 0 0;
	}

	header strong,
	h1 {
		font-size: var(--sk-text-xs);
	}

	.heading {
		font-size: var(--sk-text-s);
		border: none;
	}

	header strong {
		color: var(--sk-theme-1);
	}

	.heading {
		flex: 1;

		position: relative;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.4ch;

		top: 0.15rem;
		height: 100%;
		min-width: 0;
		width: 100%;
		max-width: 100%;

		padding: 0 1.5rem;

		transition: 0.4s var(--quint-out);
		transition-property: background, box-shadow;

		background-color: var(--sk-back-2);

		border-radius: var(--sk-border-radius);
		box-shadow: var(--shadow);

		cursor: pointer;
	}

	h1 {
		display: flex;

		width: 100%;
		height: 100%;

		z-index: 3;

		overflow: hidden;

		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
		color: var(--sk-text-2);
		font-weight: 400;
	}

	h1 .desktop {
		display: flex;
		gap: 0.5ch;
		align-items: center;
	}

	h1 .mobile {
		display: none;
	}

	/* .expand-icon {
		padding: 0.5rem;
	} */

	.expand-icon :global(svg) {
		transition: transform 0.4s var(--quint-out);
		transform-origin: center;
	}

	.expand-icon.inverted :global(svg) {
		transform: rotate3d(0, 0, 1, 180deg);
	}

	.separator {
		position: relative;
		font-size: 0.8em;
		opacity: 0.3;
		top: -0.1rem;
		display: inline-block;
	}

	header a:not([href]) {
		opacity: 0.1;
		cursor: default;
	}

	nav {
		--transform-transition: transform 0.2s;
		position: absolute;
		top: var(--menu-width);
		left: 0;
		width: 100%;
		height: auto;
		max-height: 70vh;
		background: var(--sk-back-2);
		z-index: -1;
		box-shadow: var(--shadow);
		border-radius: 0 0 var(--sk-border-radius) var(--sk-border-radius);
		display: flex;
		flex-direction: column;
	}

	nav a {
		justify-content: start !important;
		display: flex;
	}

	.exercises {
		padding: 2rem 0;
		flex: 1;
		overflow: auto;
	}

	ul {
		position: relative;
		list-style: none;
		padding: 0 0 0 1.5rem;
		margin: 0;
	}

	ul.chapter {
		padding: 0 0 0 1rem;
	}

	li {
		position: relative;
	}

	li[aria-current='page'] a,
	li[aria-current='step']:not(.expanded) > button {
		color: var(--sk-theme-1);
	}

	li :global(svg) {
		position: absolute;
		/* left: -2rem; */
		top: 0.1rem;
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s;
		stroke-width: 0 !important;
	}

	li.expanded > button {
		font-weight: bold;
	}

	li.expanded > button > :global(svg) {
		transform: rotate(90deg);
	}

	li a::before,
	li a::after {
		position: absolute;
	}

	.exercise {
		--dot-size: 1.2rem;
		--color: var(--sk-text-2);
	}

	a,
	button {
		color: var(--sk-text-2);
		padding: 0 0 0 0.5rem;
		margin: 0 0.5rem 0 0;
		display: block;
		font-variant-numeric: tabular-nums;
		border: 2px solid transparent;
		box-sizing: border-box;
	}

	li button {
		position: relative;

		display: flex;
		gap: 0.5rem;
	}

	li a {
		padding-left: 2rem;
	}

	header > a {
		height: 100%;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0;
		padding: 0;
		margin: 0;
		border: 0;
	}

	a:focus-visible,
	.exercises button:focus-visible {
		outline: none;
		border: 2px solid var(--sk-theme-3);
	}

	@media screen and (max-width: 800px) {
		.container {
			border-right: none;
		}

		/* Remove all styles */
		.heading {
			box-shadow: none;
			background-color: transparent;

			padding: 0;

			justify-content: start;
		}

		.expand-icon {
			display: none;
		}

		h1 {
			display: flex;
			flex-direction: column;
			column-gap: 0.5ch;
			align-items: flex-start;
			grid-template-rows: repeat(2, auto);

			width: max-content;
			height: max-content;
		}

		h1 .mobile {
			display: block;
		}

		h1 .desktop {
			display: none;
		}

		.heading-row {
			display: flex;
			gap: 0.5ch;
			align-items: center;
		}

		h1 :where(.part-title, .chapter-title) {
			grid-row: 2 / span 1;
			font-size: var(--sk-text-xs);
			color: var(--sk-text-3);
		}

		h1 strong {
			font-size: var(--sk-text-s) !important;
			line-height: 1;
		}
	}
</style>
