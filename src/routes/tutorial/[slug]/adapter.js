/**
 * @param {import('$lib/types').Stub[]} initial_stubs
 * @param {(progress: number, status: string) => void} callback
 * @returns {import('$lib/types').Adapter}
 */
export function create_adapter(initial_stubs, callback) {
	/**
	 * @typedef {{ type: 'reset'; stubs: import('$lib/types').Stub[]; } | { type: 'update'; stubs: import('$lib/types').FileStub[]; }} State
	 */

	/** @type {State | undefined} */
	let state;
	/** @type {Promise<import('$lib/types').AdapterInternal>} */
	let adapter_promise;
	let adapter_base = '';

	async function init() {
		const module = await import('$lib/client/adapters/webcontainer/index.js');
		adapter_promise = module.create(initial_stubs, callback);
		adapter_base = (await adapter_promise).base;
	}

	// Keep track of what's currently running, and what's next
	/** @type {Promise<boolean>} */
	let current;
	let token = {};
	async function next() {
		const current_token = (token = {});
		await current;
		if (current_token !== token || !state) return 'cancelled';

		const _state = state;
		state = undefined;
		current = (async () => {
			if (_state.type === 'reset') {
				const adapter = await adapter_promise;
				return await adapter.reset(_state.stubs);
			} else {
				const adapter = await adapter_promise;
				return await adapter.update(_state.stubs);
			}
		})();

		return current;
	}

	current = init().then(() => true);

	return {
		init: current.then(() => {}),
		get base() {
			return adapter_base;
		},
		update: async (stubs) => {
			if (state) {
				// add new stubs (which have up-to-date content) to existing stubs
				const new_stubs = new Set(stubs.map((stub) => stub.name));
				state = {
					...state,
					// @ts-expect-error TS doesn't understand that the union type will be well-formed
					stubs: state.stubs.filter((stub) => !new_stubs.has(stub.name)).concat(stubs)
				};
			} else {
				state = { type: 'update', stubs };
			}
			return next();
		},
		reset: async (stubs) => {
			state = { type: 'reset', stubs };
			return next();
		},
		destroy: async () => {
			const adapter = await adapter_promise;
			return adapter.destroy();
		}
	};
}
