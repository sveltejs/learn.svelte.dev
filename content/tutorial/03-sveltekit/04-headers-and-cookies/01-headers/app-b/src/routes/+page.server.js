export function load({ setHeaders }) {
	setHeaders({
		'X-Content-Type-Options': 'nosniff',
		'Content-Type': 'text/plain'
	});
}
