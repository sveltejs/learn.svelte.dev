---
title: Server-side rendering
---

Server-side rendering (SSR) is the generation of the page contents on the server. It's what SvelteKit does by default when a user first visits your site.

SSR is generally preferred for SEO (search engine optimization). While some search engines can index content that is dynamically generated on the client-side it may take longer even in these cases. It also tends to improve perceived performance and makes your app accessible to users if JavaScript fails or is disabled (which happens [more often than you probably think](https://kryogenix.org/code/browser/everyonehasjs.html)).
