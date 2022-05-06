<script>
	import { onMount, createEventDispatcher, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import Folder from './FileTree/Folder.svelte';

	const { files, selected, started, base, update } = getContext('filetree');
</script>

<div class="viewer">
	<div class="top">
		<div class="left">
			<div class="filetree">
				<Folder prefix="/" depth={0} name="project" files={$files} expanded toggleable={false} />
			</div>
		</div>

		<div class="right">
			<Editor
				file={$selected}
				on:input={(e) => {
					if ($selected) {
						// @ts-ignore for now
						$selected.contents = e.currentTarget.value;
						update([$selected]);
					}
				}}
			/>
		</div>
	</div>

	<div>
		{#if $started}
			<iframe title="Output" src={$base} />
		{/if}
	</div>
</div>

<style>
	.viewer {
		display: grid;
		grid-template-rows: 1fr 1fr;
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		resize: none;
		box-sizing: border-box;
		border: none;
	}

	.top {
		display: grid;
		grid-template-columns: 200px 1fr;
		border-bottom: 1px solid #ccc;
	}

	.left,
	.right {
		width: 100%;
		height: 100%;
	}

	.left {
		border-right: 1px solid #ccc;
	}

	.filetree {
		padding: 1rem;
		line-height: 1.3;
	}
</style>
