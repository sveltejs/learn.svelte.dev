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

	$: children = files.filter((file) => file.name.startsWith(prefix));
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

<span class:expanded on:click={toggle}>{name}</span>

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
	span {
		padding: 0 0 0 1.2em;
		background: url(/tutorial/icons/folder.svg) 0 0.25rem no-repeat;
		background-size: 1.4rem 1.4rem;
		font-size: 1.6rem;
		user-select: none;
		/* font-weight: bold; */
		cursor: pointer;
	}

	.expanded {
		background-image: url(/tutorial/icons/folder-open.svg);
	}

	ul {
		padding: 0 0 0 0.2em;
		margin: 0 0 0 0.2em;
		list-style: none;
		border-left: 1px solid #eee;
		line-height: 1.3;
	}

	li {
		padding: 0;
	}
</style>
