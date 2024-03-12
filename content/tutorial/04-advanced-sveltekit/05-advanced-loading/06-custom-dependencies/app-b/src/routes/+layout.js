export async function load({ depends }) {
	depends('data:now');

	return {
		now: Date.now()
	};
}
