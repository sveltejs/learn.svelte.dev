---
title: Server and client
---

A SvelteKit app can be thought of as two distinct entities working in tandem — the _server_ and the _client_.

'Server' is, perhaps, a confusing word since your app will often be running in a _serverless_ environment (cloud/edge functions) or might even be deployed as a set of completely static files. But it's the best we've got. The server's basic job is to turn a request into a response.

'Client' refers to the JavaScript that loads in the browser.

SvelteKit makes the two communicate with each other seamlessly. It takes care of all the annoying stuff so you don't have to.

On first page hit, SvelteKit will render the HTML on the server and send it to the browser. This means content is visible as fast as possible to the user. SvelteKit will then take over that HTML in a process called hydration, so that subsequent navigations will happen in the browser, allowing for a better user experience.

> You can adjust this behavior to your liking if you want - SvelteKit is very versatile!
