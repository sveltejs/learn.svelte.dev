import { get_exercise } from '$lib/server/content';
import { error, redirect } from '@sveltejs/kit';

export function entries() {
	return [{ slug: 'transition-local' }];
}

export function load({ params }) {
	if (params.slug === 'transition-local') {
		throw redirect(307, '/tutorial/transition-global');
	}

	const exercise = get_exercise(params.slug);

	if (!exercise) {
		throw error(404, 'No such tutorial found');
	}

	return {
		exercise
	};
}
