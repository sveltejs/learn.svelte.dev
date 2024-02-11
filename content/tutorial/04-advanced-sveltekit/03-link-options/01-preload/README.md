---
title: Chargement anticipé
---

Dans cet exercice, les routes `/slow-a` et `slow-b` ont toutes les deux des ralentissements artificiels dans leurs fonctions `load`, ce qui veut dire qu'y accéder prend un temps conséquent.

Vous ne pouvez pas toujours faire en sorte que votre donnée soit chargées rapidement — c'est parfois hors de votre contrôle — mais SvelteKit peut accélérer les navigations en les _anticipant_. Lorsqu'un élément `<a>` a l'attribut `data-sveltekit-preload-data`, SvelteKit va commencer la navigation aussitôt que le lien est survolé (sur <span class="vo">[desktop](PUBLIC_SVELTE_SITE_URL/docs/web#desktop)</span>) ou appuie dessus (sur mobile). Essayez d'ajouter cet attribut au premier lien :

```svelte
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">home</a>
	<a href="/slow-a" +++data-sveltekit-preload-data+++>slow-a</a>
	<a href="/slow-b">slow-b</a>
</nav>
```

Naviguer vers `/slow-a` sera désormais significativement plus rapide. Commencer la navigation au survol ou au toucher (plutôt qu'attendre que l'évènement `click` soit traité) peut ne pas paraître comme une différence notable, mais en pratique cela économise généralement 200 ms, voire plus. C'est suffisant pour faire la différence entre une navigation laborieuse et une navigation rapide.

Vous pouvez mettre l'attribut sur des liens individuels, ou sur tout élément qui _contient_ des liens. Le <span class="vo">[template](PUBLIC_SVELTE_SITE_URL/docs/development#template)</span> de projet par défaut fournit cet attribut à l'élément `<body>` :

```html
/// no-file
<body data-sveltekit-preload-data>
	%sveltekit.body%
</body>
```

Vous pouvez aller plus dans la personnalisation de ce comportement en précisant l'une des valeurs suivantes pour l'attribut :

- `"hover"` — au survol, valeur par défaut (correspond à `"tap"` sur mobile)
- `"tap"` — commence le pré-chargement uniquement au `"tap"`
- `"off"` — désactive le pré-chargement

Utiliser `data-sveltekit-preload-data` peut parfois résulter à des faux positifs — c'est-à-dire charger la donnée en anticipation d'une navigation qui finalement n'arrive jamais — ce qui peut être indésirable. L'alternative `data-sveltekit-preload-code` vous permet de pré-charger le JavaScript requis pour une route donnée sans en charger la donnée. Cet attribut peut avoir les valeurs suivantes :

- `"eager"` — pré-charge tout le contenu de la page à la navigation
- `"viewport"` — pré-charge tout le contenu au fur-et-à-mesure qu'il apparaît dans le <span class="vo">[viewport](PUBLIC_SVELTE_SITE_URL/docs/development#viewport)</span>
- `"hover"` (par défaut) comme précédemment
- `"tap"` — comme précédemment
- `"off"` — comme précédemment

Vous pouvez également initier le pré-chargement programmatiquement avec `preloadCode` et `preloadData` importées depuis `$app/navigation` :

```js
/// no-file
import { preloadCode, preloadData } from '$app/navigation';

// pré-charge le code et la donnée nécessaires pour naviguer vers /foo
preloadData('/foo');

// pré-charge le code nécessaire pour naviguer vers /bar, mais pas la donnée
preloadCode('/bar');
```
