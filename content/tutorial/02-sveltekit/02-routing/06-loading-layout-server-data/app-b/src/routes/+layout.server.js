import { db } from './fake-db';

export async function load() {
	const greeting = await db.greet();
	return { greeting };
}
