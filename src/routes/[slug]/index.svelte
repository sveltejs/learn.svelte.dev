<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import Viewer from '$lib/client/viewer/Viewer.svelte';

	const index = getContext('index');

	/** @type {any} */
	export let section;

	/** @type {import('svelte').SvelteComponentTyped} */
	let viewer;

	afterNavigate(() => {
		viewer.update(section.a);
	});
</script>

<div class="grid">
	<div class="left">
		<select
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

		<div>{@html section.html}</div>
	</div>

	<div class="right">
		<Viewer bind:this={viewer} />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 300px 1fr;
	}
</style>
