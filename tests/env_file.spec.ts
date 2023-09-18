import { expect, test, type Page } from '@playwright/test';

const iframe_selector = 'iframe[src*="webcontainer.io/"]';

async function disableAnimations(page: Page) {
	await page.addStyleTag({
		content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `
	});
}

test.describe.configure({ mode: 'parallel' });

test('.env file: no timeout error occurs when switching a tutorials without a .env file to one with it', async ({
	page
}) => {
	await page.bringToFront();

	await page.goto('/tutorial/welcome-to-svelte');

	// disable animations to prevent flakiness
	await disableAnimations(page);

	const iframe_locator = page.frameLocator(iframe_selector);

	// wait for the iframe to load
	await iframe_locator.getByText('Welcome!').waitFor();

	// switch to another tutorial with a .env file
	await page.click('header > button > h1', { delay: 200 });
	await page.getByRole('button', { name: 'Part 4: Advanced SvelteKit' }).click({ delay: 200 });
	await page.getByRole('button', { name: 'Environment variables' }).click({ delay: 200 });
	await page.locator('a', { hasText: '$env/static/private' }).click({ delay: 200 });

	// wait for the iframe to load
	await iframe_locator.getByText('enter the passphrase').waitFor();

	// wait for a bit, because when Vite dev server is restarted, learn.svelte.dev
	// will wait for 10 seconds, after which time a timeout error will occur.
	await page.waitForTimeout(11000);

	// expect no timeout error
	await expect(page.getByText('Yikes!')).toBeHidden();
	await expect(iframe_locator.getByText('enter the passphrase')).toBeVisible();
});

test('.env file: environment variables are available when switching a tutorial without a .env file to one with it', async ({
	page
}) => {
	await page.bringToFront();

	await page.goto('/tutorial/welcome-to-svelte');

	// disable animations to prevent flakiness
	await disableAnimations(page);

	const iframe_locator = page.frameLocator(iframe_selector);

	// wait for the iframe to load
	await iframe_locator.getByText('Welcome!').waitFor();

	// switch to another tutorial with a .env file
	await page.click('header > button > h1', { delay: 200 });
	await page.getByRole('button', { name: 'Part 4: Advanced SvelteKit' }).click({ delay: 200 });
	await page.getByRole('button', { name: 'Environment variables' }).click({ delay: 200 });
	await page.locator('a', { hasText: '$env/dynamic/private' }).click({ delay: 200 });

	// wait for the iframe to load
	await iframe_locator.getByText('enter the passphrase').waitFor();

	await page.waitForTimeout(3000);

	// login
	// 'open sesame' is the environment variables loaded from `.env` file
	await iframe_locator.locator('input[name="passphrase"]').fill('open sesame');
	await page.keyboard.press('Enter', { delay: 1000 });

	// expect to be able to login.
	// Being able to log in means that environment variables are loaded.
	await expect(iframe_locator.getByText('wrong passphrase!')).toBeHidden();
	await expect(iframe_locator.locator('button', { hasText: 'log out' })).toBeEnabled();
});
