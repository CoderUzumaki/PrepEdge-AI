# V2_STATE.md — PrepEdge AI v2 Build State

**Purpose:** Living handoff document for humans and coding agents working on the v2 rebuild.  
**Read this first** before starting any module. **Update this file** when you begin, finish, or block on module work.

**Companion docs:** [BUILD.md](./BUILD.md) (how to build) · [PLAN.md](./PLAN.md) (product requirements)

---

## Agent instructions (required)

Every agent session **must**:

1. **Read** this file and [BUILD.md](./BUILD.md) Section 10 for the target module.
2. **Check** `git branch` — integration work merges into `v2`; one module per session unless the user says otherwise.
3. **Update** the [Module status](#module-status) table when starting or completing a module.
4. **Append** a short entry to [Session log](#session-log) when ending a session (what was done, branch, commit hash if any, what's next).
5. **Do not** mark a module `done` until acceptance criteria in BUILD.md pass and `npm run lint` + `npm test` are green.
6. **Do not** add `Co-authored-by: Cursor` or other agent trailers to git commits unless the user explicitly requests it.

---

## Current snapshot

| Field | Value |
|-------|--------|
| **Integration branch** | `v2` @ `d6271d3` |
| **Latest module** | M3 — AI security (**done**, merged into `v2`) |
| **Next module** | **M4 — STT** or **M5 — Templates** (parallel) |
| **Remote** | verify with `git status` |
| **npm version** | `2.0.0` |

### Branch naming note

Git cannot have both a branch named `v2` and `v2/M0-foundation` (ref collision). Use **hyphen** module branches:

- Integration: `v2`
- Modules: `v2-M0-foundation`, `v2-M1-design-system`, etc.

BUILD.md still shows `v2/Mx-*` in diagrams; use hyphen form in practice.

---

## Module status

| ID | Module | Branch | Depends on | Status | Merged to `v2` |
|----|--------|--------|------------|--------|----------------|
| **M0** | Foundation | `v2-M0-foundation` | — | **done** | yes (`a4015b4`) |
| **M1** | Design system | `v2-M1-design-system` | M0 | **done** | yes (`7a2ea0f`) |
| **M2** | Usage caps | `v2-M2-usage-caps` | M0 | **done** | yes (`f7d0620`) |
| **M3** | AI security | `v2-M3-ai-security` | M0 | **done** | yes (`d6271d3`) |
| **M4** | STT (Groq Whisper) | `v2-M4-stt` | M0, M1, M2 | pending | — |
| **M5** | Interview templates | `v2-M5-templates` | M0, M1 | pending | — |
| **M6** | Reports & share | `v2-M6-reports` | M0, M1, M3, M4 | pending | — |
| **M7** | Recruiter demo | `v2-M7-recruiter-demo` | M0, M1, M6 | pending | — |
| **M8** | SEO & analytics | `v2-M8-seo-analytics` | M1, M7 | pending | — |
| **M9** | Polish | `v2-M9-polish` | all above | pending | — |

**Merge order into `v2`:** M0 → M1 → M2 → M3 → (M4 ∥ M5) → M6 → M7 → M8 → M9

---

## M0 — Foundation (completed)

**Commit:** `a4015b4` — `feat(m0): add API envelope, structured logging, and unified error handling`

### What was built

**Shared (`packages/shared/src/errors/`)**
- `codes.js` — stable error codes + HTTP status map
- `envelope.js` — `AppError`, `successEnvelope`, `failEnvelope`
- Exported from `packages/shared/src/index.js`

**API middleware & utils**
- `requestId.js` — UUID per request + `X-Request-Id` header
- `responseEnvelope.js` — `res.success()` / `res.fail()`
- `requestLogger.js` — structured JSON request completion logs
- `rateLimit.js` — `createRateLimiter()` → `rate_limited` envelope
- `errorHandler.js` — maps `AppError` to envelope (no stack traces to client)
- `logger.js` — JSON stdout logger for Render

**Migrations**
- All controllers use `res.success()` / `res.fail()`
- Services throw `AppError.fromCode()` from `@prepedge/shared`
- `validate.js`, `firebaseAuthMiddleware.js`, `ownerMiddleware.js` use envelope
- Interview/contact rate limiters use `createRateLimiter()`

**Async observability**
- `requestId` passed from controllers into `generateQuestionsAsync` / `scoreAnswerAsync`
- Structured `log()` calls replace `console.error` in async interview paths

**Web**
- `apps/web/src/lib/api/errors.js` — `ApiError`, `normalizeApiError`, `getErrorMessage`, `formatValidationDetails`
- `apps/web/src/lib/api/client.js` — strict envelope unwrap (no `?? body` fallback)
- Form pages + Dashboard + Report use `getErrorMessage()` for API errors

**Tests (26 passing)**
- `envelope.test.js`, `health.test.js`, `middleware.test.js`, `clientErrors.test.js`

### M0 acceptance criteria — verified

- [x] Every API endpoint returns `{ data, error }` shape (including 429 rate limits)
- [x] `X-Request-Id` on responses
- [x] Structured JSON logs with `requestId` and `route`
- [x] Frontend handles `rate_limited` and `validation_error` with user-visible messages
- [x] `npm run lint` + `npm test` pass

---

## M1 — Design system (completed)

**Branch:** `v2-M1-design-system` → merged into `v2`  
**Commit:** `7a2ea0f` — `feat(m1): add design system tokens, Inter font, and auth shell refresh`

### What was built

**Design tokens (`apps/web/src/styles/index.css`)**
- BUILD §9.3 tokens: background, surface, foreground, muted, border, primary, semantic colors
- Inter via `--font-sans`; removed `.dark` mode tokens (light-only v1)
- Global focus-visible styles for native interactive elements

**Typography**
- `@fontsource/inter` weights 400, 500, 600, 700 imported in `main.jsx`

**Layout components (`apps/web/src/components/layout/`)**
- `PageHeader`, `EmptyState`, `StepIndicator`, `AuthShell`

**UI primitives refined (`components/ui/`)**
- Consistent `rounded-md` sizing, focus rings, card hover shadow

**Auth shell applied**
- `Header`, `Footer`, `Login`, `SignUp` refreshed

### M1 acceptance criteria — verified

- [x] Inter font loaded; no gradient or glassmorphism
- [x] Focus visible on all interactive elements
- [x] Auth pages match Vercel/Linear aesthetic
- [x] All existing auth flows preserved
- [x] `npm run lint` + `npm test` pass

---

## M2 — Usage caps (completed)

**Branch:** `v2-M2-usage-caps` → merged into `v2`  
**Commit:** `f7d0620` — `feat(m2): enforce usage caps with quota API and dashboard UI`

### What was built

**Shared (`packages/shared/src/quota/`)**
- `periods.js` — UTC month/day/week boundaries + `nextPeriodStart`
- `caps.js` — `USAGE_CAPS`, labels, user-facing limit messages

**API**
- `UserModel.usage_quotas` — counters for interviews_month, practice_day, resume_week, stt_day
- `services/quotaService.js` — period reset, assert, check+increment, `checkAndIncrementStt` (for M4)
- Enforced on `POST /api/interviews/setup` (3/month + resume 1/week for non-cached uploads)
- Enforced on `POST /api/interviews/practice` (10/day)
- `GET /api/users/me/quotas` — returns used/limit/remaining/resetsAt per resource

**Web**
- `QuotaBadge` layout component
- `useQuotas` hook + cache invalidation on setup/practice
- Dashboard — quota grid, disable New Interview at cap
- CreateInterview — quota badges, StepIndicator, limit warnings

**Tests (35 total)**
- `quota.test.js` — UTC period helpers, month reset, rate_limited at cap

### M2 acceptance criteria — verified

- [x] 4th interview in a month returns `rate_limited` with clear message
- [x] Dashboard shows current usage
- [x] Unit tests for quota reset logic (UTC month)
- [x] `npm run lint` + `npm test` pass

---

## M3 — AI security (completed)

**Branch:** `v2-M3-ai-security` → merged into `v2`  
**Commit:** `d6271d3` — `feat(m3): harden AI prompts with sanitizer, delimiters, and output validation`

### What was built

**Shared (`packages/shared/src/sanitizer/`)**
- `inputSanitizer.js` — null-byte strip, truncation, injection detection, `wrapUntrustedContent`, `assertSafeForAi` → `guardrail_violation`

**API (`apps/api/providers/ai/`)**
- Hardened system prompts with untrusted-content rules for all `AI_TASKS`
- Delimiter-wrapped prompts: `<user_answer>`, `<resume_text>`, `<job_description>`, etc.
- `validateOutput.js` — score bounds 0–100, feedback/tags validation
- `aiErrors.js` — maps parse/validation failures to `upstream_failure`

**Web**
- `getErrorMessage` handles `guardrail_violation` and `upstream_failure`

**Tests (55 total)**
- `sanitizer.test.js`, `aiSecurity.test.js`

### M3 acceptance criteria — verified

- [x] Injection answers blocked via `guardrail_violation` before LLM
- [x] All AI prompts use delimiter tags for untrusted content
- [x] Invalid AI JSON/score maps to `upstream_failure`
- [x] `npm run lint` + `npm test` pass

---

## Known decisions & caveats

- **One module per session** — stop and notify user after each module unless told otherwise.
- **CORS errors** from `index.js` still throw a plain `Error` (not envelope) — pre-middleware; acceptable for M0.
- **Use `git.exe commit-tree`** or `git.exe commit` to avoid Cursor injecting `Co-authored-by` trailers.
- **STT quota** (`stt_day`) enforced in M4 when speech routes land; counter + service ready in M2.
- **Resume quota** skips increment when PDF hash is already in 7-day cache.
- **M4 and M5** can run in parallel after M3 (M4 needs M1+M2; M5 needs M1).

---

## Session log

Agents: **append new entries at the top** (newest first).

### 2026-07-03 — M3 complete

- **Agent session:** AI security — input sanitizer, hardened prompts, output validation
- **Branch:** `v2-M3-ai-security` → merged into `v2`
- **Commit:** `d6271d3`
- **Next:** M4 STT (`v2-M4-stt`) or M5 templates (`v2-M5-templates`)

### 2026-07-03 — M2 complete

- **Agent session:** Usage caps — UserModel quotas, quotaService, API enforcement, QuotaBadge UI
- **Branch:** `v2-M2-usage-caps` → merged into `v2`
- **Commit:** `f7d0620`
- **Next:** M3 AI security — create `v2-M3-ai-security` from `v2`

### 2026-07-03 — M1 complete

- **Agent session:** Design system module — tokens, Inter font, layout components, UI primitives, auth shell
- **Branch:** `v2-M1-design-system` → merged into `v2`
- **Commit:** `7a2ea0f` (+ docs `462c00b` on `v2`)
- **Done:** index.css tokens, @fontsource/inter, PageHeader/EmptyState/StepIndicator/AuthShell, ui/ refinements, Header/Footer/Login/SignUp refresh
- **Verified:** `npm run lint` + `npm test` (26 tests) green
- **Next:** M2 usage caps — create `v2-M2-usage-caps` from `v2`

### 2026-07-03 — M0 complete

- **Agent session:** Foundation module implementation + gap closure
- **Branch:** `v2-M0-foundation` → merged into `v2`
- **Commit:** `a4015b4`
- **Done:** Full API envelope, logging, rate-limit envelope, hardened web client, integration tests, BUILD.md + PLAN.md added
- **Next:** M1 design system — create `v2-M1-design-system` from `v2`
