import { readable } from 'svelte/store';

export const time = readable(null, function start(set) {
	// setup code goes here

	return function stop() {
		// teardown code goes here
	};
});
