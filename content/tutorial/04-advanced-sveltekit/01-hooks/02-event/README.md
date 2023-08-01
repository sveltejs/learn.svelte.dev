---
title: L'objet RequestEvent
---

L'objet `event` passé à `handle` est le même objet — une instance d'un objet [`RequestEvent`](PUBLIC_KIT_SITE_URL/docs/types#public-types-requestevent) — que celui passé dans les [routes d'API](get-handlers) dans les fichiers `+server.js`, dans les [actions de formulaires](the-form-element) des fichiers `+page.server.js`, et dans les fonctions `load` des fichiers `+page.server.js` et `+layout.server.js`.

Il contient un certain nombre de propriétés et méthodes utiles, dont certaines que nous avons déjà rencontré :

* `cookies` — l'[API de cookies](cookies)
* `fetch` — l'[API Fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API) standard, avec des pouvoirs supplémentaires
* `getClientAddress()` — une fonction pour obtenir l'adresse IP du client
* `isDataRequest` — `true` si le navigateur demande de la donnée pour une page durant la navigation côté client, `false` si une page/route est requêtée directement
* `locals` — un endroit pour mettre de la donnée arbitraire
* `params` — les paramètres de route
* `request` — l'objet [Request](https://developer.mozilla.org/fr/docs/Web/API/Request)
* `route` — un objet avec une propriété `id` représentant la route ciblée
* `setHeaders(...)` — une fonction pour [définir les headers HTTP](headers) sur la réponse
* `url` — un objet [URL](https://developer.mozilla.org/fr/docs/Web/API/URL) représentant la requête courante

Une utilisation pratique est d'ajouter de la donnée à `events.locals` dans `handle` afin d'y accéder dans les fonctions `load` exécutées ensuite :

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	+++event.locals.answer = 42;+++
	return await resolve(event);
}
```

```js
/// file: src/routes/+page.server.js
export function load(+++event+++) {
	return {
		message: `la réponse est ${+++event.locals.answer+++}`
	};
}
```

