export const db = {
	getData: (secret) => {
		// assume the secret is used to authenticate with the database
		return {
			text: 'Hello from your database'
		};
	}
};
