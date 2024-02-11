---
title: <svelte:options>
---

L'élément `<svelte:options>` vous permet de préciser des options de compilateur.

Ici nous prenons l'option `immutable` comme exemple. Dans cette application, les instances `<Todo>` clignotent lorsqu'elles reçoivent une nouvelle donnée. Le clic sur un des éléments de la liste active ou désactive son état `done` en créant un nouveau tableau `todos` avec des données à jour. Cela entraîne le clignotement des _autres_ `<Todo>`, même si au final aucun changement de <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span> ne les concerne.

Nous pouvons améliorer ce comportement en disant au composant `Todo` d'attendre de la donnée _immutable_. Cela signifie que nous nous engageons à ne _jamais muter_ la <span class="vo">[prop](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span> `todo`, mais à la place nous créerons des nouveaux objets `todo` dès que quelque chose changera.

Ajoutez ceci en haut du fichier `Todo.svelte` :

```svelte
/// file: Todo.svelte
<svelte:options immutable={true} />
```

> You can shorten this to `<svelte:options immutable/>` if you prefer.

À partir de maintenant, lorsque vous cliquez sur les éléments de la liste, seul le composant cliqué clignote.

Les options possibles sont :

- `immutable={true}` — vous n'utilisez jamais de données mutable, le compilateur peut donc se contenter de vérifier l'égalité de valeur par référence pour déterminer si les valeurs ont changé
- `immutable={false}` — par défaut. Svelte sera conservatif pour vérifier si les objets mutables ont changé ou non
- `accessors={true}` — ajoute des <span class="vo">[getters et des setters](PUBLIC_SVELTE_SITE_URL/docs/development#getter-setter)</span> aux <span class="vo">[prop](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span> du composant
- `accessors={false}` — par défaut
- `namespace="..."` — le <span class="vo">[namespace](PUBLIC_SVELTE_SITE_URL/docs/development#namespace)</span> dans lequel le composant sera utilisé, le plus souvent `"svg"`
- `customElement="..."` — le nom à utiliser lorsque l'on compile ce composant en <span class="vo">[web component](PUBLIC_SVELTE_SITE_URL/docs/web#web-component)</span>

Consultez la [documentation de référence](PUBLIC_SVELTE_SITE_URL/docs/special-elements#svelte-options) pour plus d'informations sur ces options.
