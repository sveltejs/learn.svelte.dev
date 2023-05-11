/**
 * Checks if WebContainer is supported on the current browser.
 * This function is borrowed from [stackblitz/webcontainer-docs](https://github.com/stackblitz/webcontainer-docs/blob/369dd58b2749b085ed7642f22108a9bcbcd68fc4/docs/.vitepress/theme/components/Examples/WCEmbed/utils.ts#L4-L29)
 */
export function isWebContainerSupported() {
	const hasSharedArrayBuffer = 'SharedArrayBuffer' in window;
	const looksLikeChrome = navigator.userAgent.toLowerCase().includes('chrome');
	const looksLikeFirefox = navigator.userAgent.includes('Firefox');
	const looksLikeSafari = navigator.userAgent.includes('Safari');

	if (hasSharedArrayBuffer && (looksLikeChrome || looksLikeFirefox)) {
		return true;
	}

	if (hasSharedArrayBuffer && looksLikeSafari) {
		// we only support Safari 16.4 and up so we check for the version here
		const match = navigator.userAgent.match(/Version\/(\d+)\.(\d+) (?:Mobile\/.*?)?Safari/);
		const majorVersion = match ? Number(match?.[1]) : 0;
		const minorVersion = match ? Number(match?.[2]) : 0;

		return majorVersion > 16 || (majorVersion === 16 && minorVersion >= 4);
	}

	// Allow overriding the support check with localStorage.webcontainer_any_ua = 1
	try {
		return Boolean(localStorage.getItem('webcontainer_any_ua'));
	} catch {
		return false;
	}
}
