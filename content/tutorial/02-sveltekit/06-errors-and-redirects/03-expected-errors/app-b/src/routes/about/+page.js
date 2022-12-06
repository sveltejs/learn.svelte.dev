import { error } from '@sveltejs/kit';

export function load() {
	throw error(403, "I changed my mind, I don't want you to see this");
}
