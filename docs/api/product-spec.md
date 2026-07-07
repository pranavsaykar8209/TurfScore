Implement Feature 1: Sessions.

Read:
- docs/database/db-structure.md
- docs/backend/product-spec.md

Implement ONLY the Sessions feature.

Frontend:
- Home Page
- Create Session Page
- Join Session Page
- Session Dashboard

Backend:
- POST /api/sessions
- GET /api/sessions/:sessionCode
- PATCH /api/sessions/:sessionCode
- GET /api/sessions/:sessionCode/dashboard

Requirements:
- Use existing Drizzle schema.
- Use Express + TypeScript.
- Use Zod validation.
- Follow project folder structure.
- Create route → controller → service → repository.
- Handle errors properly.
- Connect frontend to backend.
- Show loading and error states.
- Do not implement Teams, Players, Matches, or any placeholders.
- Stop after Sessions are complete and list all created files.