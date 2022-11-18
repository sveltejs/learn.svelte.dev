# learn.svelte.dev

A soup-to-nuts interactive tutorial on how to build apps with Svelte.

## Setup

This repo uses [pnpm](https://pnpm.io/).

## Running the app

At the moment, the only way this works is if you clone the repo, add an `.env` file with `VITE_USE_FILESYSTEM=true` in it and run the app locally with `pnpm dev` or `pnpm build && pnpm preview`.

In future, it will run both locally and on the web (using [WebContainers](https://blog.stackblitz.com/posts/introducing-webcontainers/)).
