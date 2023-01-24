<script>
	import File from './File.svelte';
	import * as context from './context.js';
	import { get_depth } from '$lib/utils';
	import Item from './Item.svelte';
	import { stubs, solution, scope } from '../state.js';

	export let expanded = true;

	/** @type {import('$lib/types').DirectoryStub} */
	export let directory;

	/** @type {string} */
	export let prefix;

	/** @type {number} */
	export let depth;

	/** @type {Array<import('$lib/types').Stub>} */
	export let files;

	/** @type {'idle' | 'add_file' | 'add_directory' | 'renaming'} */
	let state = 'idle';

	const { rename, add, remove, readonly } = context.get();

	$: children = files
		.filter((file) => file.name.startsWith(prefix))
		.sort((a, b) => (a.name < b.name ? -1 : 1));

	$: child_directories = children.filter(
		(child) => get_depth(child.name) === depth + 1 && child.type === 'directory'
	);

	$: child_files = /** @type {import('$lib/types').FileStub[]} */ (
		children.filter((child) => get_depth(child.name) === depth + 1 && child.type === 'file')
	);

	const can_create = { file: false, directory: false };

	$: {
		can_create.file = false;
		can_create.directory = false;

		if (!$readonly) {
			const child_prefixes = [];

			for (const stub of $stubs) {
				if (
					stub.type === 'directory' &&
					stub.name.startsWith(prefix) &&
					get_depth(stub.name) === depth + 1
				) {
					child_prefixes.push(stub.name + '/');
				}
			}

			for (const stub of Object.values($solution)) {
				if (!stub.name.startsWith(prefix)) continue;

				// if already exists in $stubs, bail
				if ($stubs.find((s) => s.name === stub.name)) continue;

				// if intermediate directory exists, bail
				if (child_prefixes.some((prefix) => stub.name.startsWith(prefix))) continue;

				can_create[stub.type] = true;
			}
		}
	}

	// fake root directory has no name
	$: can_remove = !$readonly && directory.name ? !$solution[directory.name] : false;

	/** @type {import('./ContextMenu.svelte').MenuItem[]} */
	$: actions = [
		can_create.file && {
			icon: 'file-new',
			label: 'New file',
			fn: () => {
				state = 'add_file';
			}
		},
		can_create.directory && {
			icon: 'folder-new',
			label: 'New folder',
			fn: () => {
				state = 'add_directory';
			}
		},
		can_remove && {
			icon: 'rename',
			label: 'Rename',
			fn: () => {
				state = 'renaming';
			}
		},
		can_remove && {
			icon: 'delete',
			label: 'Delete',
			fn: () => {
				remove(directory);
			}
		}
	].filter(Boolean);
</script>

<div class="directory row" class:expanded style="--depth: {depth - $scope.depth};">
	<Item
		can_rename={can_remove}
		renaming={state === 'renaming'}
		basename={directory.basename}
		{actions}
		on:click={() => {
			expanded = !expanded;
		}}
		on:edit={() => {
			state = 'renaming';
		}}
		on:rename={(e) => {
			rename(directory, e.detail.basename);
		}}
		on:cancel={() => {
			state = 'idle';
		}}
	/>
</div>

{#if expanded}
	<ul style="--depth: {depth - $scope.depth}">
		{#if state === 'add_directory'}
			<li>
				<div class="directory row" style="--depth: {depth - $scope.depth + 1}">
					<Item
						renaming
						on:rename={(e) => {
							add(prefix + e.detail.basename, 'directory');
						}}
						on:cancel={() => {
							state = 'idle';
						}}
					/>
				</div>
			</li>
		{/if}

		{#each child_directories as directory}
			<li>
				<svelte:self {directory} prefix={directory.name + '/'} depth={depth + 1} files={children} />
			</li>
		{/each}

		{#if state === 'add_file'}
			<li>
				<div class="row">
					<Item
						renaming
						on:rename={(e) => {
							add(prefix + e.detail.basename, 'file');
						}}
						on:cancel={() => {
							state = 'idle';
						}}
					/>
				</div>
			</li>
		{/if}

		{#each child_files as file}
			<li><File {file} /></li>
		{/each}
	</ul>
{/if}

<style>
	.directory::before {
		content: '';
		position: absolute;
		left: calc(var(--inset) - 1.5rem);
		top: 0rem;
		width: 1.2rem;
		height: 100%;
		background: url(../../../../lib/icons/folder.svg) 0 45% no-repeat;
		background-size: 100% auto;
	}

	.directory.expanded::before {
		background-image: url(../../../../lib/icons/folder-open.svg);
	}

	ul {
		padding: 0 0 0 0.3em;
		margin: 0 0 0 0.5em;
		padding: 0;
		margin: 0;
		list-style: none;
		/* border-left: 1px solid #eee; */
		line-height: 1.3;
		max-width: 100%;
		/* overflow: hidden; */
	}

	li {
		padding: 0;
	}
</style>
