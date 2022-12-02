---
title: Server-side rendering
---

Server-side rendering (SSR) is the generation of HTML on the server. It's what SvelteKit does by default for the initial page load when a user visits your site.

SSR tends to improve performance and makes your app accessible to users if JavaScript fails or is disabled (which happens [more often than you probably think](https://kryogenix.org/code/browser/everyonehasjs.html)). It is also preferred for search engine optimization (SEO) — while some search engines can index content that is rendered in the browser with JavaScript, it happens less frequently and reliably.
