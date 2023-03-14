import { derived, writable } from 'svelte/store';
import * as adapter from './adapter.js';

/**
 * @template T
 * @typedef {import('svelte/store').Writable<T>} Writable<T>
 */

// TODO would be nice if svelte exported this type (maybe it does already?)
/**
 * @typedef {{
 *   code: string;
 *   start: { line: number, column: number, character: number };
 *   end: { line: number, column: number, character: number };
 *   pos: number;
 *   filename: string;
 *   frame: string;
 *   message: string;
 * }} CompilerWarning
 */

/** @type {Writable<import('$lib/types').Stub[]>} */
export const files = writable([]);

/** @type {Writable<Record<string, import('$lib/types').Stub>>} */
export const solution = writable({});

/** @type {Writable<Record<string, CompilerWarning[]>>} */
export const warnings = writable({});

/** @type {Writable<string | null>} */
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

/** @param {import('$lib/types').Stub[]} new_files */
export function reset_files(new_files) {
	// if the selected file no longer exists, clear it
	selected_name.update(($selected_name) => {
		const file = new_files.find((file) => file.name === $selected_name);
		return file?.name ?? null;
	});

	files.set(new_files);
	adapter.reset(new_files);
}

/** @param {string | null} name */
export function select_file(name) {
	selected_name.set(name);
}
