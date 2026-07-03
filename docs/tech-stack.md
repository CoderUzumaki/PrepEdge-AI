# Tech Stack

Technology choices for PrepEdge AI v2 with **justification** — use this when interviewers ask *"Why did you choose X?"*

---

## Stack at a glance

| Layer | Technology | Version (approx.) |
|-------|------------|-------------------|
| Frontend | React + Vite | 19 / 6 |
| Styling | Tailwind CSS v4 | 4.x |
| Routing | React Router | 7 |
| Data fetching | TanStack Query | 5 |
| Auth (client) | Firebase Auth | 11 |
| Backend | Express | 5 |
| Database | MongoDB + Mongoose | Atlas M0 |
| Auth (server) | Firebase Admin SDK | 13 |
| Validation | Zod (`@prepedge/shared`) | 3 |
| AI | Groq, Gemini, Hugging Face | — |
| STT | Groq Whisper (server proxy) | — |
| File storage | Cloudinary | optional |
| API hosting | Render | free web service |
| Web hosting | Vercel | hobby |
| Tests | Vitest + Supertest | — |

---

## Frontend

### React + Vite

**Why:** Fast HMR for development; lean production bundles; ecosystem familiarity for contributors and interviewers.

**Why not Next.js?** PrepEdge is a authenticated SPA behind login for core flows; SEO is handled on marketing pages via `PageSeo` + static `sitemap.xml` without SSR complexity. Vite keeps the deploy model simple (static export to Vercel).

**Interview one-liner:** *"I chose Vite + React because the app is interaction-heavy after login, and I wanted fast dev feedback without operating a Node SSR layer on the frontend."*

### Tailwind CSS v4

**Why:** Design tokens in CSS (`@theme`), dark mode via `.dark` class, consistent spacing/typography across 20+ pages.

**Why not CSS-in-JS?** Zero runtime cost; smaller bundle; aligns with Vercel/Linear aesthetic goals in v2.

### TanStack Query

**Why:** Interview flow needs polling (`scoring-status`), cache invalidation after mutations (templates, quotas), and loading/error states without boilerplate.

**Interview one-liner:** *"React Query handles server state — caching, refetching scoring status, and invalidating dashboard data after an interview completes."*

### Firebase Auth (client)

**Why:** Free Spark tier; email/password + Google; battle-tested SDK; no custom password storage.

**Trade-off:** Requires Firebase Admin on API for verification; tied to Google ecosystem.

---

## Backend

### Express 5

**Why:** Mature REST model; middleware pipeline fits envelope, logging, rate limits; team/contributor familiarity from v1.

**Why not Nest/Fastify?** Smaller surface area for a portfolio-scale API; fewer abstractions for GSSoC contributors.

### MongoDB Atlas

**Why:** Document model matches nested `questions[]`, `answers[]`, template fields; schema flexibility during v2 rebuild (M0–M9 modules).

**Trade-off:** Reporting across users needs careful indexing; no ACID across collections (acceptable for this domain).

**Interview one-liner:** *"Interviews and reports are naturally hierarchical documents — questions embedded in interviews, answers embedded in reports — so MongoDB avoided heavy normalization."*

### Firebase Admin SDK

**Why:** Verify ID tokens server-side; issue demo custom tokens (M7); no session store on API.

**Pattern:** Stateless API — every request carries Bearer token; horizontal scaling on Render is trivial.

---

## Shared package (`@prepedge/shared`)

**Why:** Single source of truth for:

- Zod request schemas (API validate + future web forms)
- `ERROR_CODES` + `AppError` + response envelope
- Quota caps and period logic
- AI input sanitizer (prompt injection defense)
- Speech metrics helpers

**Interview one-liner:** *"I extracted shared contracts into a workspace package so the API and web never drift on validation rules or error codes."*

---

## AI providers

### Multi-provider fallback

Three providers with **task-specific order**:

| Task | Chain | Rationale |
|------|-------|-----------|
| `GENERATE_QUESTIONS` | Groq → Gemini → HF | Groq fast/cheap for JSON generation |
| `ANALYZE_ANSWER` | Groq → Gemini → HF | Same; demo scoring uses this |
| `SUMMARIZE_RESUME` | Gemini → Groq → HF | Gemini JSON mode for structured summaries |
| `INTERVIEW_SUMMARY` | Gemini → Groq → HF | Narrative summary quality |

**Why multi-provider?** Free-tier rate limits and outages; no single vendor lock-in for a portfolio project.

**Why validate AI output?** LLMs return malformed JSON or wrong types (e.g. `strengths` as array instead of string). Server-side validators prevent bad data in reports.

### Groq (primary)

**Why:** Fast inference; `llama-3.3-70b-versatile`; Whisper for STT on same API key.

### Gemini (fallback / some primary tasks)

**Why:** `responseMimeType: application/json` for structured outputs; Google free tier.

**Known ops issue:** Prepaid credits can deplete (429) — falls back to Groq.

### Hugging Face (tertiary)

**Why:** Optional third fallback; open models via Inference API.

---

## Speech-to-text

### Groq Whisper (server proxy)

**Why not Web Speech API?** Browser support inconsistent; no server audit trail; cannot attach to same quota/rate-limit model.

**Flow:** `MediaRecorder` → `POST /api/speech/transcribe` → Groq → transcript + client-side filler/WPM analysis from `@prepedge/shared`.

---

## Infrastructure

### Vercel (frontend)

**Why:** Zero-config Vite deploy; edge CDN; analytics events (M8); custom domain.

### Render (API)

**Why:** Simple Node web service; `render.yaml` blueprint; health check at `/api/health`; binds `0.0.0.0:$PORT`.

**Trade-off:** Free tier spins down after 15 min idle — first request cold start ~30s.

### Cloudinary (optional)

**Why:** Resume PDF storage without managing S3; free tier sufficient for demos.

**Note:** Render filesystem is ephemeral — never store uploads locally.

---

## Testing & quality

| Tool | Scope |
|------|-------|
| Vitest | API unit + integration tests |
| Supertest | HTTP envelope, middleware, routes |
| ESLint | API + web lint |

---

## What I would change at scale

| Current | At scale |
|---------|----------|
| In-process async AI jobs | Queue (BullMQ / SQS) + workers |
| Polling scoring status | WebSockets or SSE |
| MongoDB documents | Add read replicas; archive old reports |
| Single Render instance | Horizontal pods + Redis rate limit |
| Multi-provider fallback | Primary with circuit breaker + observability |

Use this in interviews to show you understand production gaps.

---

## Related docs

- [Architecture](./architecture.md)
- [Deployment](./deployment.md)
- [Interview Prep — Tech stack questions](./interview-prep/technical-questions.md#tech-stack-choices)
