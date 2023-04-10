export function load(event) {
	return {
		message: `the answer is ${event.locals.answer}`
	};
}