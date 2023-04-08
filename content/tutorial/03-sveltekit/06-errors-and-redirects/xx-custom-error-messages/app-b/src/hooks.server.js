export function handleError({ error }) {
	return { message: error instanceof Error ? error.message : 'Internal Error' };
}
