<script>
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/environment';
	import Chrome from './Chrome.svelte';
	import Loading from './Loading.svelte';
	import { create_adapter } from './adapter';
	import { state } from './state.js';

	/** @type {string} */
	export let path;

	/** @type {HTMLIFrameElement} */
	let iframe;
	let loading = true;
	let initial = true;

	/** @type {Error | null} */
	let error = null;

	let progress = 0;
	let status = 'initialising';

	/** @type {import('$lib/types').Adapter} Will be defined after first afterNavigate */
	let adapter;

	onMount(() => {
		const unsub = state.subscribe(async (state) => {
			if (state.status === 'set' || state.status === 'switch') {
				loading = true;

				try {
					clearTimeout(timeout);
					await reset_adapter(state);
					initial = false;
				} catch (e) {
					error = /** @type {Error} */ (e);
					console.error(e);
				}

				loading = false;
			} else if (state.status === 'update' && state.last_updated) {
				const reload = await adapter.update([state.last_updated]);
				if (reload === true) {
					schedule_iframe_reload();
				}
			}
		});

		function destroy() {
			unsub();
			if (adapter) {
				adapter.destroy();
			}
		}

		document.addEventListener('pagehide', destroy);
		return destroy;
	});

	afterNavigate(() => {
		clearTimeout(timeout);
	});

	/**
	 * Loads the adapter initially or resets it. This method can throw.
	 * @param {import('./state').State} state
	 */
	async function reset_adapter(state) {
		let reload_iframe = true;
		if (adapter) {
			const result = await adapter.reset(state.stubs);
			if (result === 'cancelled') {
				return;
			} else {
				reload_iframe = result || state.status === 'switch';
			}
		} else {
			const _adapter = create_adapter(state.stubs, (p, s) => {
				progress = p;
				status = s;
			});
			adapter = _adapter;
			await _adapter.init;

			set_iframe_src(adapter.base + path);
		}

		await new Promise((fulfil, reject) => {
			let called = false;

			window.addEventListener('message', function handler(e) {
				if (e.origin !== adapter.base) return;
				if (e.data.type === 'ping') {
					window.removeEventListener('message', handler);
					called = true;
					fulfil(undefined);
				}
			});

			setTimeout(() => {
				if (!called) {
					// Updating the iframe too soon sometimes results in a blank screen,
					// so we try again after a short delay if we haven't heard back
					set_iframe_src(adapter.base + path);
				}
			}, 5000);

			setTimeout(() => {
				if (!called) {
					reject(new Error('Timed out (re)setting adapter'));
				}
			}, 10000);
		});

		if (reload_iframe) {
			await new Promise((fulfil) => setTimeout(fulfil, 200));
			set_iframe_src(adapter.base + path);
		}

		return adapter;
	}

	/** @type {any} */
	let reload_timeout;
	function schedule_iframe_reload() {
		clearTimeout(reload_timeout);
		reload_timeout = setTimeout(() => {
			set_iframe_src(adapter.base + path);
		}, 1000);
	}

	/** @type {any} */
	let timeout;

	/** @param {MessageEvent} e */
	async function handle_message(e) {
		if (!adapter) return;
		if (e.origin !== adapter.base) return;

		if (e.data.type === 'ping') {
			path = e.data.data.path ?? path;

			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (dev && !iframe) return;

				// we lost contact, refresh the page
				loading = true;
				set_iframe_src(adapter.base + path);
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
	{loading}
	on:refresh={() => {
		set_iframe_src(adapter.base + path);
	}}
	on:change={(e) => {
		if (adapter) {
			const url = new URL(e.detail.value, adapter.base);
			path = url.pathname + url.search + url.hash;
			set_iframe_src(adapter.base + path);
		}
	}}
/>

<div class="content">
	{#if browser}
		<iframe bind:this={iframe} title="Output" />
	{/if}

	{#if loading || error}
		<Loading {initial} {error} {progress} {status} />
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
