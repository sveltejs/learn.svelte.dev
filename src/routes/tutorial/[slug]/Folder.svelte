<script>
	import { getContext } from 'svelte';
	import { open } from './ContextMenu.svelte';
	import File from './File.svelte';

	export let expanded = true;
	export let toggleable = true;

	/** @type {string} */
	export let name;

	/** @type {string} */
	export let prefix;

	/** @type {number} */
	export let depth;

	/** @type {Array<import('$lib/types').Stub>} */
	export let files;

	export let can_create = true;

	export let can_remove = true;

	export let read_only = false;

	/** @type {'idle' | 'add_file' | 'add_folder' | 'edit_folder'} */
	let state = 'idle';
	let new_name = '';

	/** @type {import('$lib/types').FileTreeContext} */
	const { edit, add, remove } = getContext('filetree');

	$: _files = files || []; // workaround for what seems to be a Svelte bug, where files is undefined on navigation
	$: children = _files
		.filter((file) => file.name.startsWith(prefix))
		.sort((a, b) => (a.name < b.name ? -1 : 1));
	$: child_directories = children.filter(
		(child) => child.depth === depth + 1 && child.type === 'directory'
	);
	$: child_files = /** @type {import('$lib/types').FileStub[]} */ (
		children.filter((child) => child.depth === depth + 1 && child.type === 'file')
	);
	$: file = _files.find((file) => file.name === prefix.slice(0, -1));

	function toggle() {
		if (toggleable) expanded = !expanded;
	}

	/** @param {MouseEvent} e */
	function open_menu(e) {
		if (depth === 0 || read_only || (!can_create && !can_remove)) {
			return;
		}

		/** @type {import('./ContextMenu.svelte').MenuItems} */
		const actions = [];
		if (can_create) {
			actions.push(
				{
					name: 'New File',
					action: () => {
						state = 'add_file';
					}
				},
				{
					name: 'New Folder',
					action: () => {
						state = 'add_folder';
					}
				}
			);
		}
		if (can_create && can_remove) {
			actions.push({
				name: 'Rename',
				action: () => {
					new_name = name;
					state = 'edit_folder';
				}
			});
		}
		if (can_remove) {
			actions.push({
				name: 'Delete',
				action: () => {
					remove(/** @type {import('$lib/types').DirectoryStub} */ (file));
				}
			});
		}
		open(e.clientX, e.clientY, actions);
	}

	/** @param {Event} e */
	function done(e) {
		if (/** @type {KeyboardEvent} */ (e).key === 'Escape') {
			state = 'idle';
			new_name = '';
			return;
		}

		if ('key' in e && /** @type {KeyboardEvent} */ (e).key !== 'Enter') {
			return;
		}

		if (new_name) {
			if (state === 'edit_folder') {
				edit(/** @type {import('$lib/types').DirectoryStub} */ (file), new_name);
			} else {
				add(prefix + new_name, state === 'add_folder' ? 'directory' : 'file');
			}
		}

		new_name = '';
		state = 'idle';
	}
</script>

{#if state !== 'edit_folder'}
	<button data-folder class:expanded on:click={toggle} on:contextmenu|preventDefault={open_menu}
		>{name}</button
	>
{/if}

{#if state === 'edit_folder'}
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" autofocus bind:value={new_name} on:blur={done} on:keyup={done} />
{/if}

{#if expanded}
	<ul>
		{#if state === 'add_file' || state === 'add_folder'}
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				class:no-img={state === 'add_file'}
				autofocus
				bind:value={new_name}
				on:blur={done}
				on:keyup={done}
			/>
		{/if}
		{#each child_directories as directory}
			<li>
				<svelte:self
					name={directory.basename}
					prefix={directory.name + '/'}
					depth={depth + 1}
					files={children}
					{read_only}
					{can_create}
					{can_remove}
				/>
			</li>
		{/each}

		{#each child_files as file}
			<li>
				<File {file} {read_only} {can_create} {can_remove} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	button,
	input {
		font-size: 1.6rem;
		font-family: inherit;
		color: var(--text);
		padding: 0 0 0 1.2em;
		width: 100%;
		text-align: left;
		background: url(./folder.svg) 0 45% no-repeat;
		background-size: 1.4rem 1.4rem;
		user-select: none;
		cursor: pointer;
		border: 2px solid transparent;
		white-space: nowrap;
	}

	input {
		border-color: var(--text);
	}
	input.no-img {
		background: none;
	}

	button:focus-visible {
		outline: none;
		border: 2px solid var(--flash);
	}

	.expanded {
		background-image: url(./folder-open.svg);
	}

	ul {
		padding: 0 0 0 0.3em;
		margin: 0 0 0 0.5em;
		list-style: none;
		/* border-left: 1px solid #eee; */
		line-height: 1.3;
	}

	li {
		padding: 0;
	}
</style>
