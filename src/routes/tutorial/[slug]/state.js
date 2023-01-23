import { derived, writable } from 'svelte/store';

/**
 * @typedef {{
 *  status: 'initial' | 'resetting' | 'updating' | 'switching';
 *  stubs: import("$lib/types").Stub[];
 *  last_updated?: import("$lib/types").FileStub;
 *  selected: string | null;
 * }} State
 */

/**
 * @type {import('svelte/store').Writable<State>}
 */
const _state = writable({
	status: 'initial',
	stubs: [],
	selected: null
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
	/** @param {import('$lib/types').Stub[]} stubs */
	switch: (stubs) =>
		_state.update((state) => {
			state.status = 'switching';
			state.stubs = stubs;
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
