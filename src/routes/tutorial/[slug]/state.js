import { derived, writable } from 'svelte/store';

/**
 * @typedef {{
 *  status: 'initial' | 'resetting' | 'updating' | 'switching';
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
			state.status = 'switching';
			state.stubs = Object.values(exercise.a);

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

			state.exercise = {
				initial: Object.values(exercise.a),
				solution,
				editing_constraints
			};
			state.last_updated = undefined;
			return state;
		}),
	/** @param {string | null} name */
	select: (name) =>
		_state.update((state) => {
			state.selected = name;
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
