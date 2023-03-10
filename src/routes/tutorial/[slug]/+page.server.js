import { get_exercise } from '$lib/server/content';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const exercise = get_exercise(params.slug);

	if (!exercise) {
		throw error(404, 'No such tutorial found');
	}

	return {
		exercise
	};
}
