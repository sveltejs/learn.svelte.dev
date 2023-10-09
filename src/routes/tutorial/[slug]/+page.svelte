<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { Icon } from '@sveltejs/site-kit/components';
	import { reset } from './adapter.js';
	import Editor from './Editor.svelte';
	import ContextMenu from './filetree/ContextMenu.svelte';
	import Filetree from './filetree/Filetree.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import Output from './Output.svelte';
	import ScreenToggle from './ScreenToggle.svelte';
	import Sidebar from './Sidebar.svelte';
	import {
		create_directories,
		creating,
		files,
		reset_files,
		selected_file,
		selected_name,
		solution
	} from './state.js';

	export let data;

	let path = data.exercise.path;
	let show_editor = false;
	let show_filetree = false;
	let paused = false;
	let w = 1000;

	/** @type {import('$lib/types').Stub[]} */
	let previous_files = [];

	$: mobile = w < 800; // for the things we can't do with media queries
	$: files.set(Object.values(data.exercise.a));
	$: solution.set(data.exercise.b);
	$: selected_name.set(data.exercise.focus);
	$: completed = is_completed($files, data.exercise.b);

	beforeNavigate(() => {
		previous_files = $files;
	});

	afterNavigate(async () => {
		w = window.innerWidth;

		const will_delete = previous_files.some((file) => !(file.name in data.exercise.a));

		if (data.exercise.path !== path || will_delete) paused = true;
		await reset($files);

		path = data.exercise.path;
		paused = false;
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

	/** @param {string | null} name */
	function select_file(name) {
		const file = name && $files.find((file) => file.name === name);

		if (!file && name) {
			// trigger file creation input. first, create any intermediate directories
			const new_directories = create_directories(name, $files);

			if (new_directories.length > 0) {
				reset_files([...$files, ...new_directories]);
			}

			// find the parent directory
			const parent = name.split('/').slice(0, -1).join('/');

			creating.set({
				parent,
				type: 'file'
			});

			show_filetree = true;
		} else {
			show_filetree = false;
			selected_name.set(name);
		}

		show_editor = true;
	}

	/** @param {string} name */
	function navigate_to_file(name) {
		if (name === $selected_name) return;

		select_file(name);

		if (mobile) {
			const q = new URLSearchParams({ file: $selected_name || '' });
			history.pushState({}, '', `?${q}`);
		}
	}
</script>

<svelte:head>
	<title>{data.exercise.chapter.title} / {data.exercise.title} • Hướng dẫn về Svelte</title>

	<meta name="twitter:title" content="{data.exercise.title} • Hướng dẫn về Svelte" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@sveltejs" />
	<meta name="twitter:creator" content="@sveltejs" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta property="twitter:domain" content="learn.sveltevietnam.devv" />
	<meta property="twitter:url" content="https://learn.sveltevietnam.dev" />

	<meta property="og:title" content="{data.exercise.title} • Hướng dẫn về Svelte" />
	<meta property="og:url" content="https://learn.sveltevietnam.dev" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<svelte:window
	bind:innerWidth={w}
	on:popstate={(e) => {
		const q = new URLSearchParams(location.search);
		const file = q.get('file');

		if (file) {
			show_editor = true;
			select_file(file || null); // empty string === null
		} else {
			show_editor = false;
		}
	}}
/>

<ContextMenu />

<div class="container" class:mobile>
	<div class="top" class:offset={show_editor}>
		<SplitPane id="main" type="horizontal" min="360px" max="50%" pos="33%">
			<section slot="a" class="content">
				<Sidebar
					index={data.index}
					exercise={data.exercise}
					on:select={(e) => {
						navigate_to_file(e.detail.file);
					}}
				/>
			</section>

			<section slot="b">
				<SplitPane type="vertical" min="100px" max="-4.1rem" pos="50%">
					<section slot="a">
						<SplitPane
							id="editor"
							type={mobile ? 'vertical' : 'horizontal'}
							min="120px"
							max="300px"
							pos="200px"
						>
							<section class="navigator" slot="a">
								{#if mobile}
									<button class="file" on:click={() => (show_filetree = !show_filetree)}>
										{$selected_file?.name.replace(
											data.exercise.scope.prefix,
											data.exercise.scope.name + '/'
										) ?? 'Tệp'}
									</button>
								{:else}
									<Filetree
										exercise={data.exercise}
										on:select={(e) => {
											select_file(e.detail.name);
										}}
									/>
								{/if}

								<button
									class="solve"
									class:completed
									disabled={!data.exercise.has_solution}
									on:click={() => {
										reset_files(Object.values(completed ? data.exercise.a : data.exercise.b));
									}}
								>
									{#if completed && data.exercise.has_solution}
										làm lại
									{:else}
										giải <Icon name="arrow-right" />
									{/if}
								</button>
							</section>

							<section class="editor-container" slot="b">
								<Editor />
								<ImageViewer selected={$selected_file} />

								{#if mobile && show_filetree}
									<div class="mobile-filetree">
										<Filetree
											mobile
											exercise={data.exercise}
											on:select={(e) => {
												navigate_to_file(e.detail.name);
											}}
										/>
									</div>
								{/if}
							</section>
						</SplitPane>
					</section>

					<section slot="b" class="preview">
						<Output exercise={data.exercise} {paused} />
					</section>
				</SplitPane>
			</section>
		</SplitPane>
	</div>

	<div class="screen-toggle">
		<ScreenToggle
			on:change={(e) => {
				show_editor = e.detail.pressed;

				const url = new URL(location.origin + location.pathname);

				if (show_editor) {
					url.searchParams.set('file', $selected_name ?? '');
				}

				history.pushState({}, '', url);
			}}
			pressed={show_editor}
		/>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: calc(100dvh - var(--sk-nav-height));
		/** necessary for innerWidth to be correct, so we can determine `mobile` */
		width: 100vw;
		overflow: hidden;
	}

	.top {
		width: 200vw;
		margin-left: -100vw;
		height: 0;
		flex: 1;
		transition: transform 0.2s;
		/* we transform the default state, rather than the editor state, because otherwise
		   the positioning of tooltips is wrong (doesn't take into account transforms) */
		transform: translate(50%, 0);
	}

	.top.offset {
		transform: none;
	}

	.screen-toggle {
		height: 4.6rem;
	}

	.content {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 100%;
		height: 100%;
		background: var(--sk-back-3);
		--menu-width: 5rem;
	}

	.navigator {
		position: relative;
		background: var(--sk-back-2);
		display: flex;
		flex-direction: column;
	}

	.navigator .solve {
		position: relative;
		background: var(--sk-theme-2);
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--sk-back-4);
		color: white;
		opacity: 1;
	}

	.navigator .solve:disabled {
		opacity: 0.5;
	}

	.navigator .solve:not(:disabled) {
		background: var(--sk-theme-1);
	}

	.navigator .solve.completed {
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

	.mobile .navigator {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
		gap: 1rem;
	}

	.mobile .navigator .file {
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		/* put ellipsis at start */
		direction: rtl;
		text-align: left;
	}

	.mobile .navigator .solve {
		width: 9rem;
		height: auto;
		padding: 0.2rem;
		border-radius: 4rem;
		border: none;
	}

	.mobile-filetree {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	/* on mobile, override the <SplitPane> controls */
	@media (max-width: 799px) {
		:global([data-pane='main']) {
			--pos: 50% !important;
		}

		:global([data-pane='editor']) {
			--pos: 5.4rem !important;
		}

		:global([data-pane]) :global(.divider) {
			cursor: default;
		}
	}

	@media (min-width: 800px) {
		.top {
			width: 100vw;
			margin: 0;
			transform: none;
		}

		.screen-toggle {
			display: none;
		}
	}
</style>
