<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import Viewer from '$lib/client/viewer/Viewer.svelte';

	const index = getContext('index');

	/** @type {any} */
	export let section;

	/** @type {import('svelte').SvelteComponentTyped} */
	let viewer;

	let completed = false;

	$: b = { ...section.a, ...section.b };

	console.log('>>>> INITING'); // TODO this fires twice, but should only fire once

	afterNavigate(({ from, to }) => {
		console.log({ from: from?.href, to: to?.href });

		viewer.set(Object.values(section.a));

		completed = false;
	});
</script>

<div class="grid">
	<div class="left">
		<select
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
		</select>

		<div class="text">{@html section.html}</div>

		<div class="controls">
			<a href={section.prev}>previous</a>
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
			<a href={section.next}>next</a>
		</div>
	</div>

	<div class="right">
		<Viewer
			bind:this={viewer}
			on:change={(e) => {
				console.log('change', e.detail);

				completed = false;

				// TODO check to see if we're in the completed state or not
			}}
		/>
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 300px 1fr;
		height: 100%;
		max-height: 100%;
	}

	.left {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
	}

	.text {
		flex: 1 1;
		overflow-y: auto;
		padding: 1rem;
		background: var(--second);
		color: white;
	}
</style>
