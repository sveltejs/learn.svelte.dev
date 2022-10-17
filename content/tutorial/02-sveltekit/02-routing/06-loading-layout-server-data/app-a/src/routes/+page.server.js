import { db } from './fake-db';

export async function load() {
	const greeting = await db.getGreeting('page');
	return { greeting };
}
