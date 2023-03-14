import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm preview',
		port: 4173
	},
	timeout: 60000,
	use: {
		trace: {
			mode: 'retain-on-failure'
		}
	}
};

export default config;
