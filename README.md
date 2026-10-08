# Clipboard — creator video tracking

Small SaaS app: organizations track the creators they work with and the videos those creators
post. Each user belongs to one organization; all data is organization-scoped.

## Structure

- `api/` — Hono API, Drizzle ORM + Postgres.
  - `src/resources/<name>/routes.ts` — routing, validation, dependency gathering.
  - `src/resources/<name>/repo.ts` — database and business logic (static-method repo classes).
  - Pagination, filtering and sorting are always done in the database, never in application code.
  - Totals come from separate `/count` routes, not inline with list responses.
- `web/` — React + Vite, TanStack Router (code-based routes in `src/router.tsx`) and
  TanStack Query. The API is called through the fetch wrapper in `src/api/client.ts`;
  response types are declared next to the page that uses them.
  List page state (search, page) lives in typed URL search params.

## Reviewing

Review the open PR as you would a teammate's: leave comments where you'd leave them in a
real review, and finish with a verdict — approve, comment, or request changes.
