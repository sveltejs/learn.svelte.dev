export async function load() {
	const module = false
		? await import('./CoolComponent.svelte')
		: await import('./BoringComponent.svelte');

	return {
		component: module.default,
		message: 'TODO add a message'
	};
}
