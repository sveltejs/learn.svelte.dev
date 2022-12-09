import { API_SECRET } from '$env/static/private';
import { db } from './db.js';

export function load() {
	return db.getData(API_SECRET);
}
