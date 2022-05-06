<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import Viewer from '$lib/client/viewer/Viewer.svelte';
	import TableOfContents from './_/TableOfContents.svelte';

	const index = getContext('index');

	/** @type {any} */
	export let section;

	/** @type {import('svelte').SvelteComponentTyped} */
	let viewer;

	let completed = false;

	$: b = { ...section.a, ...section.b };

	afterNavigate(({ from, to }) => {
		viewer.set(Object.values(section.a));
		completed = false;
	});
</script>

<div class="grid">
	<div class="left">
		<!-- <select
			value={section.slug}
			on:change={(e) => {
				goto(`/${e.currentTarget.value}`);
			}}
		>
			{#each index as group, i}
				<optgroup label="{i + 1}. {group.title}">
					{#each group.sections as section}
						<option value={section.slug}>{section.title}</option>
					{/each}
				</optgroup>
			{/each}
		</select> -->
		<TableOfContents {index} {section} />

		<div class="text">{@html section.html}</div>

		{#if Object.keys(section.b).length > 0}
			<div class="controls">
				<label>
					<input
						type="checkbox"
						checked={false}
						on:change={(e) => {
							// TODO toggle completed state
						}}
					/>
					show completed
				</label>
			</div>
		{/if}
	</div>

	<div class="right">
		<Viewer
			bind:this={viewer}
			on:change={(e) => {
				completed = false;

				// TODO check to see if we're in the completed state or not
			}}
		/>
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 400px 1fr;
		height: 100%;
		max-height: 100%;
	}

	.left {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--second);
		color: white;
	}

	.text {
		flex: 1 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.controls {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
	}

	.controls a {
		color: white;
	}
</style>
