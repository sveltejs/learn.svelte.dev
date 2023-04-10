export async function handle({ event, resolve }) {
	event.locals.answer = 42;
	return await resolve(event);
}