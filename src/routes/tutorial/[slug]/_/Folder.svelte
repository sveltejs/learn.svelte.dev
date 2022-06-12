<script>
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

	$: children = files
		.filter((file) => file.name.startsWith(prefix))
		.sort((a, b) => (a.name < b.name ? -1 : 1));
	$: child_directories = children.filter(
		(child) => child.depth === depth + 1 && child.type === 'directory'
	);
	$: child_files = /** @type {import('$lib/types').FileStub[]} */ (
		children.filter((child) => child.depth === depth + 1 && child.type === 'file')
	);

	function toggle() {
		if (toggleable) expanded = !expanded;
	}
</script>

<button class:expanded on:click={toggle}>{name}</button>

{#if expanded}
	<ul>
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
	button {
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
