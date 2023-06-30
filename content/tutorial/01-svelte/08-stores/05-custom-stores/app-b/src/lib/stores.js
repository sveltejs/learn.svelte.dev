import { writable } from 'svelte/store';

function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update(x => ++x),
		decrement: () => update(x => --x),
		reset: () => set(0)
	};
}

export const count = createCount();
