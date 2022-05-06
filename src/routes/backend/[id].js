import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sveltekit_pkg_file = require.resolve('@sveltejs/kit/package.json');
const sveltekit_pkg = JSON.parse(fs.readFileSync(sveltekit_pkg_file, 'utf-8'));
const sveltekit = path.resolve(sveltekit_pkg_file, '..', sveltekit_pkg.bin['svelte-kit']);

// poor man's HMR, pending Vite fix
if (globalThis.__processes) {
	globalThis.__processes.forEach((process) => {
		process.kill();
	});
}

/** @type {Map<string, import('child_process').ChildProcess>} */
const processes = new Map();
globalThis.__processes = processes;

/** @type {import('./[id]').RequestHandler} */
export async function put({ request, params, url }) {
	const { id } = params;
	const port = /** @type {string} */ (url.searchParams.get('port'));

	const dir = `.apps/${id}`;

	/** @type {Array<import('$lib/types').File | import('$lib/types').Directory>} */
	const files = await request.json();

	for (const file of files) {
		if (file.type === 'file') {
			const dest = `${dir}/${file.name}`;
			fs.mkdirSync(path.dirname(dest), { recursive: true });
			fs.writeFileSync(dest, file.contents);
		}
	}

	if (!processes.has(id)) {
		processes.set(id, launch(id, port));
	}

	return {
		status: 201
	};
}

/** @type {import('./[id]').RequestHandler} */
export async function del({ params }) {
	const { id } = params;
	const dir = `.apps/${id}`;

	fs.rmSync(dir, { recursive: true, force: true });

	processes.get(id)?.kill();
	processes.delete(id);

	return {
		status: 201
	};
}

/**
 * @param {string} id
 * @param {string} port
 */
function launch(id, port) {
	const cwd = `.apps/${id}`;

	const process = spawn(`${sveltekit}`, ['dev', '--port', port], {
		cwd,
		stdio: 'inherit' // TODO send to the client via a webworker?
	});

	return process;
}
