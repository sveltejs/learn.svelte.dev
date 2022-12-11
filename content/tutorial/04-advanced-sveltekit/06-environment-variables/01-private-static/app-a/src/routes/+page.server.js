import { db } from './db.js';

export function load() {
	return db.getData(import.meta.env.VITE_API_SECRET);
}
