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

	/** @type {import('./ContextMenu.svelte').MenuItems} */
	$: actions = [
		can_create.file && {
			name: 'file-new',
			label: 'New file',
			fn: () => {
				state = 'add_file';
			}
		},
		can_create.directory && {
			name: 'folder-new',
			label: 'New folder',
			fn: () => {
				state = 'add_directory';
			}
		},
		can_remove && {
			name: 'rename',
			label: 'Rename',
			action: () => {
				state = 'renaming';
			}
		},
		can_remove && {
			name: 'delete',
			label: 'Delete',
			action: () => {
				remove(directory);
			}
		}
	].filter(Boolean);

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

<div class="directory row" class:expanded style="--depth: {depth};">
	{#if state === 'renaming'}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="basename"
			type="text"
			autofocus
			autocomplete="off"
			spellcheck="false"
			value={directory.basename}
			on:blur={done}
			on:keyup={done}
		/>
	{:else}
		<button
			class="basename"
			on:click={() => {
				expanded = !expanded;
			}}
			on:dblclick={() => {
				if (can_remove) state = 'renaming';
			}}
			on:contextmenu|preventDefault={(e) => {
				open(e.clientX, e.clientY, actions);
			}}
		>
			{name}
		</button>

		<div class="actions">
			{#each actions as action}
				<button aria-label={action.label} class="icon {action.name}" on:click={action.fn} />
			{/each}
		</div>
	{/if}
</div>

{#if expanded}
	<ul style="--depth: {depth + 1}">
		{#if state === 'add_directory'}
			<li>
				<div class="directory row">
					<!-- svelte-ignore a11y-autofocus -->
					<input class="basename" type="text" autofocus on:blur={done} on:keyup={done} />
				</div>
			</li>
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
			<li>
				<div class="row">
					<!-- svelte-ignore a11y-autofocus -->
					<input class="basename" type="text" autofocus on:blur={done} on:keyup={done} />
				</div>
			</li>
		{/if}

		{#each child_files as file}
			<li>
				<File {file} {readonly} {depth} />
			</li>
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
		background: url(../../icons/folder.svg) 0 45% no-repeat;
		background-size: 100% auto;
	}

	.directory.expanded::before {
		background-image: url(../../icons/folder-open.svg);
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
		overflow: hidden;
	}

	li {
		padding: 0;
	}

	.new {
		padding-left: var(--inset);
	}
</style>
