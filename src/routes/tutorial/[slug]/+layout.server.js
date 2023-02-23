import { get_index } from '$lib/server/content';

export function load() {
	return {
		index: get_index()
	};
}
