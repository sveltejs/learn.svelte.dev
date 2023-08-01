export function handleError({ event, error }) {
	console.error(error.stack);

	return {
		message: 'tout va bien',
		code: 'JEREMYBEARIMY'
	};
}
