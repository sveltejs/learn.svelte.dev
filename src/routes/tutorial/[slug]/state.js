import { derived, writable } from 'svelte/store';
import * as adapter from './adapter.js';

/** @type {import('svelte/store').Writable<import('$lib/types').Stub[]>} */
export const files = writable([]);

/** @type {import('svelte/store').Writable<Record<string, import('$lib/types').Stub>>} */
export const solution = writable({});

/** @type {import('svelte/store').Writable<string | null>} */
export const selected_name = writable(null);

export const selected_file = derived([files, selected_name], ([$files, $selected_name]) => {
	return (
		/** @type{import('$lib/types').FileStub | undefined} */ (
			$files.find((stub) => stub.name === $selected_name)
		) ?? null
	);
});

/** @param {import('$lib/types').FileStub} file */
export function update_file(file) {
	files.update(($files) => {
		return $files.map((old) => {
			if (old.name === file.name) {
				return file;
			}
			return old;
		});
	});

	adapter.update(file);
}

/** @param {import('$lib/types').Stub[]} stubs */
export function set_stubs(stubs) {
	files.set(stubs);
	adapter.reset(stubs);
}

/** @param {string | null} name */
export function select_file(name) {
	selected_name.set(name);
}

export const state = {};

// TODO get rid
export const stubs = files;
