---
title: Spread props
---

In this exercise, we've forgotten to specify the `version` prop expected by `PackageInfo.svelte`, meaning it shows 'version undefined'.

We _could_ fix it by adding the `version` prop...

```svelte
/// file: App.svelte
<PackageInfo
    name={pkg.name}
	speed={pkg.speed}
    +++version={pkg.version}+++
	website={pkg.website}
/>
```

...but since the properties of `pkg` correspond to the component's expected props, we can 'spread' them onto the component instead:

```svelte
/// file: App.svelte
<PackageInfo +++{...pkg}+++ />
```

> Conversely, if you need to reference all the props that were passed into a component, including ones that weren't declared with `export`, you can do so by accessing `$$props` directly. It's not generally recommended, as it's difficult for Svelte to optimise, but it's useful in rare cases.
