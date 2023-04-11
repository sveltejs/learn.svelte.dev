---
title: Optional parameters
---

In the first chapter on [routing](/tutorial/pages), we learned how to create routes with [dynamic parameters](/tutorial/params).

Sometimes it's helpful to make a parameter optional. A classic example is when you use the pathname to determine the locale — `/fr/...`, `/de/...` and so on — but you also want to have a default locale.

To do that, we use double brackets. Rename the `[lang]` directory to `[[lang]]`.

The app now fails to build, because `src/routes/+page.svelte` and `src/routes/[[lang]]/+page.svelte` would both match `/`. Delete `src/routes/+page.svelte`. (You may need to reload the app to recover from the error page).

Lastly, edit `src/routes/[[lang]]/+page.server.js` to specify the default locale:

```js
/// file: src/routes/[[lang]]/+page.server.js
const greetings = {
	en: 'hello!',
	de: 'hallo!',
	fr: 'bonjour!'
};

export function load({ params }) {
	return {
		greeting: greetings[params.lang +++?? 'en'+++]
	};
}
```
