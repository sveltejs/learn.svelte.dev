import { derived, writable } from 'svelte/store';

/**
 * @typedef {{
 *  status: 'initial' | 'selecting' | 'resetting' | 'updating' | 'switching';
 *  stubs: import("$lib/types").Stub[];
 *  last_updated?: import("$lib/types").FileStub;
 *  selected: string | null;
 *  exercise: {
 *    initial: import("$lib/types").Stub[];
 *    solution: Record<string, import("$lib/types").Stub>;
 *    editing_constraints: import("$lib/types").EditingConstraints;
 *  };
 * }} State
 */

/**
 * @type {import('svelte/store').Writable<State>}
 */
const _state = writable({
	status: 'initial',
	stubs: [],
	selected: null,
	exercise: {
		initial: [],
		solution: {},
		editing_constraints: {
			create: [],
			remove: []
		}
	}
});

export const state = {
	subscribe: _state.subscribe,
	/** @param {import('$lib/types').FileStub} file */
	update: (file) =>
		_state.update((state) => {
			state.status = 'updating';
			state.stubs = state.stubs.map((stub) => {
				if (stub.name === file.name) {
					return file;
				}
				return stub;
			});
			state.last_updated = file;
			return state;
		}),
	/** @param {import('$lib/types').Stub[]} [stubs] */
	reset: (stubs) =>
		_state.update((state) => {
			state.status = 'resetting';
			state.stubs = stubs || state.stubs;
			state.last_updated = undefined;
			return state;
		}),
	/** @param {import('$lib/types').Exercise} exercise */
	switch: (exercise) =>
		_state.update((state) => {
			const solution = { ...exercise.a };
			const editing_constraints = {
				create: exercise.editing_constraints.create,
				remove: exercise.editing_constraints.remove
			};

			// TODO should exercise.a/b be an array in the first place?
			for (const stub of Object.values(exercise.b)) {
				if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
					// remove file
					if (!editing_constraints.remove.includes(stub.name)) {
						editing_constraints.remove.push(stub.name);
					}
					delete solution[stub.name];
				} else if (stub.name.endsWith('/__delete')) {
					// remove directory
					const parent = stub.name.slice(0, stub.name.lastIndexOf('/'));
					if (!editing_constraints.remove.includes(parent)) {
						editing_constraints.remove.push(parent);
					}
					delete solution[parent];
					for (const k in solution) {
						if (k.startsWith(parent + '/')) {
							delete solution[k];
						}
					}
				} else {
					if (!solution[stub.name] && !editing_constraints.create.includes(stub.name)) {
						editing_constraints.create.push(stub.name);
					}
					solution[stub.name] = exercise.b[stub.name];
				}
			}

			state.status = 'switching';
			state.stubs = Object.values(exercise.a);
			state.exercise = {
				initial: Object.values(exercise.a),
				solution,
				editing_constraints
			};
			state.last_updated = undefined;
			state.selected = exercise.focus;
			return state;
		}),
	toggle_completion: () =>
		_state.update((state) => {
			if (is_completed(state)) {
				state.stubs = state.exercise.initial;
			} else {
				state.stubs = Object.values(state.exercise.solution);
			}
			state.status = 'resetting';
			state.last_updated = undefined;
			return state;
		}),
	/** @param {string | null} name */
	select: (name) =>
		_state.update((state) => {
			state.status = 'selecting';
			state.selected = name;
			state.last_updated = undefined;
			return state;
		})
};

export const files = derived(state, ($state) => $state.stubs);

export const selected = derived(
	state,
	($state) =>
		/** @type{import('$lib/types').FileStub | undefined} */ (
			$state.stubs.find((stub) => stub.name === $state.selected)
		) ?? null
);

export const solution = derived(state, ($state) => $state.exercise.solution);

export const editing_constraints = derived(state, ($state) => $state.exercise.editing_constraints);

export const completed = derived(state, is_completed);

/**
 * @param {State} $state
 */
function is_completed($state) {
	const all_stubs_correct = $state.stubs.every((stub) => {
		if (stub.type === 'directory') {
			return true;
		} else if (stub.type === 'file' && stub.name in $state.exercise.solution) {
			const expected = $state.exercise.solution[stub.name];
			return expected.type === 'file' && normalise(stub.contents) === normalise(expected.contents);
		} else {
			return false;
		}
	});

	const stub_names = new Set($state.stubs.map((stub) => stub.name));
	const stubs_complete = Object.keys($state.exercise.solution).every((name) =>
		stub_names.has(name)
	);
	console.log(all_stubs_correct, stubs_complete);

	return all_stubs_correct && stubs_complete;
}

/** @param {string} code */
function normalise(code) {
	// TODO think about more sophisticated normalisation (e.g. truncate multiple newlines)
	return code.replace(/\s+/g, ' ').trim();
}
