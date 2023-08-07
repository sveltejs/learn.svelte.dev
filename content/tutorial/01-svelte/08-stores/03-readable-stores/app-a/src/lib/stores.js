import { readable } from 'svelte/store';

export const time = readable(null, function start(set) {
	// le code lié à l'initialisation vient ici

	return function stop() {
		// le code lié au nettoyage vient là
	};
});
