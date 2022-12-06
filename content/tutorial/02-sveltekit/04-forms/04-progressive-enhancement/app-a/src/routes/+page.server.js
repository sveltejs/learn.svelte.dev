import { redirect, invalid } from '@sveltejs/kit';

export const actions = {
	login: async ({ request }) => {
		const fields = await request.formData();
		if (fields.get('email') !== 'svelte@kit.dev' || fields.get('password') !== 'tutorial') {
			return invalid(422, { message: 'Invalid Credentials' });
		}
		throw redirect(307, '/user');
	},
	register: async ({ request }) => {
		const fields = await request.formData();
		if (fields.get('email') === 'svelte@kit.dev') {
			return invalid(422, { message: 'Email already in use' });
		}
		throw redirect(307, '/user');
	}
};
