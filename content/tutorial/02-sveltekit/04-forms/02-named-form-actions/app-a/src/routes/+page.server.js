import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const fields = await request.formData();
		if (fields.get('email') !== 'svelte@kit.dev' || fields.get('password') !== 'tutorial') {
			return invalid(422, { message: 'Invalid Credentials' });
		}
		throw redirect(307, '/user');
	}
};
