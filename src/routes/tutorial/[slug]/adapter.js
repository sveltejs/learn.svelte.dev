import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const progress = writable({
	value: 0,
	text: 'initialising'
});

/** @type {import('svelte/store').Writable<string | null>} */
export const base = writable(null);

let ready = new Promise(() => {});

if (browser) {
	ready = new Promise(async (fulfil, reject) => {
		try {
			const module = await import('$lib/client/adapters/webcontainer/index.js');
			const adapter = await module.create((value, text) => { progress.set({ value, text }); });

			base.set(adapter.base);

			fulfil(adapter);
		} catch (error) {
			reject(error);
		}
	})
}

/**
 * @param {import('$lib/types').Stub[]} files 
 */
export async function reset(files) {
	const adapter = await ready;
	return adapter.reset(files);
}

/**
 * @param {import('$lib/types').Stub[]} files 
 */
export async function update(files) {
	const adapter = await ready;
	return adapter.update(files);
}