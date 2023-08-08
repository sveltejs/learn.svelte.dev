---
title: The @debug tag
---

Il est parfois utile d'inspecter votre donnée au fur et à mesure qu'elle traverse votre application.

Une approche est d'utiliser `console.log(...)` dans votre <span class="vo">[markup](/docs/web#markup)</span>. Mais si vous voulez mettre votre exécution en pause, vous pouvez utiliser la balise `{@debug ...}` avec une liste de valeurs que vous souhaitez inspecter séparées par des virgules :

```svelte
/// file: App.svelte
{@debug user}

<h1>Bonjour {user.firstname}!</h1>
```

Maintenant, si vous ouvrez vous outils de développement et commencez à interagir avec les éléments `<input>`, vous déclencherez le <span class='vo'>[debugger](SVELTE_SITE_URL/docs/development#bug)</span> à chaque fois que la valeur de `user` change.
