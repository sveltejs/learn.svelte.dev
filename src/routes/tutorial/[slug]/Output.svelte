<script>
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/environment';
	import Chrome from './Chrome.svelte';
	import Loading from './Loading.svelte';
	import { base, error, progress, subscribe } from './adapter';

	/** @type {string} */
	export let path;

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;

	onMount(() => {
		const unsubscribe = subscribe('reload', () => {
			set_iframe_src($base + path);
		});

		function destroy() {
			unsubscribe();
		}

		document.addEventListener('pagehide', destroy);
		return destroy;
	});

	afterNavigate(() => {
		clearTimeout(timeout);
	});

	/** @type {any} */
	let timeout;

	/** @param {MessageEvent} e */
	async function handle_message(e) {
		if (e.origin !== $base) return;

		if (e.data.type === 'ping') {
			path = e.data.data.path ?? path;

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
		// removing the iframe from the document allows us to
		// change the src without adding a history entry, which
		// would make back/forward traversal very annoying
		const parentNode = /** @type {HTMLElement} */ (iframe.parentNode);
		parentNode?.removeChild(iframe);
		iframe.src = src;
		parentNode?.appendChild(iframe);
	}
</script>

<svelte:window on:message={handle_message} />
<Chrome
	{path}
	loading={$progress.value < 1}
	on:refresh={() => {
		set_iframe_src($base + path);
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
		<iframe bind:this={iframe} title="Output" />
	{/if}

	{#if $progress.value < 1 || $error}
		<Loading {initial} error={$error} progress={$progress.value} status={$progress.text} />
	{/if}
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
</style>
