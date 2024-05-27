<script>
	import { browser, dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { theme } from '@sveltejs/site-kit/stores';
	import { onMount } from 'svelte';
	import Chrome from './Chrome.svelte';
	import Loading from './Loading.svelte';
	import { base, error, logs, progress, subscribe } from './adapter';

	/** @type {import('$lib/types').Exercise} */
	export let exercise;

	/** @type {boolean} */
	export let paused;

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;
	let terminal_visible = false;

	// reset `path` to `exercise.path` each time, but allow it to be controlled by the iframe
	let path = exercise.path;

	$: if ($base) set_iframe_src($base + (path = exercise.path));

	onMount(() => {
		const unsubscribe = subscribe('reload', () => {
			set_iframe_src($base + path);
		});

		return () => {
			unsubscribe();
		};
	});

	afterNavigate(() => {
		clearTimeout(timeout);
	});

	/** @param {typeof $theme} $theme */
	function change_theme($theme) {
		if (!iframe) return;

		try {
			const url = new URL(iframe.src);

			url.searchParams.set('theme', $theme.current);

			iframe.src = url.href;
		} catch {}
	}

	$: change_theme($theme);

	/** @type {any} */
	let timeout;

	/** @param {MessageEvent} e */
	async function handle_message(e) {
		if (e.origin !== $base) return;

		if (paused) return;

		if (e.data.type === 'path') {
			path = e.data.path;
		} else if (e.data.type === 'ping') {
			loading = false;

			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (dev && !iframe) return;

				// we lost contact, refresh the page
				loading = true;
				set_iframe_src($base + path);
				loading = false;
			}, 1000);
		} else if (e.data.type === 'ping-pause') {
			clearTimeout(timeout);
		}
	}

	/** @param {string} src */
	function set_iframe_src(src) {
		if (!iframe) return; // HMR

		// To prevent iframe flickering.
		// Set to `visible` by calling `set_iframe_visible` function
		// from iframe on:load or setTimeout
		iframe.style.visibility = 'hidden';
		setTimeout(set_iframe_visible, 1000);

		// removing the iframe from the document allows us to
		// change the src without adding a history entry, which
		// would make back/forward traversal very annoying
		const parentNode = /** @type {HTMLElement} */ (iframe.parentNode);
		parentNode?.removeChild(iframe);

		const url = new URL(src);
		url.searchParams.set('theme', $theme.current);

		iframe.src = url.href;
		parentNode?.appendChild(iframe);
	}

	function set_iframe_visible() {
		if (iframe.style.visibility === 'hidden') {
			iframe.style.visibility = 'visible';
		}
	}
</script>

<svelte:window on:message={handle_message} />
<Chrome
	{path}
	{loading}
	href={$base && $base + path}
	on:refresh={() => {
		set_iframe_src($base + path);
	}}
	on:toggle_terminal={() => {
		terminal_visible = !terminal_visible;
	}}
	on:change={(e) => {
		if ($base) {
			const url = new URL(e.detail.value, $base);
			path = url.pathname + url.search + url.hash;
			set_iframe_src($base + path);
		}
	}}
/>

<div class="content">
	{#if browser}
		<iframe bind:this={iframe} title="Output" on:load={set_iframe_visible}></iframe>
	{/if}

	{#if paused || loading || $error}
		<Loading {initial} error={$error} progress={$progress.value} status={$progress.text} />
	{/if}

	<div class="terminal" class:visible={terminal_visible}>
		{#each $logs as log}
			<div>{@html log}</div>
		{/each}
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		position: relative;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--sk-back-2);
		--menu-width: 5.4rem;
	}

	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
		background: var(--sk-back-2);
	}

	.terminal {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 80%;
		font-family: var(--font-mono);
		font-size: var(--sk-text-xs);
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		transform: translate(0, 100%);
		transition: transform 0.3s;
		backdrop-filter: blur(3px);
		overflow-y: auto;
	}

	.terminal::after {
		--thickness: 6px;
		--shadow: transparent;
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		height: var(--thickness);
		left: 0;
		top: calc(-1 * var(--thickness));
		background-image: linear-gradient(to bottom, transparent, var(--shadow));
		pointer-events: none;
	}

	.terminal.visible {
		transform: none;
	}

	.terminal.visible::after {
		--shadow: rgba(0, 0, 0, 0.05);
	}

	@media (prefers-color-scheme: dark) {
		.terminal {
			background: rgba(0, 0, 0, 0.5);
		}
	}
</style>
