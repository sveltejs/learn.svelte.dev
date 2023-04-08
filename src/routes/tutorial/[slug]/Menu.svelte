<script>
	import { page } from '$app/stores';
	import arrow from '$lib/icons/arrow.svg';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { Icon } from '@sveltejs/site-kit/components';
	import { tick } from 'svelte';

	/** @type {import('$lib/types').PartStub[]}*/
	export let index;

	/** @type {import('$lib/types').Exercise} */
	export let current;

	const duration = browser && matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;

	let is_open = false;
	let search = '';

	/** @type {HTMLInputElement} */
	let search_input;

	$: expanded_part = current.part.slug;
	$: expanded_chapter = current.chapter.slug;

	$: escaped = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	$: regex = new RegExp(`\\b${search.length >= 2 ? escaped : ''}`, 'i');

	$: filtered = index
		.map((part) => {
			return {
				slug: part.slug,
				title: part.title,
				chapters: part.chapters
					.map((chapter) => ({
						slug: chapter.slug,
						title: chapter.title,
						exercises: regex.test(chapter.title)
							? chapter.exercises
							: chapter.exercises.filter((exercise) => regex.test(exercise.title))
					}))
					.filter((chapter) => chapter.exercises.length > 0)
			};
		})
		.filter((part) => part.chapters.length > 0 || regex.test(part.title));

	afterNavigate(() => {
		search = '';
	});

	/**
	 * @param {HTMLElement} node
	 */
	function close_when_focus_leaves(node) {
		function handle_focus_in() {
			if (!node.contains(document.activeElement)) {
				is_open = false;
			}
		}
		document.addEventListener('focusin', handle_focus_in);

		return {
			destroy: () => {
				document.removeEventListener('focusin', handle_focus_in);
			}
		};
	}
</script>

<div use:close_when_focus_leaves>
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

	<nav class:open={is_open} aria-label="tutorial exercises">
		<div class="controls">
			<input
				type="search"
				placeholder="Search"
				bind:this={search_input}
				bind:value={search}
				aria-hidden={!is_open ? 'true' : null}
				tabindex={!is_open ? -1 : null}
			/>
		</div>

		<div class="exercises">
			<ul>
				{#each filtered as part, i (part.slug)}
					<li
						class="part"
						class:expanded={part.slug === expanded_part}
						aria-current={part.slug === current.part.slug ? 'step' : undefined}
						transition:slide|local={{ duration }}
					>
						<button
							on:click={() => {
								if (expanded_part !== part.slug) {
									expanded_part = part.slug;
									expanded_chapter = part.chapters[0].slug;
								}
							}}
						>
							Part {i + 1}: {part.title}
						</button>

						{#if search.length >= 2 || part.slug === expanded_part}
							<ul class="chapter" transition:slide|local={{ duration }}>
								{#each part.chapters as chapter (chapter.slug)}
									<li
										class="chapter"
										class:expanded={chapter.slug === expanded_chapter}
										aria-current={chapter.slug === current.chapter.slug ? 'step' : undefined}
									>
										<button on:click={() => (expanded_chapter = chapter.slug)}>
											<img src={arrow} alt="Arrow icon" />
											{chapter.title}
										</button>

										{#if search.length >= 2 || chapter.slug === expanded_chapter}
											<ul transition:slide|local={{ duration }}>
												{#each chapter.exercises as exercise (exercise.slug)}
													<li
														transition:slide|local={{ duration }}
														class="exercise"
														aria-current={$page.url.pathname === `/tutorial/${exercise.slug}`
															? 'page'
															: undefined}
													>
														<a href="/tutorial/{exercise.slug}" on:click={() => (is_open = false)}>
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
				{:else}
					<li>No search results!</li>
				{/each}
			</ul>
		</div>
	</nav>
</div>

<header>
	<a href={current.prev ? `/tutorial/${current.prev.slug}` : undefined} aria-label="Previous">
		<Icon name="arrow-left" size={16} />
	</a>

	<!-- we don't want this to be keyboard-navigable, because the menu button to the left does that job better -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<h1
		on:click={async () => {
			is_open = true;
			await tick();
			search_input.focus();
		}}
	>
		{current.part.title} <span class="separator">/</span>
		{current.chapter.title} <span class="separator">/</span>
		<strong>{current.title}</strong>
	</h1>

	<a href={current.next ? `/tutorial/${current.next.slug}` : undefined} aria-label="Next">
		<Icon name="arrow-right" size={16} />
	</a>
</header>

<style>
	header {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		background: var(--sk-back-3);
		border-bottom: 1px solid var(--sk-back-4);
		border-right: 1px solid var(--sk-back-4);
		padding: 0 0 0 var(--menu-width);
		height: var(--menu-width);
		align-items: center;
	}

	header strong,
	header h1 {
		font-size: 1.4rem;
	}

	header strong {
		color: var(--sk-theme-1);
	}

	header h1 {
		color: var(--sk-text-2);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-weight: 400;
		flex: 1;
		top: 0.15rem;
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
		--menu-width: 5.4rem;
		--transform-transition: transform 0.2s;
		position: absolute;
		width: 100%;
		height: 100%;
		/* when the nav is closing, wait to change visibility until the slide out completes */
		transition: var(--transform-transition), visibility 0s 0.2s;
		transform: translate(-100%, 0);
		background: var(--sk-back-3);
		z-index: 2;
		/* filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1)); */
		border-right: 1px solid var(--sk-back-4);
		display: flex;
		flex-direction: column;
		visibility: hidden;
	}

	nav.open {
		transform: none;
		visibility: visible;
		/* when the nav starts opening, don't transition visibility - set it right away */
		transition: var(--transform-transition);
	}

	.controls {
		height: var(--menu-width);
		display: flex;
		border-bottom: 1px solid var(--sk-back-4);
		padding: 0 0 0 var(--menu-width);
	}

	.controls input {
		flex: 1;
		border: none;
		padding: 0.8rem 1rem 0.4rem 1rem;
		font-family: inherit;
		font-size: inherit;
		background: var(--sk-back-2);
		border: 2px solid transparent;
		color: var(--sk-text-2);
	}

	.menu-toggle-container {
		position: absolute;
		left: 0;
		top: 0;
		width: var(--menu-width);
		height: var(--menu-width);
		z-index: 3;
		border-right: 1px solid var(--sk-back-4);
		border-bottom: 1px solid var(--sk-back-4);
	}

	.menu-toggle {
		width: 100%;
		height: 100%;
		background: var(--sk-back-3);
		border: 2px solid transparent;
		box-sizing: border-box;
		padding: 0.2rem 0 0 0;
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
		padding: 0 0 0 3rem;
	}

	li {
		position: relative;
	}

	li[aria-current='page'] a,
	li[aria-current='step']:not(.expanded) > button {
		color: var(--prime);
	}

	li img {
		position: absolute;
		left: -2rem;
		top: 0.1rem;
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s;
	}

	li.expanded > button {
		font-weight: bold;
	}

	li.expanded > button > img {
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

	a:focus-visible,
	.exercises button:focus-visible {
		outline: none;
		border: 2px solid var(--sk-theme-3);
	}
</style>
