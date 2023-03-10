<script>
	import File from './File.svelte';
	import * as context from './context.js';
	import { get_depth } from '$lib/utils';
	import Item from './Item.svelte';
	import folder_closed from '$lib/icons/folder.svg';
	import folder_open from '$lib/icons/folder-open.svg';
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

<Item
	{depth}
	basename={directory.basename}
	icon={expanded ? folder_open : folder_closed}
	can_rename={can_remove}
	renaming={state === 'renaming'}
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

{#if expanded}
	{#if state === 'add_directory'}
		<Item
			depth={depth + 1}
			renaming
			on:rename={(e) => {
				add(prefix + e.detail.basename, 'directory');
			}}
			on:cancel={() => {
				state = 'idle';
			}}
		/>
	{/if}

	{#each child_directories as directory}
		<svelte:self {directory} prefix={directory.name + '/'} depth={depth + 1} files={children} />
	{/each}

	{#if state === 'add_file'}
		<Item
			depth={depth + 1}
			renaming
			on:rename={(e) => {
				add(prefix + e.detail.basename, 'file');
			}}
			on:cancel={() => {
				state = 'idle';
			}}
		/>
	{/if}

	{#each child_files as file}
		<File {file} depth={depth + 1} />
	{/each}
{/if}
