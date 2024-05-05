export function handleError({ event, error }) {
	console.error(error);

	return {
		message: 'everything is fine',
		code: 'JEREMYBEARIMY'
	};
}