import fs from 'fs';
import esbuild from 'esbuild';
import AdmZip from 'adm-zip';
import glob from 'tiny-glob/sync.js';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const cwd = 'content/tutorial/common';

if (!fs.existsSync(`${cwd}/node_modules`)) {
	execSync('npm install', { cwd });
}

const zip = new AdmZip();

for (const file of glob('**', { cwd, filesOnly: true, dot: true })) {
	if (file.endsWith('/.DS_Store')) continue;
	if (file.startsWith('.svelte-kit/')) continue;
	if (file.endsWith('.d.ts')) continue;
	if (file.endsWith('.map')) continue;
	if (file.endsWith('.md')) continue;
	if (file.endsWith('/LICENSE')) continue;

	// special case
	if (file.startsWith('node_modules/esbuild-wasm/')) {
		zip.addFile(
			file.replace('node_modules/esbuild-wasm', 'node_modules/esbuild'),
			fs.readFileSync(`${cwd}/${file}`)
		);
		continue;
	}

	if (file.startsWith('node_modules/.bin')) continue;
	if (file.startsWith('node_modules/esbuild')) continue;

	zip.addFile(file, fs.readFileSync(`${cwd}/${file}`));
}

const out = zip.toBuffer();

fs.writeFileSync(`src/lib/client/adapters/common/common.zip`, out);

// bundle adm-zip so we can use it in the webcontainer
esbuild.buildSync({
	entryPoints: [fileURLToPath(new URL('./boot.js', import.meta.url))],
	bundle: true,
	platform: 'node',
	minify: true,
	outfile: 'src/lib/client/adapters/common/boot.cjs',
	format: 'cjs'
});
