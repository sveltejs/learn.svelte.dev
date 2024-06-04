import { error } from '@sveltejs/kit';
import * as db from '$lib/server/data.js';

export function load({ params }) {
	const post = db.getPost(params.slug);
	
	if (!post) throw error(404);

	return {
		post
	};
}
