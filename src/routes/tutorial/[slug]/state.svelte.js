import * as adapter from './adapter.svelte.js';

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

export const s = $state(
	/**
	 * @type {{
	 * 	files: import('$lib/types').Stub[];
	 * 	solution: Record<string, import('$lib/types').Stub>;
	 * 	creating: { parent: string, type: 'file' | 'directory' } | null;
	 * 	selected_name: string | null;
	 * 	selected_file: import('$lib/types').FileStub;
	 * }}
	 */
	({
		files: [],
		solution: {},
		creating: null,
		selected_name: null,
		get selected_file() {
			return (
				/** @type {import('$lib/types').FileStub | undefined} */ (
					this.files.find((stub) => stub.name === this.selected_name)
				) ?? null
			);
		}
	})
);

/** @param {import('$lib/types').FileStub} file */
export function update_file(file) {
	s.files = s.files.map((old) => {
		if (old.name === file.name) {
			return file;
		}
		return old;
	});

	adapter.update(file);
}

/** @param {import('$lib/types').Stub[]} new_files */
export function reset_files(new_files) {
	// if the selected file no longer exists, clear it
	const file = new_files.find((file) => file.name === s.selected_name);
	s.selected_name = file?.name ?? null;
	s.files = new_files;
	console.log('lets reset');
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
