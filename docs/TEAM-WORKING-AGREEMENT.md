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
| Frontend (TypeScript / React Native) | ESLint/Prettier rules in repo. `PascalCase` components, `camelCase` functions/hooks. |
| Backend (FastAPI / Python) | PEP 8. Type hints required for public functions and endpoints. |
| Backend (TypeScript) | Same TypeScript conventions as frontend. |
| Database | `snake_case` for tables, columns, functions. Schema changes must go through migration files in `backend/supabase/migrations/` (no direct SQL Editor changes). Migration filenames follow `YYYYMMDDHHMMSS_description.sql`. |

### Git & Communication

- **Branches**: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`
- **Commits**: Conventional prefixes (`feat:`, `fix:`, `refactor:`, etc.)
- **Response time**: Within 24h on weekdays for direct mentions
- **Standups**: Tue / Thu / Sat — attendance and progress syncing expected

---

## 2. Process & Scrum Cadence

We adapt standard Scrum practices to fit our team's active development style and ensure linear tracking honesty.

### Sprint Flexibility & Scope Control
- **Adaptive Execution**: Recognizing that sprints do not always go perfectly according to plan, if unexpected complications or hidden sub-tasks emerge, the team commits to dedicating flexible, additional efforts to drive the sprint features to completion.
- **Sprint Carry-over Policy**: If a sub-task or an entire User Story cannot be realistically completed within the strict sprint timebox despite team efforts, we do not force-merge or compromise quality. As recommended by course staff/TAs, unfinished items are systematically moved back to the Product Backlog during the Sprint Review and explicitly scheduled as high-priority carry-over items for the next sprint.

---

## 3. Definition of Done (DoD)

We maintain two rigorous levels of completion—at the engineering PR level and the user-facing story level—to ensure system health and functional success.

### Task / PR Checklist (Engineering DoD - Existing)
A PR is "Done" from an engineering perspective when it satisfies the **4 Rules of Simple Design** and the checklist below:
- [ ] All relevant tests pass (`frontend/__tests__/`, `backend/__tests__/`)
- [ ] No duplicated logic — refactored into shared utilities where appropriate
- [ ] Code is self-explanatory; no excessive comments needed
- [ ] No debug logs, mock data, commented-out code, or unused imports
- [ ] PR is focused on a single logical change
- [ ] RLS policies tested for both authenticated and anonymous contexts (if schema changed)
- [ ] Schema documentation updated (if schema changed)
- [ ] At least one teammate has reviewed and approved

### User Story Completion Checklist (User-Facing DoD - Added)
A parent **User Story** is officially considered fully "Done" and counted toward team velocity only when it meets the following criteria:
- [ ] All underlying sub-tasks and PRs associated with the story are 100% Done.
- [ ] **Scenario-Based Validation**: The user story can be successfully executed and verified end-to-end through its real-world user interaction scenarios.
- [ ] All defined Acceptance Criteria are met, with objective UI tests properly validating loading, empty, error, and normal states.
- [ ] Explicitly inspected, demonstrated via a working environment, and **accepted by the Product Owner (PO)**.
- [ ] **Immediate Defect Resolution**: Any critical bugs or regressions introduced by this feature are resolved within the active branch prior to the story being signed off.
