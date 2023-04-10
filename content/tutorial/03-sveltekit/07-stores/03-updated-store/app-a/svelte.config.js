export default {
	kit: {
		version: {
			// ideally, this should be something deterministic
			// like the output of `git rev-parse HEAD`
			name: Date.now().toString(),

			// if undefined, no polling will occur
			pollInterval: 5000
		}
	}
};