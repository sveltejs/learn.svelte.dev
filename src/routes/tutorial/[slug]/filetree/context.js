import { setContext, getContext } from 'svelte';

/**
 * @typedef {{
 *   readonly: import('svelte/store').Writable<boolean>;
 *   add: (name: string, type: 'file' | 'directory') => Promise<void>;
 *   rename: (stub: import('$lib/types').Stub, name: string) => Promise<void>;
 *   remove: (stub: import('$lib/types').Stub) => Promise<void>;
 * }} FileTreeContext
 */

const key = {};

/** @param {FileTreeContext} context */
export function set(context) {
	setContext(key, context);
}

export function get() {
	return /** @type {FileTreeContext} */ (getContext(key));
}
