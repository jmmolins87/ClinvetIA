# AI JSON API

Configura `AI_INTEGRATION_API_KEY` en el entorno del proyecto.

Autenticación:

- `Authorization: Bearer <AI_INTEGRATION_API_KEY>`
- `x-api-key: <AI_INTEGRATION_API_KEY>`

Endpoints:

- `GET /api/ai`
- `GET /api/ai/dashboard?range=7`
- `GET /api/ai/dashboard?range=30`
- `GET /api/ai/calendar`
- `GET /api/ai/calendar?from=2026-03-18&to=2026-03-31`
- `GET /api/ai/calendar?status=confirmed,pending&limit=50`
