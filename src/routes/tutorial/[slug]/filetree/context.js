import { setContext, getContext } from 'svelte';

/**
 * @typedef {{
 *   endstate: import('svelte/store').Readable<Record<string, import('$lib/types').Stub>>;
 *   files: import('svelte/store').Readable<import('$lib/types').Stub[]>;
 *   selected: import('svelte/store').Readable<import('$lib/types').FileStub | null>;
 *   readonly: import('svelte/store').Writable<boolean>;
 * 	 scope: import('svelte/store').Writable<import('$lib/types').Scope>;
 *   select: (file: import('$lib/types').FileStub) => void;
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
