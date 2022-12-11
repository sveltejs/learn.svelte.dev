export const db = {
	getData: (secret) => {
		if (!secret) {
			throw new Error('missing API secret');
		}
		// assume the secret is used to authenticate with the database
		return {
			text: 'Hello from your database'
		};
	}
};
