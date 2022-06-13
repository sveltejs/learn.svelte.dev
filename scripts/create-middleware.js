// this generates some middleware that will set COOP/COEP headers
// so that webcontainers work. ideally there'd be a more idiomatic
// way to do this, but it'll do in the meantime

import fs from 'fs';

if (!fs.existsSync('.vercel/output/config.json')) {
	throw new Error('.vercel/output does not exist');
}

const fn = `
export default function middleware(_request, _event) {
	const response = new Response();

	response.headers.set('cross-origin-opener-policy', 'same-origin');
	response.headers.set('cross-origin-embedder-policy', 'require-corp');
	response.headers.set('cross-origin-resource-policy', 'cross-origin');
	response.headers.set('x-middleware-next', '1');

	return response;
}
`;

const config = JSON.parse(fs.readFileSync('.vercel/output/config.json', 'utf-8'));
config.routes.unshift({
	src: '/(.*)',
	middlewarePath: '_middleware',
	continue: true
});
fs.writeFileSync('.vercel/output/config.json', JSON.stringify(config));

fs.mkdirSync('.vercel/output/functions/_middleware.func');

fs.writeFileSync(
	'.vercel/output/functions/_middleware.func/.vc-config.json',
	JSON.stringify({
		runtime: 'edge',
		entrypoint: 'index.js'
	})
);

fs.writeFileSync('.vercel/output/functions/_middleware.func/index.js', fn);
