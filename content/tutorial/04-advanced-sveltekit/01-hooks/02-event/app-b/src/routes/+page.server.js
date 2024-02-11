export function load(event) {
	return {
		message: `la réponse est ${event.locals.answer}`
	};
}
