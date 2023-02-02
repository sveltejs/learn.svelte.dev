import { expect, test, chromium } from '@playwright/test';

const chromium_flags = ['--enable-features=SharedArrayBuffer'];

const editor_selector = 'div.monaco-scrollable-element.editor-scrollable';
const editor_focus_selector = 'textarea.inputarea.monaco-mouse-cursor-text';
const iframe_selector = 'iframe[src*="webcontainer.io/"]';

test('focus management: the editor keeps focus when iframe is loaded', async () => {
	const context = await chromium.launchPersistentContext('', { args: chromium_flags });
	const page = context.pages()[0];
	await page.bringToFront();

	await page.goto('/tutorial/your-first-component');

	// first, focus the editor before the iframe is loaded
	await page.locator(editor_selector).click({ delay: 1000 });

	// at this time, expect focus to be on the editor
	await expect(page.locator(editor_focus_selector)).toBeFocused();

	// wait for the iframe to load
	await page.frameLocator(iframe_selector).getByText('Hello world!').waitFor();

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// expect focus to be on the editor
	await expect(page.locator(editor_focus_selector)).toBeFocused();

	await context.close();
});

test('focus management: input inside the iframe gets focus when clicking it', async () => {
	const context = await chromium.launchPersistentContext('', { args: chromium_flags });
	const page = context.pages()[0];
	await page.bringToFront();

	await page.goto('/tutorial/named-form-actions');

	const iframe = page.frameLocator(iframe_selector);

	// wait for the iframe to load
	await iframe.getByText('todos').waitFor();

	// first, focus the editor
	await page.locator(editor_selector).click({ delay: 1000 });
	await expect(page.locator(editor_focus_selector)).toBeFocused();

	// then, click a input in the iframe
	const input = iframe.locator('input[name="description"]');
	await input.click({ delay: 500 });

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// expect focus to be on the input in the iframe, not the editor.
	await expect(input).toBeFocused();
	await expect(page.locator(editor_focus_selector)).not.toBeFocused();

	await context.close();
});

test('focus management: body inside the iframe gets focus when clicking a link inside the iframe', async () => {
	const context = await chromium.launchPersistentContext('', { args: chromium_flags });
	const page = context.pages()[0];
	await page.bringToFront();

	await page.goto('/tutorial/layouts');

	const iframe = page.frameLocator(iframe_selector);

	// wait for the iframe to load
	await iframe.getByText('this is the home page.').waitFor();

	// first, focus the editor
	await page.locator(editor_selector).click({ delay: 1000 });
	await expect(page.locator(editor_focus_selector)).toBeFocused();

	// then, click a link in the iframe
	await iframe.locator('a[href="/about"]').click({ delay: 500 });

	// wait for navigation
	await iframe.getByText('this is the about page.').waitFor();

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// expect focus to be on body in the iframe, not the editor.
	await expect(iframe.locator('body')).toBeFocused();

	await context.close();
});

test('focus management: the editor keeps focus while typing', async () => {
	const context = await chromium.launchPersistentContext('', { args: chromium_flags });
	const page = context.pages()[0];
	await page.bringToFront();

	await page.goto('/tutorial/your-first-component');

	// wait for the iframe to load
	await page.frameLocator(iframe_selector).getByText('Hello world!').waitFor();

	// first, write script tag
	const code = '<script>\n\n</script>\n';
	await page.locator(editor_focus_selector).fill(code);

	// move the cursor into the script tag
	await page.keyboard.press('PageUp', { delay: 500 });
	await page.keyboard.press('ArrowDown', { delay: 500 });

	// wait a little because the above operation is flaky
	await page.waitForTimeout(500);

	// type the code as a person would do it manually
	await page.keyboard.type(`	export let data;`, { delay: 100 });

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// get code from DOM, then replace nbsp with normal space
	const received = (await page.locator(editor_selector).innerText()).replace(/\u00a0/g, ' ');

	const expected = '<script>\n  export let data;\n</script>\n<h1>Hello world!</h1>';

	expect(received).toBe(expected);

	await context.close();
});
