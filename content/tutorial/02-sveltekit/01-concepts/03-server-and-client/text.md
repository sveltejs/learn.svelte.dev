---
title: Server and client
---

A SvelteKit app can be thought of as two distinct entities working in tandem — the _server_ and the _client_.

'Server' is, perhaps, a confusing word since your app will often be running in a _serverless_ environment (cloud/edge functions) or might even be deployed as a set of completely static files. But it's the best we've got. The server's basic job is to turn a request into a response.

'Client' refers to the JavaScript that loads in the browser.

TODO
