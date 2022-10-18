---
title: Endpoints
---

So far, we have loaded data directly related to a page. Besides that, SvelteKit also provides you a way to retrieve and manipulate data through endpoints.

An endpoint is created by putting a `+server.js` in a directory. `src/routes/api/user/+server.js` becomes an endpoint accessible at `api/user`. The endpoint can provide methods corresponding to the http verbs you already may know from previous experience: `GET`, `PUT`, `POST`, `PATCH` and `DELETE`.

TODO example use case
