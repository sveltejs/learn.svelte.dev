// We'll get to +server.js in a later chapter

export function GET({ url }) {
	return new Response('Hello ' + url.search);
}
