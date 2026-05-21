# Team Working Agreement: Coding Standard & Definition of Done

## 1. Coding Standard

We prioritize **readability over cleverness** to enable collective code ownership.

### Clean Code Principles

- **DRY** — Refactor when logic appears 3+ times. Use `frontend/src/hooks/` and `frontend/src/components/` for shared code.
- **Intention-revealing names** — `dataReady` not `flag`. Standard handlers (`handleSubmit`) are fine.
- **Do one thing** — One function, one responsibility. Avoid `processInput()` when a specific name fits.
- **No magic literals** — Use named constants. Frontend theme via `frontend/src/constants/theme.ts`.
- **Vertical separation** — Define things close to where they're used.

### Stack Conventions

| Layer | Rules |
|---|---|
| Frontend | ESLint/Prettier rules in repo. `PascalCase` components, `camelCase` functions/hooks. |
| Backend | PEP 8. Type hints required for public functions and endpoints. |
| Database | `snake_case` for tables, columns, functions. Schema changes go through migration files. |

### Git & Communication

- **Branches**: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`
- **Commits**: Conventional prefixes (`feat:`, `fix:`, `refactor:`, etc.)
- **Response time**: Within 24h on weekdays for direct mentions
- **Standups**: Tue/Thu/Sat — attendance expected

---

## 2. Definition of Done (DoD)

A PR is "Done" when it satisfies the **4 Rules of Simple Design**: tests pass, no duplication, self-explanatory, no superfluous parts.

### PR Checklist

- [ ] All relevant tests pass (`frontend/__tests__/`, `backend/*.test.js`)
- [ ] No duplicated logic — refactored into shared utilities where appropriate
- [ ] Code is self-explanatory; no excessive comments needed
- [ ] No debug logs, mock data, commented-out code, or unused imports
- [ ] PR scope is focused (~400 lines or fewer of non-test changes)
- [ ] RLS policies tested for both authenticated and anonymous contexts (if schema changed)
- [ ] Schema documentation updated (if schema changed)
- [ ] At least one teammate has reviewed and approved