<script>
	import Output from './Output.svelte';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import ContextMenu from './filetree/ContextMenu.svelte';
	import Filetree from './filetree/Filetree.svelte';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import Icon from '@sveltejs/site-kit/components/Icon.svelte';
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import ScreenToggle from './ScreenToggle.svelte';
	import Sidebar from './Sidebar.svelte';
	import {
		files,
		set_stubs,
		select_file,
		selected_name,
		selected_file,
		solution
	} from './state.js';
	import { reset } from './adapter.js';

	export let data;

	let width = browser ? window.innerWidth : 1000;
	let selected_view = 0;

	$: mobile = writable(false);
	$: $mobile = width < 768;

	$: completed = is_completed($files, data.exercise.b);

	$: files.set(Object.values(data.exercise.a));
	$: solution.set(data.exercise.b);
	$: selected_name.set(data.exercise.focus);

	afterNavigate(() => {
		reset($files);
	});

	/**
	 * @param {import('$lib/types').Stub[]} files
	 * @param {Record<string, import('$lib/types').Stub> | null} solution
	 */
	function is_completed(files, solution) {
		if (!solution) return true;

		for (const file of files) {
			if (file.type === 'file') {
				const expected = solution[file.name];
				if (expected?.type !== 'file') return false;
				if (normalise(file.contents) !== normalise(expected.contents)) return false;
			}
		}

		const names = new Set(files.map((stub) => stub.name));

		for (const name in solution) {
			if (!names.has(name)) return false;
		}

		return true;
	}

	/** @param {string} code */
	function normalise(code) {
		// TODO think about more sophisticated normalisation (e.g. truncate multiple newlines)
		return code.replace(/\s+/g, ' ').trim();
	}
</script>

<svelte:head>
	<title>{data.exercise.chapter.title} / {data.exercise.title} • Svelte Tutorial</title>

	<meta name="twitter:title" content="{data.exercise.title} • Svelte Tutorial" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@sveltejs" />
	<meta name="twitter:creator" content="@sveltejs" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta property="twitter:domain" content="learn.svelte.dev" />
	<meta property="twitter:url" content="https://learn.svelte.dev" />

	<meta property="og:title" content="{data.exercise.title} • Svelte Tutorial" />
	<meta property="og:url" content="https://learn.svelte.dev" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<ContextMenu />

<div class="container" style="--toggle-height: {$mobile ? '4.6rem' : '0px'}">
	<SplitPane
		type="horizontal"
		min={$mobile ? '0px' : '360px'}
		max={$mobile ? '100%' : '50%'}
		pos={$mobile ? (selected_view === 0 ? '100%' : '0%') : '33%'}
	>
		<section slot="a" class="content">
			<Sidebar
				index={data.index}
				exercise={data.exercise}
				on:select={(e) => {
					select_file(e.detail.file);
				}}
			/>
		</section>

		<section slot="b" class:hidden={$mobile && selected_view === 0}>
			<SplitPane
				type="vertical"
				min={$mobile ? '0px' : '100px'}
				max={$mobile ? '100%' : '50%'}
				pos={$mobile ? (selected_view === 1 ? '100%' : '0%') : '50%'}
			>
				<section slot="a">
					<SplitPane type="horizontal" min="120px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<Filetree readonly={mobile} exercise={data.exercise} />

							<button
								class:completed
								disabled={!data.exercise.has_solution}
								on:click={() => {
									set_stubs(Object.values(completed ? data.exercise.a : data.exercise.b));
								}}
							>
								{#if completed && data.exercise.has_solution}
									reset
								{:else}
									solve <Icon name="arrow-right" />
								{/if}
							</button>
						</section>

						<section class="editor-container" slot="b">
							<Editor read_only={$mobile} />
							<ImageViewer selected={$selected_file} />
						</section>
					</SplitPane>
				</section>

				<section slot="b" class="preview">
					<Output path={data.exercise.path} />
				</section>
			</SplitPane>
		</section>
	</SplitPane>
	{#if $mobile}
		<ScreenToggle labels={['Tutorial', 'Input', 'Output']} bind:selected={selected_view} />
	{/if}
</div>

<style>
	.container {
		height: calc(100% - var(--toggle-height));
		max-height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--sk-back-2);
		--menu-width: 5.4rem;
	}

	.navigator {
		position: relative;
		background: var(--sk-back-2);
		display: flex;
		flex-direction: column;
	}

	.navigator button {
		position: relative;
		background: var(--sk-theme-2);
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--sk-back-4);
		color: white;
		opacity: 1;
	}

	.navigator button:disabled {
		opacity: 0.5;
	}

	.navigator button:not(:disabled) {
		background: var(--sk-theme-1);
	}

	.navigator button.completed {
		background: var(--sk-theme-2);
	}

	.preview {
		display: flex;
		flex-direction: column;
	}

	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}

	.hidden {
		display: none;
	}
</style>
