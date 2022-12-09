import { VITE_SECRET } from '$env/static/private';
import { db } from './db.js';

export function load() {
	return db.getData(VITE_SECRET);
}
