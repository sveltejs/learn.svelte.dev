import { derived, writable } from 'svelte/store';
import * as adapter from './adapter.js';

/**
 * @template T
 * @typedef {import('svelte/store').Writable<T>} Writable<T>
 */

/** @type {Writable<import('$lib/types').Stub[]>} */
export const files = writable([]);

/** @type {Writable<Record<string, import('$lib/types').Stub>>} */
export const solution = writable({});

/** @type {Writable<{ parent: string, type: 'file' | 'directory' } | null>} */
export const creating = writable(null);

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

/**
 * @param {string} name
 * @param {import('$lib/types').Stub[]} files
 */
export function create_directories(name, files) {
	const existing = new Set();

	for (const file of files) {
		if (file.type === 'directory') {
			existing.add(file.name);
		}
	}

	/** @type {import('$lib/types').DirectoryStub[]} */
	const directories = [];

	const parts = name.split('/');
	while (parts.length) {
		parts.pop();

		const dir = parts.join('/');
		if (existing.has(dir)) {
			break;
		}

		directories.push({
			type: 'directory',
			name: dir,
			basename: /** @type {string} */ (parts.at(-1))
		});
	}

	return directories;
}
