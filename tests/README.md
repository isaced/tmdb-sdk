# Test Architecture

Tests are organized by behavior boundary instead of by coverage target.

- `_support/` contains reusable fetch mocks, endpoint assertions, and small response fixtures.
- `unit/` covers pure helpers, the HTTP transport, and the public client facade.
- `resources/` covers resource endpoint contracts: method name, path, query parameters, defaults, and validation.

When adding a TMDB endpoint, prefer a resource contract test that proves the SDK maps the public TypeScript API to the documented TMDB path and query parameters. Keep network behavior in `unit/http.test.ts` so resource tests stay small and deterministic.
