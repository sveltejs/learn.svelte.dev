import * as db from '$lib/server/database.js';

export function load({ cookies }) {
	const id = cookies.get('userid');

	if (!id) {
		cookies.set('userid', crypto.randomUUID(), { path: '/' });
	}

	return {
		todos: db.getTodos(id) ?? []
	};
}

export const actions = {
	default: async ({ cookies, request }) => {
		const userid = cookies.get('userid');
		const data = await request.formData();

		db.createTodo(userid, data.get('description'));
	}
};
