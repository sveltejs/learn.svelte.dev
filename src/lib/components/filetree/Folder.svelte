<script>
	import { open } from './ContextMenu.svelte';
	import File from './File.svelte';
	import * as context from './context.js';

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

	export let readonly = false;

	/** @type {'idle' | 'add_file' | 'add_folder' | 'edit_folder'} */
	let state = 'idle';
	let new_name = '';

	const { edit, add, remove } = context.get();

	$: _files = files || []; // workaround for what seems to be a Svelte bug, where files is undefined on navigation
	$: hidden_children = _files
		.filter((file) =>
			file.name.startsWith(prefix + file.name.slice(prefix.length).split('/').shift() + '/__hidden')
		)
		.map((file) => file.name.slice(0, -'/__hidden'.length));
	$: children = _files
		.filter(
			(file) =>
				file.name.startsWith(prefix) &&
				!hidden_children.some(
					(hidden) => file.name.startsWith(hidden + '/') || file.name === hidden
				)
		)
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
		if (depth === 0 || readonly || (!can_create && !can_remove)) {
			return;
		}

		/** @type {import('./ContextMenu.svelte').MenuItems} */
		const actions = [];
		if (can_create) {
			actions.push(
				{
					name: 'New file',
					action: () => {
						state = 'add_file';
					}
				},
				{
					name: 'New folder',
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
	<div class="folder-row">
		<button data-folder class:expanded on:click={toggle} on:contextmenu|preventDefault={open_menu}>
			{name}
		</button>
		<div class="folder-actions">
			{#if can_create}
				<button aria-label="New file" class="icon file-new" on:click={() => (state = 'add_file')} />
				<button
					aria-label="New folder"
					class="icon folder-new"
					on:click={() => (state = 'add_folder')}
				/>
			{/if}
			{#if can_create && can_remove}
				<button
					aria-label="Rename"
					class="icon rename"
					on:click={() => {
						new_name = name;
						state = 'edit_folder';
					}}
				/>
			{/if}
			{#if can_remove}
				<button
					aria-label="Delete"
					class="icon delete"
					on:click={() => remove(/** @type {import('$lib/types').DirectoryStub} */ (file))}
				/>
			{/if}
		</div>
	</div>
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
					{readonly}
					{can_create}
					{can_remove}
				/>
			</li>
		{/each}

		{#each child_files as file}
			<li>
				<File {file} {readonly} {can_create} {can_remove} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	button,
	input {
		font-size: var(--font-size);
		font-family: inherit;
		color: var(--text);
		padding: 0 0 0 1.2em;
		width: 100%;
		text-align: left;
		background: url(./folder.svg) 0 45% no-repeat;
		background-size: 1.2rem 1.2rem;
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

	.folder-row {
		position: relative;
		height: 1.4em;
		z-index: 1;
	}

	.folder-actions {
		position: absolute;
		display: flex;
		right: -2rem;
		top: 0;
		height: 100%;
		display: none;
		background-color: var(--back-light);
		padding-right: 2rem;
		white-space: pre;
	}

	.folder-row:hover .folder-actions {
		display: block;
	}

	.folder-row::before {
		content: '';
		display: none;
		position: absolute;
		right: calc(-2rem + 1px);
		left: -20rem;
		height: 1.4em;
		background: var(--back-light);
		z-index: -1;
	}

	.folder-row:hover::before {
		display: block;
	}

	.icon {
		height: 100%;
		width: 1.5rem;
		padding: 0;
	}

	.rename {
		background-image: url(./rename.svg);
	}

	.file-new {
		background-image: url(./file-new.svg);
	}

	.folder-new {
		background-image: url(./folder-new.svg);
	}

	.delete {
		background-image: url(./delete.svg);
	}
</style>
