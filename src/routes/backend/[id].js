import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sveltekit_pkg_file = require.resolve('@sveltejs/kit/package.json');
const sveltekit_pkg = JSON.parse(fs.readFileSync(sveltekit_pkg_file, 'utf-8'));
const sveltekit = path.resolve(sveltekit_pkg_file, '..', sveltekit_pkg.bin['svelte-kit']);

// poor man's HMR, pending Vite fix
if (globalThis.__apps) {
	globalThis.__apps.forEach((app) => {
		app.process.kill();
	});
}

/** @type {Map<string, { process: import('child_process').ChildProcess, files: string[] }>} */
const apps = new Map();
globalThis.__apps = apps;

/** @type {import('./[id]').RequestHandler} */
export async function put({ request, params, url }) {
	const { id } = params;
	const port = /** @type {string} */ (url.searchParams.get('port'));

	const dir = `.apps/${id}`;

	/** @type {Array<import('$lib/types').File | import('$lib/types').Directory>} */
	const files = await request.json();

	const app = apps.get(id);

	const old_files = new Set(app ? app.files : []);

	/** @type {string[]} */
	const new_files = [];

	for (const file of files) {
		if (file.type === 'file') {
			new_files.push(file.name);
			old_files.delete(file.name);

			const dest = `${dir}/${file.name}`;
			write_if_changed(dest, file.contents);
		}
	}

	// TODO this is buggy
	// for (const file of old_files) {
	// 	if (fs.existsSync(`${dir}/${file}`)) {
	// 		fs.unlinkSync(`${dir}/${file}`);
	// 	}
	// }

	if (app) {
		app.files = new_files;
	} else {
		apps.set(id, {
			process: launch(id, port),
			files: new_files
		});
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

	apps.get(id)?.process.kill();
	apps.delete(id);

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

/**
 *
 * @param {string} file
 * @param {string} contents TODO should also accept binary data
 */
function write_if_changed(file, contents) {
	if (fs.existsSync(file)) {
		const existing = fs.readFileSync(file, 'utf-8');
		if (contents === existing) return;
	}

	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, contents);
}
