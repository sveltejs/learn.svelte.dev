import * as db from '$lib/server/data.js';

export function load() {
	return {
		summaries: db.getSummaries()
	};
}
