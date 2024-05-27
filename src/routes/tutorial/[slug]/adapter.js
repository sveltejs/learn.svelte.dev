import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const progress = writable({
	value: 0,
	text: 'initialising'
});

/** @type {import('svelte/store').Writable<string | null>} */
export const base = writable(null);

/** @type {import('svelte/store').Writable<Error | null>} */
export const error = writable(null);

/** @type {import('svelte/store').Writable<string[]>} */
export const logs = writable([]);

/** @type {import('svelte/store').Writable<Record<string, import('$lib/types').Warning[]>>} */
export const warnings = writable({});

/** @type {Promise<import('$lib/types').Adapter>} */
let ready = new Promise(() => {});

let initial_load = true;

if (browser) {
	load_webcontainer();
	initial_load = false;
}

export function load_webcontainer() {
	ready = new Promise(async (fulfil, reject) => {
		try {
			// TODO: remove this when webcontainers are properly supported on iOS
			// see https://github.com/stackblitz/webcontainer-core/issues/1120
			if (initial_load && /iphone/i.test(navigator.userAgent)) {
				throw new Error('iOS does not support WebContainers');
			}

			const module = await import('$lib/client/adapters/webcontainer/index.js');
			const adapter = await module.create(base, error, progress, logs, warnings);

			fulfil(adapter);
		} catch (error) {
			reject(error);
		}
	});
}

/** @typedef {'reload'} EventName */

/** @type {Map<EventName, Set<() => void>>} */
let subscriptions = new Map([['reload', new Set()]]);

/**
 *
 * @param {EventName} event
 * @param {() => void} callback
 */
export function subscribe(event, callback) {
	subscriptions.get(event)?.add(callback);

	return () => {
		subscriptions.get(event)?.delete(callback);
	};
}

/**
 * @param {EventName} event
 */
function publish(event) {
	subscriptions.get(event)?.forEach((fn) => fn());
}

/**
 * @param {import('$lib/types').Stub[]} files
 */
export async function reset(files) {
	try {
		const adapter = await ready;
		const should_reload = await adapter.reset(files);

		if (should_reload) {
			publish('reload');
		}

		error.set(null);
	} catch (e) {
		error.set(/** @type {Error} */ (e));
	}
}

/**
 * @param {import('$lib/types').FileStub} file
 */
export async function update(file) {
	const adapter = await ready;
	const should_reload = await adapter.update(file);

	if (should_reload) {
		publish('reload');
	}
}
