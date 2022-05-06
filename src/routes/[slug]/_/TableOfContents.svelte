<script>
	import { goto } from '$app/navigation';
	import { Icon } from '@sveltejs/site-kit';

	/** @type {import('$lib/types').SectionIndex}*/
	export let index;

	/** @type {import('$lib/types').Section} */
	export let section;

	/** @param {Event & { currentTarget: HTMLSelectElement }} e */
	function navigate(e) {
		goto(`/${e.currentTarget.value}`);
	}
</script>

<nav>
	<a
		rel="prefetch"
		aria-label="Previous tutorial step"
		class="no-underline"
		href="/{section.prev || section.slug}"
		class:disabled={!section.prev}
	>
		<Icon name="arrow-left" />
	</a>

	<div>
		<span>
			<strong>
				<span style="position: relative; top: -0.1em; margin: 0 0.5em 0 0">
					<Icon name="menu" />
				</span>
				{section.group} /
			</strong>
			{section.title}
		</span>

		<select value={section.slug} on:change={navigate}>
			{#each index as group, i}
				<optgroup label="{i + 1}. {group.title}">
					{#each group.sections as section, i}
						<option value={section.slug}>{String.fromCharCode(i + 97)}. {section.title}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
	</div>

	<a
		rel="prefetch"
		aria-label="Next tutorial step"
		class="no-underline"
		href="/{section.next || section.slug}"
		class:disabled={!section.next}
	>
		<Icon name="arrow-right" />
	</a>
</nav>

<style>
	nav {
		display: grid;
		align-items: center;
		grid-template-columns: 2.5em 1fr 2.5em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	div {
		position: relative;
		padding: 1em 0.5em;
		font-weight: 300;
		font-size: var(--h6);
		color: white;
	}

	a {
		display: block;
		padding: 0.7em 0;
		text-align: center;
		opacity: 0.75;
		color: white;
	}

	a:hover {
		opacity: 1;
	}

	a.disabled,
	a.disabled:hover,
	a.disabled:active {
		color: white;
		opacity: 0.3;
	}

	span {
		white-space: nowrap;
		position: relative;
		top: 0.1em;
	}

	strong {
		opacity: 0.7;
	}

	select {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0.0001;
		cursor: pointer;
		-webkit-appearance: none;
	}
</style>
