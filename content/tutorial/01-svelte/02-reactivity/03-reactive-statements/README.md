---
title: Statements
---

We're not limited to declaring reactive _values_ — we can also run arbitrary _statements_ reactively. For example, we can log the value of `count` whenever it changes:

```js
/// file: App.svelte
let count = 0;

+++$: console.log(`the count is ${count}`);+++
```

You can easily group statements together with a block:

```js
/// file: App.svelte
$: +++{+++
	console.log(`the count is ${count}`);
	console.log(`this will also be logged whenever count changes`);
+++}+++
```

You can even put the `$:` in front of things like `if` blocks:

```js
/// file: App.svelte
$: +++if (count >= 10)+++ {
	alert('count is dangerously high!');
	count = 0;
}
```
