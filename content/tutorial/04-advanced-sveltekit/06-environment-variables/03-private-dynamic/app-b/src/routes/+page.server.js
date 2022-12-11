import { env } from '$env/dynamic/private';
import { db } from './db.js';

export function load() {
	return db.getData(env.API_SECRET);
}
