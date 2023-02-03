import fs from 'fs';
import AdmZip from 'adm-zip';

const zip = new AdmZip('common.zip');
zip.extractAllTo('.');

if (!fs.existsSync('node_modules/.bin')) {
	fs.mkdirSync('node_modules/.bin');
}

fs.symlinkSync('../@sveltejs/kit/svelte-kit.js', 'node_modules/.bin/svelte-kit');
fs.chmodSync('node_modules/.bin/svelte-kit', 0o777);

fs.symlinkSync('../esbuild/bin/esbuild', 'node_modules/.bin/esbuild');
fs.chmodSync('node_modules/.bin/esbuild', 0o777);
