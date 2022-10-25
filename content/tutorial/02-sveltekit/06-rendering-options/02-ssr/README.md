---
title: Server Side Rendering
---

The `ssr` option controls whether or not a page is rendered on the server.

By default this option is set to `true`. Setting this option to `false` will make the page render on the client only - if you enable it for your whole app, you've turned it into an SPA.

Setting it to `false` is useful if you have things on your page that should not or even cannot run on the server. TODO good example
