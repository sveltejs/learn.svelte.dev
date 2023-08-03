---
title: Liaisons des select
---

Nous pouvons également utiliser `bind:value` avec les éléments `<select>`. Changez la ligne 20 :

```svelte
/// file: App.svelte
<select
    +++bind:+++value={selected}
    on:change={() => answer = ''}
>
```

Notez que les valeur de `<option>` sont des objets plutôt que des chaînes de caractères. Svelte ne s'en offusque pas.

> Puisque nous n'avons pas fourni à `selected` une valeur initiale, la liaison va lui assigner automatiquement la valeur par défaut (la première dans la liste). Soyez tout de même vigilant•e — tant que la liaison n'est pas initialisée, `selected` vaut `undefined`, de sorte que nous ne pouvons pas référencer à l'aveugle `selected.id` (par ex.) dans le template. Si votre situation le permet, vous pourriez aussi lui assigner une valeur initiale pour contourner ce problème.
