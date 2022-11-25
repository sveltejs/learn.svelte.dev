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
		if (depth === 0) return;

		open(e.clientX, e.clientY, [
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
			},
			{
				name: 'Rename',
				action: () => {
					new_name = name;
					state = 'edit_folder';
				}
			},
			{
				name: 'Delete',
				action: () => {
					remove(/** @type {import('$lib/types').DirectoryStub} */ (file));
				}
			}
		]);
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
				const parts = new_name.split('/');
				/** @type {import('$lib/types').Stub[]} */
				const stubs = [];

				for (let i = 1; i <= parts.length; i++) {
					const part = parts.slice(0, i).join('/');
					const basename = /** @type{string} */ (part.split('/').pop());
					const name = prefix + part + '/';
					if (!files.some((file) => file.name === name)) {
						if (i < parts.length || state === 'add_folder') {
							stubs.push({ type: 'directory', name, depth: depth + i, basename });
						} else if (i === parts.length && state === 'add_file') {
							stubs.push({
								type: 'file',
								name: name.slice(0, -1),
								depth: depth + i,
								basename,
								text: true,
								contents: ''
							});
						}
					}
				}

				add(stubs);
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
	<input type="text" autofocus bind:value={new_name} on:blur={done} on:keydown={done} />
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
				on:keydown={done}
			/>
		{/if}
		{#each child_directories as directory}
			<li>
				<svelte:self
					name={directory.basename}
					prefix={directory.name + '/'}
					depth={depth + 1}
					files={children}
				/>
			</li>
		{/each}

		{#each child_files as file}
			<li>
				<File {file} />
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
