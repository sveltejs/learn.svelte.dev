import { redirect } from '@sveltejs/kit';

export const actions = {
	default: () => {
		throw redirect(307, '/user');
	}
};
