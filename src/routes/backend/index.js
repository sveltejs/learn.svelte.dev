import fs from 'node:fs';
import { ready } from './_ws';

fs.rmSync('.apps', { recursive: true, force: true });
fs.mkdirSync('.apps', { recursive: true });

let port = 3001;

/** @type {import('./index').RequestHandler} */
export async function post() {
	const id = String(Date.now());

	fs.mkdirSync(`.apps/${id}`);

	await ready;

	return {
		status: 201, // should this be a 200?
		body: {
			id,
			port: port++
		}
	};
}
