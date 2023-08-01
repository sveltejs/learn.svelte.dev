---
title: Recharger la page
---

D'habitude, SvelteKit va naviguer entre les pages sans recharger la page. Dans cet exercice, si nous naviguons entre `/` et `/about`, l'horloge continue de tourner.

Dans de rares cas, vous pourriez vouloir désactiver ce comportement. Vous pouvez le faire en ajoutant l'attribut `data-sveltekit-reload` sur un lien individuel, ou sur tout élément contenant des liens :

```svelte
/// file: src/routes/+layout.svelte
<nav +++data-sveltekit-reload+++>
	<a href="/">accueil</a>
	<a href="/about">à propos</a>
</nav>
```

Pour plus d'informations sur les options de liens disponibles et leurs valeurs, consultez la [documentation sur les options de liens](PUBLIC_KIT_SITE_URL/docs/link-options).
