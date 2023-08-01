---
title: handleFetch
---

L'objet `event` a une méthode `fetch` qui se comporte comme l'[API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) standard, mais avec des super pouvoirs :

- elle peut être utilisée pour effectuer des requêtes authentifiées sur le serveur, puisqu'elle hérite des <span class="vo">[headers](PUBLIC_SVELTE_SITE_URL/docs/web/header)</span> `cookie` et `authorization` de la requête entrante
- elle peut être utilisée pour effectuer des requêtes relatives sur le serveur (normalement `fetch` impose une URL avec une origine lorsqu'utilisée dans un contexte serveur)
- les requêtes internes (par ex. pour les routes `+server.js`) sont directement consommées par les fonctions adéquates sur le serveur, sans avoir besoin de faire un appel HTTP supplémentaire

Son comportement peut être modifié avec le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> `handleFetch`, qui par défaut ressemble à ceci :

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
	return await fetch(request);
}
```

Par exemple, nous pourrions répondre aux requêtes vers `src/routes/a/+server.js` avec des réponses de `src/routes/b/+server.js` à la place :

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
+++	const url = new URL(request.url);
	if (url.pathname === '/a') {
		return await fetch('/b');
	}+++

	return await fetch(request);
}
```

Lorsque nous étudierons les [fonctions `load` universelles](universal-load-functions), nous verrons que `event.fetch` peut aussi être appelée depuis le navigateur. Dans ce cas, `handleFetch` est utile si vous avez des requêtes partant du navigateur vers une URL publique comme `https://api.yourapp.com`, mais qui doit être redirigée vers une URL interne (en court-circuitant les éventuels <span class="vo">[proxies](PUBLIC_SVELTE_SITE_URL/docs/web#proxy)</span> ou <span class="vo">[load balancers](PUBLIC_SVELTE_SITE_URL/docs/web#load-balancer)</span> qui se trouvent entre le serveur d'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span> et l'internet public) lorsqu'elle est exécutée sur votre serveur.
