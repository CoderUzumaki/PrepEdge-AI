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
| **Integration branch** | `v2` @ `a4015b4` |
| **Latest module** | M0 — Foundation (**done**, merged into `v2`) |
| **Next module** | **M1 — Design system** |
| **Remote** | `v2` not pushed to `origin` as of last session (verify with `git status`) |
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
| **M1** | Design system | `v2-M1-design-system` | M0 | **pending** | — |
| **M2** | Usage caps | `v2-M2-usage-caps` | M0 | pending | — |
| **M3** | AI security | `v2-M3-ai-security` | M0 | pending | — |
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

## M1 — Design system (next)

**Branch to create:** `v2-M1-design-system` from latest `v2`  
**BUILD reference:** [BUILD.md §10 M1](./BUILD.md#m1--design-system) · tokens in [§9.3](./BUILD.md#93-design-tokens-appswebsrcstylesindexcss)

### Scope checklist

- [ ] Update `apps/web/src/styles/index.css` tokens per BUILD §9.3
- [ ] Add `@fontsource/inter` (weights 400, 500, 600, 700)
- [ ] Layout components: `PageHeader`, `EmptyState`, `StepIndicator` in `components/layout/`
- [ ] Refine `ui/` primitives (sizing, focus rings, no `rounded-3xl`)
- [ ] Apply to Header, Footer, Login, SignUp (auth shell)

### Acceptance criteria

- Inter font loaded; no gradient or glassmorphism
- Focus visible on all interactive elements
- Auth pages match Vercel/Linear aesthetic
- All existing auth flows still work

### Suggested first steps for M1 agent

```bash
git checkout v2
git pull origin v2    # if remote exists
git checkout -b v2-M1-design-system
```

Read `apps/web/src/styles/index.css`, `components/ui/*`, `pages/Login.jsx`, `pages/SignUp.jsx`, `components/Header.jsx`, `components/Footer.jsx` before editing.

---

## Known decisions & caveats

- **One module per session** — stop and notify user after each module unless told otherwise.
- **CORS errors** from `index.js` still throw a plain `Error` (not envelope) — pre-middleware; acceptable for M0.
- **Cursor git wrapper** may inject `Co-authored-by: Cursor` on `git commit`; use native `git.exe` / `commit-tree` if user requests no agent co-author.
- **M2 and M3** can run in parallel after M1 merges (both depend only on M0), but BUILD merge order is M1 → M2 → M3 sequentially unless user approves parallel PRs.

---

## Session log

Agents: **append new entries at the top** (newest first).

### 2026-07-03 — M0 complete

- **Agent session:** Foundation module implementation + gap closure
- **Branch:** `v2-M0-foundation` → merged into `v2`
- **Commit:** `a4015b4`
- **Done:** Full API envelope, logging, rate-limit envelope, hardened web client, integration tests, BUILD.md + PLAN.md added
- **Next:** M1 design system — create `v2-M1-design-system` from `v2`
