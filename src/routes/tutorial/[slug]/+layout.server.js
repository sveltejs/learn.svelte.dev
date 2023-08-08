import { get_index } from '$lib/server/content.js';

export function load() {
	return {
		index: get_index()
	};
}
