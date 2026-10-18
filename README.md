# Waymate

Waymate is an adults-only travel companion discovery website. The initial repository contains two applications:

- `apps/web`: responsive Next.js website for phone and laptop screens.
- `apps/api`: Node.js and Express API, structured as a modular monolith.

Product and technical design drafts are in [`docs/`](docs/).

## Requirements

- Node.js 20 or later
- npm 10 or later

## Local setup

1. Copy `apps/web/.env.example` to `apps/web/.env.local` and `apps/api/.env.example` to `apps/api/.env`.
2. Keep placeholder values until you configure local services. No cloud services are required by the starter scaffold.
3. Install dependencies from the repository root with `npm install`.
4. Start both apps with `npm run dev`.

The website is configured to use `http://localhost:4000` as its API base URL. The API listens on port `4000` by default. This starter only includes an API health endpoint; Waymate product features are not implemented.

You can also start either app separately with `npm run dev:web` or `npm run dev:api`.

## Environment configuration

The `.env.example` files contain placeholder values only. Local `.env` and `.env.local` files are ignored by Git. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and must never contain secrets. Map style URL is a placeholder; select a tile/style provider and confirm its usage terms before using it beyond local development.

See [`docs/Waymate-System-Design.md`](docs/Waymate-System-Design.md) and [`docs/Waymate-API-Design.md`](docs/Waymate-API-Design.md) for the current design proposals and open decisions.
