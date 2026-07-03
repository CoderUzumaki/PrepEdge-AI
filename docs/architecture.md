# Architecture

High-level system design for PrepEdge AI v2.

---

## One-line summary

**A React SPA on Vercel talks to an Express API on Render, which authenticates via Firebase, persists to MongoDB, and orchestrates multi-provider AI for interview lifecycle.**

---

## System context diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
│  React 19 + Vite │ TanStack Query │ Firebase Auth SDK │ MediaRecorder   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS + Bearer (Firebase ID token)
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    VERCEL — apps/web (static SPA)                        │
│  Routing │ PageSeo │ Theme │ Interview UI │ Report PDF (client-side)    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ VITE_API_URL
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    RENDER — apps/api (Node / Express 5)                  │
│  Middleware: helmet, cors, requestId, envelope, logger, rate limits     │
│  Controllers → Services → Models (Mongoose)                               │
│  providers/ai: Groq → Gemini → Hugging Face fallback chains             │
└───────┬─────────────────┬──────────────────────┬────────────────────────┘
        │                 │                      │
        ▼                 ▼                      ▼
  MongoDB Atlas    Firebase Admin          Groq / Gemini / HF
  (users,          (verify ID tokens)       Cloudinary (resumes)
   interviews,
   reports,
   templates,
   resume cache)
```

---

## Monorepo layout

```
PrepEdge-AI/
├── apps/
│   ├── api/          # Express REST API
│   └── web/          # React SPA
├── packages/
│   └── shared/       # Zod schemas, AppError, quotas, sanitizer
├── docs/             # This documentation
└── render.yaml       # Render deploy blueprint
```

**Why monorepo?** Shared validation (`@prepedge/shared`) keeps API and web in sync on request shapes, error codes, and quota constants without publishing a separate npm package.

---

## Request lifecycle

1. **Browser** attaches `Authorization: Bearer <Firebase ID token>` via Axios interceptor (`apps/web/src/lib/api/client.js`).
2. **API** `firebaseAuthMiddleware` verifies token with Firebase Admin; attaches `req.firebaseUser`.
3. **Controller** resolves MongoDB user via `firebase_uid`, validates body with Zod from `@prepedge/shared`.
4. **Service** runs business logic; may call AI providers or update quotas.
5. **Response** always uses envelope: `{ data: T | null, error: { code, message, details? } | null }`.
6. **Client** unwraps `data` or throws `ApiError` with stable `code` for UI messages.

Every response includes `X-Request-Id` for log correlation on Render.

---

## Core domain flows

### A. Interview setup (async question generation)

```
POST /api/interviews/setup  (or POST /api/templates/:id/start)
  → validate quotas
  → optional: parse PDF resume → summarizeResume (AI, sync if new file)
  → create Interview document (status: "generating")
  → return 202 { interviewId }
  → background: generateQuestions (AI) → status: "ready"
```

**Design choice:** HTTP returns immediately (202) so users are not blocked on LLM latency (often 5–15s). Frontend polls interview status or navigates to waiting UI.

### B. Answer submission (async scoring)

```
POST /api/interviews/:id/answers  → 202
  → background: analyzeAnswer (AI) per question
  → when all scored: finalizeReport
      → generateInterviewSummary (AI)
      → set report.summaryStatus: "completed" | "failed"
```

### C. Speech-to-text

```
Browser MediaRecorder → POST /api/speech/transcribe (audio blob)
  → Groq Whisper proxy
  → client-side speech metrics (WPM, fillers) via @prepedge/shared
```

STT never touches third-party APIs from the browser directly — API key stays server-side.

### D. Demo / recruiter path

- Public `GET /api/demo/sample-question` — no auth
- `POST /api/demo/sample-answer` — scores one answer (lead magnet)
- `POST /api/demo/session` — Firebase custom token for read-only demo account

---

## Layered backend architecture

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Routes** | HTTP verb + path wiring | `interviewRoutes.js` |
| **Middleware** | Auth, validation, rate limit, envelope | `validate.js`, `firebaseAuthMiddleware.js` |
| **Controllers** | Parse request, call service, map response | `interviewController.js` |
| **Services** | Business rules, orchestration | `interviewService.js`, `quotaService.js` |
| **Models** | Mongoose schemas | `InterviewModel.js`, `ReportModel.js` |
| **Providers** | External integrations | `providers/ai/`, Cloudinary |

Controllers stay thin; services are unit-testable; providers are swappable.

---

## AI provider abstraction

`apps/api/providers/ai/index.js` defines:

- **Task-specific fallback chains** (e.g. `GENERATE_QUESTIONS`: Groq → Gemini → HF)
- **Prompt builders** with XML-style untrusted content wrapping
- **Output validation** (Zod-like manual validators)
- **Error mapping** to `upstream_failure` (502)

See [Tech Stack — AI](./tech-stack.md#ai-providers).

---

## Security architecture

| Concern | Implementation |
|---------|----------------|
| Authentication | Firebase ID tokens; Admin SDK verification |
| Authorization | `ownerMiddleware` — resource `user_id` must match |
| Prompt injection | `assertSafeForAi()` in `@prepedge/shared` |
| Rate limiting | Per-route limiters → `rate_limited` envelope |
| CORS | Explicit `ALLOWED_ORIGINS` whitelist |
| Secrets | Env vars only; never in client bundle (except Firebase public config) |
| Share links | Opt-in `shareToken` + optional expiry on reports |

---

## Frontend architecture

| Concern | Choice |
|---------|--------|
| Routing | React Router v7 |
| Server state | TanStack Query (caching, mutations, polling) |
| Auth state | React Context (`AuthContext`) |
| Theme | `ThemeContext` — light/dark/system |
| Code splitting | Lazy routes (`lazyPages.jsx`) + `RouteErrorBoundary` |
| SEO | `PageSeo` (react-helmet-async), sitemap, JSON-LD on Home |

---

## Observability

- **Structured JSON logs** to stdout (Render log drain)
- Fields: `timestamp`, `level`, `message`, `requestId`, `userId`, `route`, `durationMs`, `statusCode`
- Async jobs log with same `requestId` when propagated from controller

---

## Key trade-offs

| Decision | Why | Trade-off |
|----------|-----|-----------|
| MongoDB vs SQL | Flexible interview/report documents; fast iteration | No joins; denormalize carefully |
| Firebase Auth vs custom JWT | Free tier, Google OAuth, less auth code | Vendor lock-in; Admin SDK on server |
| Async AI jobs | Better UX; avoids HTTP timeouts | Client must poll; partial failure states |
| Multi-provider AI | Resilience + free-tier limits | Non-deterministic outputs; validation needed |
| Free-tier hosting | Zero cost for portfolio/GSSoC | Cold starts (Render), spin-down after idle |

---

## Related docs

- [Tech Stack](./tech-stack.md)
- [API Overview](./api-overview.md)
- [Data Models](./data-models.md)
- [Interview Prep — Architecture questions](./interview-prep/technical-questions.md#architecture--system-design)
