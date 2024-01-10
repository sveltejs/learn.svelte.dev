<script>
	import File from './File.svelte';
	import * as context from './context.js';
	import { get_depth } from '$lib/utils';
	import Item from './Item.svelte';
	import folder_closed from '$lib/icons/folder.svg';
	import folder_open from '$lib/icons/folder-open.svg';
	import { s } from '../state.svelte.js';

	/** @type {{ directory: import('$lib/types').DirectoryStub; prefix: string; depth: number; contents: Array<import('$lib/types').Stub>; }} */
	let { directory, prefix, depth, contents } = $props();

	let renaming = $state(false);

	const { collapsed, rename, add, remove } = context.get();

	const segments = $derived(get_depth(prefix));

	const children = $derived(
		contents
			.filter((file) => file.name.startsWith(prefix))
			.sort((a, b) => (a.name < b.name ? -1 : 1))
	);

	const child_directories = $derived(
		children.filter((child) => get_depth(child.name) === segments && child.type === 'directory')
	);

	const child_files = $derived(
		/** @type {import('$lib/types').FileStub[]} */ (
			children.filter((child) => get_depth(child.name) === segments && child.type === 'file')
		)
	);

	const can_create = $derived(
		(() => {
			const can_create = { file: false, directory: false };
			const child_prefixes = [];

			for (const file of s.files) {
				if (
					file.type === 'directory' &&
					file.name.startsWith(prefix) &&
					get_depth(file.name) === depth + 1
				) {
					child_prefixes.push(file.name + '/');
				}
			}

			for (const file of Object.values(s.solution)) {
				if (!file.name.startsWith(prefix)) continue;

				// if already exists in files, bail
				if (s.files.find((f) => f.name === file.name)) continue;

				// if intermediate directory exists, bail
				if (child_prefixes.some((prefix) => file.name.startsWith(prefix))) continue;

				can_create[file.type] = true;
			}

			return can_create;
		})()
	);

	// fake root directory has no name
	const can_remove = $derived(directory.name ? !s.solution[directory.name] : false);

	const actions = $derived(
		/** @type {import('./ContextMenu.svelte').MenuItem[]} */ (
			[
				can_create.file && {
					icon: 'file-new',
					label: 'New file',
					fn: () => {
						s.creating = {
							parent: directory.name,
							type: 'file'
						};
					}
				},
				can_create.directory && {
					icon: 'folder-new',
					label: 'New folder',
					fn: () => {
						s.creating = {
							parent: directory.name,
							type: 'directory'
						};
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
			].filter(Boolean)
		)
	);
</script>

<Item
	{depth}
	basename={directory.basename}
	icon={collapsed[directory.name] ? folder_closed : folder_open}
	can_rename={can_remove}
	{renaming}
	{actions}
	onclick={() => {
		collapsed[directory.name] = !collapsed[directory.name];
	}}
	on_edit={() => {
		renaming = true;
	}}
	on_rename={(basename) => {
		rename(directory, basename);
	}}
	on_cancel={() => {
		renaming = false;
	}}
	onkeydown={(e) => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			collapsed[directory.name] = e.key === 'ArrowLeft';
		}
	}}
/>

{#if !collapsed[directory.name]}
	{#if s.creating?.parent === directory.name && s.creating.type === 'directory'}
		<Item
			depth={depth + 1}
			renaming
			on_rename={(basename) => {
				add(prefix + basename, 'directory');
			}}
			on_cancel={() => {
				s.creating = null;
			}}
		/>
	{/if}

	{#each child_directories as directory}
		<svelte:self {directory} prefix={directory.name + '/'} depth={depth + 1} contents={children} />
	{/each}

	{#if s.creating?.parent === directory.name && s.creating.type === 'file'}
		<Item
			depth={depth + 1}
			renaming
			on_rename={(basename) => {
				add(prefix + basename, 'file');
			}}
			on_cancel={() => {
				s.creating = null;
			}}
		/>
	{/if}

	{#each child_files as file, i}
		<File {file} depth={depth + 1} />
	{/each}
{/if}
