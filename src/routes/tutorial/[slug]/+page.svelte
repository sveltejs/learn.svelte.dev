<script>
	import Output from './Output.svelte';
	import { browser, dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import ContextMenu from '$lib/components/filetree/ContextMenu.svelte';
	import Filetree from '$lib/components/filetree/Filetree.svelte';
	import SplitPane from '$lib/components/SplitPane.svelte';
	import Icon from '@sveltejs/site-kit/components/Icon.svelte';
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import ScreenToggle from './ScreenToggle.svelte';
	import Sidebar from './Sidebar.svelte';
	import { state, selected, files } from './state';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('svelte/store').Writable<Record<string, import('$lib/types').Stub>>} */
	const endstate = writable({});

	/** @type {import('svelte/store').Writable<import('$lib/types').Scope>} */
	const scope = writable({ depth: 0, name: '', prefix: '' });

	/** @type {Record<string, string>} */
	let expected = {};
	/** @type {Record<string, boolean>}*/
	let complete_states = {};
	$: completed =
		Object.keys(complete_states).length > 0 && Object.values(complete_states).every(Boolean);

	let path = data.exercise.path;

	let width = browser ? window.innerWidth : 1000;
	let selected_view = 0;

	$: mobile = writable(false);
	$: $mobile = width < 768;

	/** @type {import('svelte/store').Writable<import('$lib/types').EditingConstraints>} */
	const editing_constraints = writable({ create: [], remove: [] });

	$: {
		$endstate = { ...data.exercise.a };

		$editing_constraints.create = data.exercise.editing_constraints.create;
		$editing_constraints.remove = data.exercise.editing_constraints.remove;

		// TODO should this be an array in the first place?
		for (const stub of Object.values(data.exercise.b)) {
			if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
				// remove file
				if (!$editing_constraints.remove.includes(stub.name)) {
					$editing_constraints.remove.push(stub.name);
				}
				delete $endstate[stub.name];
			} else if (stub.name.endsWith('/__delete')) {
				// remove directory
				const parent = stub.name.slice(0, stub.name.lastIndexOf('/'));
				if (!$editing_constraints.remove.includes(parent)) {
					$editing_constraints.remove.push(parent);
				}
				delete $endstate[parent];
				for (const k in $endstate) {
					if (k.startsWith(parent + '/')) {
						delete $endstate[k];
					}
				}
			} else {
				if (!$endstate[stub.name] && !$editing_constraints.create.includes(stub.name)) {
					$editing_constraints.create.push(stub.name);
				}
				$endstate[stub.name] = data.exercise.b[stub.name];
			}
		}
	}

	afterNavigate(() => {
		state.switch(Object.values(data.exercise.a));
		$scope = data.exercise.scope;

		state.select(data.exercise.focus);

		reset_complete_states();

		if (path !== data.exercise.path) {
			path = data.exercise.path;
		}
	});

	/**
	 * @param {CustomEvent<import('$lib/types').FileStub>} event
	 */
	function update_stub(event) {
		const stub = event.detail;
		state.update(stub);
		update_complete_states([stub]);
	}

	/** Set `complete_states` and `expected` based on the end state */
	function reset_complete_states() {
		expected = {};
		complete_states = {};
		for (const stub of Object.values($endstate)) {
			if (stub.type === 'file') {
				complete_states[stub.name] = false;
				expected[stub.name] = normalise(stub.contents);
			}
		}
	}

	/**
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	function update_complete_states(stubs) {
		for (const stub of stubs) {
			if (stub.type === 'file' && stub.name in complete_states) {
				complete_states[stub.name] = expected[stub.name] === normalise(stub.contents);
				if (dev) {
					compare(stub.name, normalise(stub.contents), expected[stub.name]);
				}
			}
		}
	}

	/**
	 * @param {string} name
	 * @param {string} actual
	 * @param {string} expected
	 */
	async function compare(name, actual, expected) {
		if (actual === expected) return;

		const Diff = await import('diff');
		console.groupCollapsed(`diff: ${name}`);
		console.log(actual);
		console.log(Diff.diffLines(actual, expected));
		console.groupEnd();
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
					state.select(e.detail.file);
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
					<SplitPane type="horizontal" min="80px" max="300px" pos="200px">
						<section class="navigator" slot="a">
							<Filetree
								{scope}
								{endstate}
								{files}
								readonly={mobile}
								constraints={editing_constraints}
								{selected}
							/>

							<button
								class:completed
								disabled={Object.keys(data.exercise.b).length === 0}
								on:click={() => {
									const files = Object.values(completed ? data.exercise.a : $endstate);
									if (completed) {
										reset_complete_states();
									} else {
										update_complete_states(files);
									}
									state.reset(files);
								}}
							>
								{#if completed && Object.keys(data.exercise.b).length > 0}
									reset
								{:else}
									solve <Icon name="arrow-right" />
								{/if}
							</button>
						</section>

						<section class="editor-container" slot="b">
							<Editor
								stubs={$files}
								selected={$selected}
								read_only={$mobile}
								on:change={update_stub}
							/>
							<ImageViewer selected={$selected} />
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

	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
		background: var(--sk-back-2);
	}

	iframe:not(.loaded) {
		display: none;
	}

	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}

	.hidden {
		display: none;
	}
</style>
