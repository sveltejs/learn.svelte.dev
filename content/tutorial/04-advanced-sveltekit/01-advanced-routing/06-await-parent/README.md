---
title: Using parent data
---

Occasionally it's useful for a `load` function to access data from a parent `load` function, which can be done with `await parent()`.

TODO good example

> Take care not to introduce waterfalls when using `await parent()`. If you can `fetch` other data that is not dependent on parent data, do that first.
