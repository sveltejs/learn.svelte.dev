import { setContext, getContext } from 'svelte';

/**
 * @typedef {{
 *   selected: import('svelte/store').Writable<import('$lib/types').FileStub | null>;
 *   constraints: import('svelte/store').Writable<import('$lib/types').EditingConstraints>;
 *   select: (file: import('$lib/types').FileStub) => void;
 *   add: (name: string, type: 'file' | 'directory') => Promise<void>;
 *   edit: (stub: import('$lib/types').Stub, name: string) => Promise<void>;
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
