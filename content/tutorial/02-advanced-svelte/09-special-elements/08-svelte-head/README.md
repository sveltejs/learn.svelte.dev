---
title: <svelte:head>
---

L'élément `<svelte:head>` vous permet d'insérer des éléments dans la balise `<head>` de votre document. Cela est utile pour les balises telles que `<title>` et `<meta>`, qui sont primordiales pour le <span class="vo">[SEO](PUBLIC_SVELTE_SITE_URL/docs/web#seo)</span>.

Puisque ces balises sont plutôt difficiles à montrer dans le contexte de ce tutoriel, nous allons plutôt voir un cas un peu différent — le chargement de feuilles de style.

```svelte
/// file: App.svelte
<script>
	const themes = ['margaritaville', 'retrowave', 'spaaaaace', 'halloween'];
	let selected = themes[0];
</script>

+++<svelte:head>
	<link rel="stylesheet" href="/stylesheets/{selected}.css" />
</svelte:head>+++

<h1>Bienvenue sur mon site !</h1>
```

> En mode <span class="vo">[SSR](PUBLIC_SVELTE_SITE_URL/docs/web#ssr)</span>, le contenu de `<svelte:head>` est envoyé séparément du reste de votre HTML.
