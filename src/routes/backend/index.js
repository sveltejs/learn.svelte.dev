import fs from 'node:fs';
// import * as ports from 'port-authority';

fs.rmSync('.apps', { recursive: true, force: true });
fs.mkdirSync('.apps');

let port = 3001; // TODO use port-authority

/** @type {import('./index').RequestHandler} */
export async function post() {
	const id = String(Date.now());
	// const port = await ports.find(3000);

	fs.mkdirSync(`.apps/${id}`);

	console.log(`created ${id}`);

	return {
		status: 201, // should this be a 200?
		body: {
			id,
			port: port++
		}
	};
}
