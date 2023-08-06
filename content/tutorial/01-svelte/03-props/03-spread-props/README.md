---
title: Décomposition des props
---

Dans cet exercice, nous avons oublié de spécifier la propriété `version` attendue par `PackageInfo.svelte`, ce qui signifie qu'il affiche 'version undefined'.

Nous _pourrions_ corriger cela en ajoutant la propriété `version`...

```svelte
/// file: App.svelte
<PackageInfo
    name={pkg.name}
	speed={pkg.speed}
    +++version={pkg.version}+++
	website={pkg.website}
/>
```

...mais comme les propriétés de `pkg` correspondent aux propriétés attendues du composant, nous pouvons les "répartir" sur le composant à la place :

```svelte
/// file: App.svelte
<PackageInfo +++{...pkg}+++ />
```

> Inversement, si vous avez besoin de référencer toutes les <span class="vo">[props](SVELTE_SITE_URL/docs/sveltejs#props)</span> qui ont été passées à un composant, y compris celles non spécifiées avec le mot clé `export`, vous pouvez le faire avec l'objet `$$props` directement. Ce n'est pas recommandé, car cela rend difficile l'optimisation pour Svelte, mais peut être très pratique dans de rares cas.
