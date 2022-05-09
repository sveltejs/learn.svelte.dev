import fs from 'node:fs';

fs.rmSync('.apps', { recursive: true, force: true });
fs.mkdirSync('.apps', { recursive: true });

let port = 3001;

/** @type {import('./index').RequestHandler} */
export async function post() {
	const id = String(Date.now());

	fs.mkdirSync(`.apps/${id}`);

	return {
		status: 201, // should this be a 200?
		body: {
			id,
			port: port++
		}
	};
}
