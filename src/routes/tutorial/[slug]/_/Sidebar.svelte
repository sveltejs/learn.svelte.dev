<script>
	import { createEventDispatcher } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import { Icon } from '@sveltejs/site-kit';
	import Menu from './Menu/Menu.svelte';

	/** @type {import('$lib/types').PartStub[]} */
	export let index;

	/** @type {import('$lib/types').Section} */
	export let section;

	const dispatch = createEventDispatcher();

	const namespace = 'learn.svelte.dev';
	const copy_enabled = `${namespace}:copy_enabled`;

	/** @type {import('svelte').SvelteComponent} */
	let menu;

	/** @type {HTMLElement} */
	let sidebar;

	let show_modal = false;

	afterNavigate(async () => {
		// TODO ideally we would associate scroll state with
		// history. That's a little tricky to do right now,
		// so for now just always reset sidebar scroll
		sidebar.scrollTop = 0;
	});
</script>

<Menu bind:this={menu} {index} current={section} />

<header on:click={() => menu.open()}>
	<h1>
		Part {section.part.index + 1} > {section.chapter.title} >
		<strong>{section.title}</strong>
	</h1>
</header>

<div
	bind:this={sidebar}
	class="text"
	on:copy={(e) => {
		if (sessionStorage[copy_enabled]) return;

		/** @type {HTMLElement | null} */
		let node = /** @type {HTMLElement} */ (e.target);

		while (node && node !== e.currentTarget) {
			if (node.nodeName === 'PRE') {
				show_modal = true;

				e.preventDefault();
				return;
			}

			node = /** @type {HTMLElement | null} */ (node.parentNode);
		}
	}}
>
	<div
		on:click={(e) => {
			const node = /** @type {HTMLElement} */ (e.target);

			if (node.nodeName === 'CODE') {
				const { file } = node.dataset;
				if (file) {
					dispatch('select', { file });
				}
			}
		}}
	>
		{@html section.html}
	</div>

	{#if section.next}
		<p><a href="/tutorial/{section.next.slug}">Next: {section.next.title}</a></p>
	{/if}
</div>

<footer>
	<a class="edit" href="https://github.com/sveltejs/learn.svelte.dev/tree/main/{section.dir}">
		Edit this page
	</a>
</footer>

{#if show_modal}
	<Modal on:close={() => (show_modal = false)}>
		<div class="modal-contents">
			<h2>Copy and paste is currently disabled!</h2>

			<p>
				We recommend typing the code into the editor to complete the exercise, as this results in
				better retention and understanding.
			</p>
			<label>
				<input
					type="checkbox"
					on:change={(e) => {
						sessionStorage[copy_enabled] = e.currentTarget.checked ? 'true' : '';
					}}
				/>
				enable copy-and-paste for the duration of this session
			</label>

			<button on:click={() => (show_modal = false)}>OK</button>
		</div>
	</Modal>
{/if}

<style>
	header {
		display: flex;
		border-bottom: 1px solid var(--border-color);
		border-right: 1px solid var(--border-color);
		padding: 0 0 0 calc(var(--menu-width) + 2.2rem);
		height: var(--menu-width);
		align-items: center;
	}

	header strong,
	header h1 {
		font-size: 1.4rem;
	}

	header strong {
		color: var(--prime);
	}

	header h1 {
		color: var(--second);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-weight: 400;
	}

	.text {
		flex: 1 1;
		overflow-y: auto;
		padding: 2.2rem 2.2rem 2.2rem calc(var(--menu-width) + 2.2rem);
		color: var(--second);
		border-right: 1px solid var(--border-color);
	}

	.text :global(a) {
		color: inherit;
		text-decoration: underline;
	}

	.text :global(h2) {
		font-size: 2.8rem;
		font-weight: normal;
		margin: 1.5em 0 0.5em 0;
	}

	.text :global(ul) {
		padding: 0 0 0 2rem;
	}

	.text :global(code) {
		background: hsl(206, 44%, 92%);
		padding: 0.2em 0.4em 0.3em;
		white-space: nowrap;
		position: relative;
		top: -0.1em;
	}

	.text :global(code[data-file]) {
		padding-right: 1.8em;
		cursor: pointer;
	}

	.text :global(code[data-file])::after {
		content: '';
		position: absolute;
		width: 1em;
		height: 1em;
		top: calc(50% - 0.55em);
		right: 0.5em;
		background: url(./file-edit.svg);
		background-size: 100% 100%;
	}

	.text :global(pre) {
		background: white;
		padding: 1rem 1.5rem;
		margin: 0 0 1.6rem 0;
		line-height: 1.3;
		border-radius: 0.5rem;
		box-shadow: inset 1px 1px 4px hsl(206, 20%, 85%);
	}

	.text :global(pre) :global(code) {
		background: none;
		color: var(--code-base);
		padding: 0;
		top: 0;
		white-space: pre;
	}

	.text :global(pre) :global(code)::before,
	.text :global(pre) :global(code)::after {
		content: none;
	}

	.text :global(pre) :global(.highlight) {
		--color: rgba(220, 220, 0, 0.2);
		background: var(--color);
		outline: 2px solid var(--color);
		border-radius: 2px;
	}

	.text :global(pre) :global(.highlight.add) {
		--color: rgba(0, 255, 0, 0.2);
	}

	.text :global(pre) :global(.highlight.remove) {
		--color: rgba(255, 0, 0, 0.2);
	}

	.text :global(blockquote) {
		margin: 2rem 0;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1.5px solid var(--flash);
		color: hsl(204, 100%, 40%);
	}

	.text :global(blockquote)::before {
		content: '!';
		position: relative;
		top: -0.1rem;
		right: -0.1rem;
		float: right;
		color: var(--flash);
		width: 2rem;
		height: 2rem;
		display: block;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--flash);
		background: var(--flash);
		color: var(--light-blue);
		border-radius: 50%;
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
		line-height: 1.9;
		margin: 0 0 1rem 1rem;
		opacity: 0.8;
	}

	footer {
		padding: 1.5rem 2.2rem 1.5rem calc(var(--menu-width) + 2.2rem);
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--border-color);
		border-right: 1px solid var(--border-color);
	}

	footer .edit {
		color: var(--second);
		font-size: 1.4rem;
		padding: 0 0 0 1.4em;
		background: url(./file-edit.svg) no-repeat 0 calc(50% - 0.1em);
		background-size: 1em 1em;
	}

	.modal-contents h2 {
		font-size: 2.4rem;
		margin: 0 0 0.5em 0;
	}

	.modal-contents label {
		user-select: none;
	}

	.modal-contents button {
		display: block;
		background: var(--prime);
		color: white;
		padding: 1rem;
		width: 10em;
		margin: 1em 0 0 0;
		border-radius: var(--border-r);
		line-height: 1;
	}
</style>
