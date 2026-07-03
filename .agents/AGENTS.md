# TurfScore Project Rules

These rules define the coding standards, project structure, and best practices for the TurfScore project. All generated code should follow these guidelines.

---

# 1. Project Architecture

- Organize code by **feature**, not by file type.
- Keep related components, hooks, types, services, and utilities together.
- Avoid creating large shared folders that become difficult to maintain.

Example:

```
src/
│
├── app/
├── components/
│   └── ui/
│
├── features/
│   ├── create-session/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── CreateSessionPage.tsx
│   │   └── index.ts
│   │
│   └── live-scoring/
│
├── lib/
├── routes/
├── assets/
└── styles/
```

---

# 2. Folder Structure

- Organize by feature whenever possible.
- Create a dedicated folder for a component only when it contains multiple related files.
- Small reusable components may remain as a single `.tsx` file.
- Avoid deeply nested folders.

---

# 3. TypeScript Rules

## Types & Interfaces

- Never declare `type` or `interface` definitions inside React component files.
- Never place them in a `types.ts` file inside the component's folder.
- Always place them in a dedicated feature `types` folder (e.g., `features/[feature]/types/`) or the global `src/types/` folder, as they are often shared across components.
- Import them into the component from these central type folders.

Example:

```text
features/
└── create-session/
    ├── components/
    │   └── PlayerCard.tsx
    ├── types/
    │   └── index.ts
    └── index.ts
```

## Type Preference

- Prefer `type` over `interface`.
- Use `interface` only when extension or declaration merging is required.
- Never use `any`.
- Use `unknown` if the type is genuinely unknown.
- Enable strict TypeScript.

---

# 4. Component Rules

- Every component should have a single responsibility.
- Components should generally remain under **200 lines**.
- If a component becomes too large:
  - Extract reusable UI
  - Move business logic into hooks
  - Move helper functions into utils

---

# 5. React Best Practices

- Keep pages thin.
- Pages should mainly compose components.
- Move business logic into custom hooks.
- Move reusable helper functions into `utils`.
- Prefer composition over large components.
- Avoid duplicated logic.

---

# 6. Reusable UI Components

Place generic reusable UI inside:

```
src/components/ui
```

Examples:

- Button
- Input
- Select
- Dialog
- Modal
- Card
- Badge
- Avatar
- Tabs
- Stepper

These components must remain independent of business logic.

---

# 7. Barrel Exports

Use `index.ts` files for cleaner imports.

Example:

```
components/
│
├── PlayerCard.tsx
├── PlayerList.tsx
└── index.ts
```

```ts
export { default as PlayerCard } from "./PlayerCard";
export { default as PlayerList } from "./PlayerList";
```

Import using:

```ts
import { PlayerCard, PlayerList } from "@/features/create-session/components";
```

---

# 8. Theme Rules

The application supports both **Light** and **Dark** mode.

Always:

- Use Tailwind `dark:` variants.
- Use CSS variables or design tokens.
- Never hardcode colors.
- Maintain visual consistency.
- Keep spacing and typography identical between themes.
- Theme switching should require no duplicate components.

---

# 9. Styling Guidelines

- Tailwind CSS only.
- Avoid inline styles.
- Use utility classes.
- Keep spacing consistent.
- Use the project's design system.
- Prefer reusable utility classes over repetition.

---

# 10. Imports

Use absolute imports.

✅ Good

```ts
import { Button } from "@/components/ui";
```

❌ Bad

```ts
import Button from "../../../../components/ui/Button";
```

---

# 11. Naming Conventions

## Components

PascalCase

```
PlayerCard.tsx
SessionStepper.tsx
```

## Hooks

camelCase with `use`

```
useSession.ts
usePlayers.ts
```

## Utilities

camelCase

```
generateSessionCode.ts
groupPlayers.ts
```

## Types

PascalCase

```
Player
Session
PlayerCardProps
```

## Variables & Functions

camelCase

```
handleSubmit
playerCount
sessionData
```

---

# 12. Code Quality

Always:

- Remove unused imports.
- Remove console.log statements.
- No commented-out code.
- Avoid duplicate logic.
- Follow DRY principles.
- Write readable code.
- Prefer early returns.
- Keep functions focused.

---

# 13. State Management

- Keep state as local as possible.
- Avoid prop drilling when unnecessary.
- Extract reusable state logic into custom hooks.
- Separate UI state from business state.

---

# 14. Forms

- Use React Hook Form.
- Validate all required fields.
- Display clear validation messages.
- Disable submit while processing.
- Show loading states.

---

# 15. Accessibility

Every component should include:

- Proper labels
- Keyboard navigation
- Focus states
- ARIA attributes where necessary
- Sufficient color contrast

---

# 16. Responsive Design

Build mobile-first.

Support:

- Mobile
- Tablet
- Desktop

Avoid fixed widths whenever possible.

---

# 17. Performance

- Memoize expensive calculations.
- Lazy load pages when appropriate.
- Avoid unnecessary re-renders.
- Keep bundle size small.

---

# 18. File Organization

Inside a feature:

```
create-session/

components/
hooks/
services/
types/
utils/
constants/
index.ts
CreateSessionPage.tsx
```

Keep related files together.

---

# 19. Git Commit Format

Follow Conventional Commits.

Examples:

```
feat: add create session wizard

fix: resolve player deletion bug

refactor: extract player form hook

docs: update project documentation

style: improve spacing in session cards

test: add create session tests

chore: update dependencies
```

---

# 20. General Principles

Always generate code that is:

- Production-ready
- Clean
- Modular
- Reusable
- Maintainable
- Scalable
- Type-safe
- Responsive
- Accessible
- Theme-aware
- Easy to understand

When multiple implementations are possible, prefer the solution that is simpler, more reusable, and easier to maintain.
