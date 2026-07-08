Implement Feature 5: Innings (Backend + Frontend Integration)

Context:
- Read `docs/architecture/DatabaseStructure.md`
- Read `docs/api/product-spec.md`
- Read `docs/api/05-innings.md`
- Read `apps/api/src/db/schema/innings.ts`
- The database schema and Drizzle setup are already complete.
- Do not redesign the database or architecture.

Scope

Backend:
- Implement only the Innings module.
- Create routes, controller, service, repository, validation, and types.
- Implement only the APIs defined in product-spec.md and 05-innings.md.
- Use Drizzle ORM.
- Use transactions where appropriate.
- Add proper validation and error handling.
- Return consistent API responses.

Frontend:
- DO NOT create new pages, components, layouts, or UI.
- DO NOT redesign or modify the existing UI.
- ONLY integrate the backend with the frontend screens that already exist.
- If an API does not have a corresponding UI yet, implement the backend API only.
- Leave future APIs ready for later integration.
- Reuse existing hooks, API layer, and components wherever possible.

Rules:
- Follow the existing project structure.
- Keep controllers thin.
- Business logic belongs in services.
- Database logic belongs in repositories.
- Do not modify the database schema.
- Do not implement Live Scoring or any other feature.
- Do not implement frontend for features that are not yet available in the UI.
- Do not add placeholder pages or temporary UI.
- Stop after the Innings feature is complete.

Deliverables:
1. Backend implementation.
2. Frontend integration only for existing screens.
3. List of created/modified files.
4. Manual testing steps.
5. Any assumptions or TODOs before moving to the Live Scoring feature.