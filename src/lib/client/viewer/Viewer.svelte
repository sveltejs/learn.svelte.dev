<script>
	import { getContext } from 'svelte';
	import SplitPane from '../../components/SplitPane.svelte';
	import Editor from './Editor.svelte';
	import Folder from './FileTree/Folder.svelte';

	const { files, selected, started, base, update } = getContext('filetree');
</script>

<div class="viewer">
	<SplitPane type="vertical" min="100px" max="-100px" pos="50%">
		<section slot="a">
			<SplitPane type="horizontal" min="20px" max="-20px" pos="200px">
				<section slot="a">
					<div class="filetree">
						<Folder prefix="/src/lib/" depth={2} name="src" files={$files} expanded />
					</div>
				</section>

				<section slot="b">
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
				</section>
			</SplitPane>
		</section>

		<section slot="b">
			{#if $started}
				<iframe title="Output" src={$base} />
			{/if}
		</section>
	</SplitPane>
</div>

<style>
	.viewer {
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		resize: none;
		box-sizing: border-box;
		border: none;
	}

	.filetree {
		background: #f9f9f9;
		padding: 1rem;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
