export async function load({ depends }) {
	depends('tick:tock');
	return {
		time: new Date().toLocaleTimeString()
	};
}
