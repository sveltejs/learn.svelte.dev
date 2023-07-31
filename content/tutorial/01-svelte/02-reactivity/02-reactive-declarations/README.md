---
title: Déclarations
---

Svelte met automatiquement à jour le DOM lorsque l'état de votre composant change. Certaines parties de l'état d'un composant doivent être calculées à partir d'autres variables et doivent être recalculées à chaque fois que ces dernières changent (comme un `nomComplet` dérivé d'un `prenom` et d'un `nom`), 

Pour ces cas, nous avons les **déclarations réactives**. Elles se présentent comme suit :

```js
/// file: App.svelte
let count = 0;
+++$: doubled = count * 2;+++
```

Si une déclaration réactive consiste entièrement en une affectation à une variable non déclarée, Svelte injectera une déclaration `let` pour vous.

> Ne vous inquiétez pas si cela semble un peu étrange. Cette syntaxe est du JavaScript [valide](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/label), même si peu conventionnel, que Svelte interprète ainsi : "ré-exécute ce code dès qu'une des variables référencées change". Une fois l'habitude prise, vous ne pourrez plus vous en passer.

Utilisons `doubled` dans notre <span class='vo'>_markup_</span> :

```svelte
/// file: App.svelte
<button>...</button>

<p>{count} fois 2 vaut {doubled}</p>
```

Bien sûr, vous pourriez très bien vous contenter d'écrire `{count * 2}` dans le <span class='vo'>_markup_</span> — vous n'êtes pas obligé•e•s d'utiliser des valeurs réactives. Les valeurs réactives deviennent particulièrement utiles lorsque vous avez besoin de les référencer plusieurs fois, ou lorsque vous avez des valeurs qui dépendent d'**autres** valeurs réactives.

> Notez que les déclarations et les instructions réactives seront exécutées après les autres parties du script et avant que le <span class='vo'>_markup_</span> du composant ne soit rendu.
