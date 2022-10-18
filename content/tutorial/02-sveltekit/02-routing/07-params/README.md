---
title: Route Parameters
---

Many URLs are static, but sometimes it's useful to make them dynamic at certain parts of the URL. This is where route parameters come in.

A route parameter is created by adding square brackets around a valid variable name. For a route like `src/routes/[foo]/bar/+page.svelte`, resulting valid URLs are `a/bar`, `b/bar`, `c/bar`, ... and so on.

Defining a route parameter is only half-useful if our page always shows the same for each possible parameter value. Let's access the parameter value in our `load` function through the `params` object to load data corresponding to the parameter.

TODO example use case

> Multiple route parameters can appear _within_ one URL segment, as long as they are separated by at least one static character: `foo/[bar]x[baz]` is a valid route where `[bar]` and `[bar]` are dynamic parameters.
