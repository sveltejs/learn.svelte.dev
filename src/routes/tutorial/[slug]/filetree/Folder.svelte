<script>
	import File from './File.svelte';
	import * as context from './context.js';
	import { get_depth } from '$lib/utils';
	import Item from './Item.svelte';
	import folder_closed from '$lib/icons/folder.svg';
	import folder_open from '$lib/icons/folder-open.svg';
	import { files, solution, creating } from '../state.js';

	/** @type {import('$lib/types').DirectoryStub} */
	export let directory;

	/** @type {string} */
	export let prefix;

	/** @type {number} */
	export let depth;

	/** @type {Array<import('$lib/types').Stub>} */
	export let contents;

	let renaming = false;

	const { collapsed, rename, add, remove } = context.get();

	$: segments = get_depth(prefix);

	$: children = contents
		.filter((file) => file.name.startsWith(prefix))
		.sort((a, b) => (a.name < b.name ? -1 : 1));

	$: child_directories = children.filter(
		(child) => get_depth(child.name) === segments && child.type === 'directory'
	);

	$: child_files = /** @type {import('$lib/types').FileStub[]} */ (
		children.filter((child) => get_depth(child.name) === segments && child.type === 'file')
	);

	const can_create = { file: false, directory: false };

	$: {
		can_create.file = false;
		can_create.directory = false;

		const child_prefixes = [];

		for (const file of $files) {
			if (
				file.type === 'directory' &&
				file.name.startsWith(prefix) &&
				get_depth(file.name) === depth + 1
			) {
				child_prefixes.push(file.name + '/');
			}
		}

		for (const file of Object.values($solution)) {
			if (!file.name.startsWith(prefix)) continue;

			// if already exists in $files, bail
			if ($files.find((f) => f.name === file.name)) continue;

			// if intermediate directory exists, bail
			if (child_prefixes.some((prefix) => file.name.startsWith(prefix))) continue;

			can_create[file.type] = true;
		}
	}

	// fake root directory has no name
	$: can_remove = directory.name ? !$solution[directory.name] : false;

	/** @type {import('./ContextMenu.svelte').MenuItem[]} */
	$: actions = [
		can_create.file && {
			icon: 'file-new',
			label: 'New file',
			fn: () => {
				creating.set({
					parent: directory.name,
					type: 'file'
				});
			}
		},
		can_create.directory && {
			icon: 'folder-new',
			label: 'New folder',
			fn: () => {
				creating.set({
					parent: directory.name,
					type: 'directory'
				});
			}
		},
		can_remove && {
			icon: 'rename',
			label: 'Rename',
			fn: () => {
				renaming = true;
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
	icon={$collapsed[directory.name] ? folder_closed : folder_open}
	can_rename={can_remove}
	{renaming}
	{actions}
	on:click={() => {
		$collapsed[directory.name] = !$collapsed[directory.name];
	}}
	on:edit={() => {
		renaming = true;
	}}
	on:rename={(e) => {
		rename(directory, e.detail.basename);
	}}
	on:cancel={() => {
		renaming = false;
	}}
	on:keydown={(e) => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			$collapsed[directory.name] = e.key === 'ArrowLeft';
		}
	}}
/>

{#if !$collapsed[directory.name]}
	{#if $creating?.parent === directory.name && $creating.type === 'directory'}
		<Item
			depth={depth + 1}
			renaming
			on:rename={(e) => {
				add(prefix + e.detail.basename, 'directory');
			}}
			on:cancel={() => {
				creating.set(null);
			}}
		/>
	{/if}

	{#each child_directories as directory}
		<svelte:self {directory} prefix={directory.name + '/'} depth={depth + 1} contents={children} />
	{/each}

	{#if $creating?.parent === directory.name && $creating.type === 'file'}
		<Item
			depth={depth + 1}
			renaming
			on:rename={(e) => {
				add(prefix + e.detail.basename, 'file');
			}}
			on:cancel={() => {
				creating.set(null);
			}}
		/>
	{/if}

	{#each child_files as file, i}
		<File {file} depth={depth + 1} />
	{/each}
{/if}
