<script>
	import { open } from './ContextMenu.svelte';
	import File from './File.svelte';
	import * as context from './context.js';
	import { get_depth } from '$lib/utils';

	export let expanded = true;

	/** @type {import('$lib/types').DirectoryStub} */
	export let directory;

	/** @type {string} */
	export let name;

	/** @type {string} */
	export let prefix;

	/** @type {number} */
	export let depth;

	/** @type {Array<import('$lib/types').Stub>} */
	export let files;

	export let readonly = false;

	/** @type {'idle' | 'add_file' | 'add_directory' | 'renaming'} */
	let state = 'idle';

	const { endstate, files: all_files, edit, add, remove } = context.get();

	$: hidden_children = files
		.filter((file) =>
			file.name.startsWith(prefix + file.name.slice(prefix.length).split('/').shift() + '/__hidden')
		)
		.map((file) => file.name.slice(0, -'/__hidden'.length));

	$: children = files
		.filter(
			(file) =>
				file.name.startsWith(prefix) &&
				!hidden_children.some(
					(hidden) => file.name.startsWith(hidden + '/') || file.name === hidden
				)
		)
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

		if (!readonly) {
			const child_prefixes = [];

			for (const stub of $all_files) {
				if (
					stub.type === 'directory' &&
					stub.name.startsWith(prefix) &&
					get_depth(stub.name) === depth + 1
				) {
					child_prefixes.push(stub.name + '/');
				}
			}

			for (const stub of Object.values($endstate)) {
				if (!stub.name.startsWith(prefix)) continue;

				// if already exists in $files, bail
				if ($all_files.find((s) => s.name === stub.name)) continue;

				// if intermediate directory exists, bail
				if (child_prefixes.some((prefix) => stub.name.startsWith(prefix))) continue;

				can_create[stub.type] = true;
			}
		}
	}

	// fake root directory has no name
	$: can_remove = !readonly && directory.name ? !$endstate[directory.name] : false;

	/** @param {MouseEvent} e */
	function open_menu(e) {
		if (!can_create.file && !can_create.directory && !can_remove) {
			return;
		}

		/** @type {import('./ContextMenu.svelte').MenuItems} */
		const actions = [];
		if (can_create.file) {
			actions.push({
				name: 'New file',
				action: () => {
					state = 'add_file';
				}
			});
		}

		if (can_create.directory) {
			actions.push({
				name: 'New folder',
				action: () => {
					state = 'add_directory';
				}
			});
		}

		if (can_remove) {
			actions.push(
				{
					name: 'Rename',
					action: () => {
						state = 'renaming';
					}
				},
				{
					name: 'Delete',
					action: () => {
						remove(directory);
					}
				}
			);
		}

		open(e.clientX, e.clientY, actions);
	}

	/** @param {Event} e */
	function done(e) {
		if (/** @type {KeyboardEvent} */ (e).key === 'Escape') {
			state = 'idle';
			return;
		}

		if ('key' in e && /** @type {KeyboardEvent} */ (e).key !== 'Enter') {
			return;
		}

		const input = /** @type {HTMLInputElement} */ (e.target);

		if (input.value && input.value !== directory.basename) {
			if (state === 'renaming') {
				edit(directory, input.value);
			} else {
				add(prefix + input.value, state === 'add_directory' ? 'directory' : 'file');
			}
		}

		state = 'idle';
	}
</script>

<div class="row">
	<button
		class="directory basename"
		class:expanded
		on:click={() => {
			expanded = !expanded;
		}}
		on:dblclick={() => {
			if (can_remove) state = 'renaming';
		}}
		on:contextmenu|preventDefault={open_menu}
	>
		{name}
	</button>

	{#if state === 'renaming'}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="basename directory"
			class:expanded
			type="text"
			autofocus
			autocomplete="off"
			spellcheck="false"
			value={directory.basename}
			on:blur={done}
			on:keyup={done}
		/>
	{:else}
		<div class="actions">
			{#if can_create.file}
				<button aria-label="New file" class="icon file-new" on:click={() => (state = 'add_file')} />
			{/if}

			{#if can_create.directory}
				<button
					aria-label="New folder"
					class="icon folder-new"
					on:click={() => (state = 'add_directory')}
				/>
			{/if}

			{#if can_remove}
				<button
					aria-label="Rename"
					class="icon rename"
					on:click={() => {
						state = 'renaming';
					}}
				/>
				<button aria-label="Delete" class="icon delete" on:click={() => remove(directory)} />
			{/if}
		</div>
	{/if}
</div>

{#if expanded}
	<ul>
		{#if state === 'add_directory'}
			<!-- svelte-ignore a11y-autofocus -->
			<input type="text" class="directory" autofocus on:blur={done} on:keyup={done} />
		{/if}

		{#each child_directories as directory}
			<li>
				<svelte:self
					{directory}
					name={directory.basename}
					prefix={directory.name + '/'}
					depth={depth + 1}
					files={children}
					{readonly}
				/>
			</li>
		{/each}

		{#if state === 'add_file'}
			<!-- svelte-ignore a11y-autofocus -->
			<input type="text" autofocus on:blur={done} on:keyup={done} />
		{/if}

		{#each child_files as file}
			<li>
				<File {file} {readonly} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	.directory {
		padding: 0 0 0 1.2em !important;
		background-image: url(../../icons/folder.svg);
	}

	.expanded {
		background-image: url(../../icons/folder-open.svg);
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

	.rename {
		background-image: url(../../icons/rename.svg);
	}

	.file-new {
		background-image: url(../../icons/file-new.svg);
	}

	.folder-new {
		background-image: url(../../icons/folder-new.svg);
	}

	.delete {
		background-image: url(../../icons/delete.svg);
	}
</style>
