import { expect, test } from '@playwright/test';

const editor_selector = '.cm-content';
const iframe_selector = 'iframe[src*="webcontainer.io/"]';

test.describe.configure({ mode: 'parallel' });

test('focus management: the editor keeps focus when iframe is loaded', async ({ page }) => {
	await page.bringToFront();

	await page.goto('/tutorial/your-first-component');

	// first, focus the editor before the iframe is loaded
	await page.waitForTimeout(1000);
	await page.locator(editor_selector).click();

	// at this time, expect focus to be on the editor
	await expect(page.locator(editor_selector)).toBeFocused();

	// wait for the iframe to load
	await page.frameLocator(iframe_selector).getByText('Hello world!').waitFor();

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// expect focus to be on the editor
	await expect(page.locator(editor_selector)).toBeFocused();
});

test('focus management: input inside the iframe gets focus when clicking it', async ({ page }) => {
	await page.bringToFront();

	await page.goto('/tutorial/named-form-actions');

	const iframe = page.frameLocator(iframe_selector);

	// wait for the iframe to load
	await iframe.getByText('todos').waitFor();

	// first, focus the editor
	await page.waitForTimeout(1000)
	await page.locator(editor_selector).click();
	await expect(page.locator(editor_selector)).toBeFocused();

	// then, click a input in the iframe
	const input = iframe.locator('input[name="description"]');
	await page.waitForTimeout(1000)
	await input.click();

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// expect focus to be on the input in the iframe, not the editor.
	await expect(input).toBeFocused();
	await expect(page.locator(editor_selector)).not.toBeFocused();
});

test('focus management: The editor keeps focus while typing', async ({ page }) => {
	await page.bringToFront();

	await page.goto('/tutorial/your-first-component');

	// wait for the iframe to load
	await page.frameLocator(iframe_selector).getByText('Hello world!').waitFor();

	// first, write script tag
	const code = '<script>\n\n</script>\n';
	await page.locator(editor_selector).fill(code);

	// move the cursor into the script tag
	await page.waitForTimeout(500);
	await page.keyboard.press('PageUp');
	await page.waitForTimeout(500);
	await page.keyboard.press('ArrowDown');

	// wait a little because the above operation is flaky
	await page.waitForTimeout(500);

	// type the code as a person would do it manually
	await page.keyboard.type(`	export let data;`, { delay: 150 });

	// wait a little, because there may be a script that manipulates focus
	await page.waitForTimeout(1000);

	// get code from DOM, then replace nbsp with normal space
	const received = (await page.locator(editor_selector).innerText()).replace(/\u00a0/g, ' ');

	const expected = '<script>\n\texport let data;\n</script>\n\n';

	expect(received).toBe(expected);
});
