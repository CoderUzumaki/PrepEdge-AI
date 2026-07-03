# Interview Preparation Guide — PrepEdge AI

**Purpose:** Study this project deeply enough to answer technical, behavioral, and system-design questions in real interviews.

**Live demo:** [prepedgeai.vercel.app](https://prepedgeai.vercel.app)

---

## How to answer in interviews (formats)

### Technical questions

Use **CTAR**:

1. **Claim** — Direct answer in one sentence  
2. **Technical detail** — How PrepEdge implements it  
3. **Trade-off** — What you gave up / what you'd do at scale  
4. **Result** — User or system outcome  

*Example:* "We use async question generation — the API returns 202 immediately and generates questions in the background because LLM calls take 5–15 seconds; the trade-off is the client must poll status, but users aren't stuck on a loading HTTP request."

### Behavioral questions

Use **STAR**:

- **Situation** — Context (GSSoC, v2 rebuild, user bug report)  
- **Task** — Your responsibility  
- **Action** — Specific steps you took  
- **Result** — Measurable outcome (tests passing, feature shipped, users unblocked)  

### System design questions

Use **RADIO** (lightweight):

- **Requirements** — Functional + non-functional  
- **Architecture** — Boxes and arrows  
- **Data** — Storage choices  
- **Interfaces** — API contracts  
- **Optimizations** — Caching, queues, scaling  
- **Ops** — Monitoring, failures  

---

## 30-second elevator pitch

> PrepEdge AI is a full-stack mock interview platform I built as part of GSSoC 2025. Candidates configure interviews from their resume and job description; our API generates personalized questions using a multi-provider AI pipeline with Groq, Gemini, and Hugging Face fallbacks. Answers are scored asynchronously, speech is transcribed via Groq Whisper, and users get PDF reports with trends on a dashboard. It's deployed on Vercel and Render with Firebase auth and MongoDB — entirely on free tiers.

---

## 2-minute project walkthrough

1. **Problem:** Candidates practice alone without personalized feedback or progress tracking.  
2. **Solution:** AI mock interviews with scoring, speech metrics, templates, and shareable reports.  
3. **Users:** Job seekers (primary); recruiters via demo mode and public sample question.  
4. **Architecture:** React SPA → Express API → MongoDB + AI providers. Monorepo with shared Zod schemas.  
5. **Highlights:**  
   - v2 rebuild in 10 modules (M0–M9): envelope API, quotas, AI security, STT, templates, sharing, SEO  
   - Prompt injection defense + output validation  
   - Async AI jobs with polling UX  
   - 78+ automated tests on API  
6. **Your role:** Be honest — project admin / lead contributor under GSSoC; describe modules you owned.

---

## What makes this project interview-worthy

| Theme | Proof in codebase |
|-------|-------------------|
| Full-stack ownership | `apps/web` + `apps/api` + `packages/shared` |
| Production deployment | Vercel + Render + Atlas + Firebase |
| AI integration | Not just "called OpenAI" — fallback chains, validation, guardrails |
| Security awareness | Firebase tokens, owner middleware, sanitizer, rate limits |
| UX under latency | 202 + async + polling |
| Product thinking | Quotas, demo funnel, SEO, share links |
| Engineering discipline | Envelope API, structured logs, `X-Request-Id`, Vitest |

---

## Architecture you should draw on a whiteboard

```
[Browser] --Firebase Auth--> [Vercel React SPA]
                |
                | HTTPS + Bearer JWT
                v
         [Render Express API]
           /    |     \
          v     v      v
      MongoDB  Firebase  Groq/Gemini/HF
```

Add for depth:

- `POST /setup` → 202 → async `generateQuestions`  
- `POST /answers` → async `analyzeAnswer` → `finalizeReport`  
- `POST /speech/transcribe` → Groq Whisper  

Full detail: [Architecture](../architecture.md)

---

## Tech stack — quick justifications

| Choice | One-line why |
|--------|----------------|
| React + Vite | Fast SPA dev; no SSR needed for app shell |
| Express | Simple REST + middleware pipeline |
| MongoDB | Nested interview/report documents |
| Firebase Auth | Free, secure, no password storage |
| Groq | Fast LLM + Whisper on one key |
| Multi-provider AI | Free-tier limits + resilience |
| TanStack Query | Polling, cache, mutations |
| Monorepo shared package | One validation/error source |

Full detail: [Tech Stack](../tech-stack.md)

---

## Modules you can discuss (v2 rebuild)

| Module | Interview hook |
|--------|----------------|
| M0 Foundation | "I standardized every API response to `{ data, error }` with request IDs for observability." |
| M2 Usage caps | "Server-enforced freemium limits prevent AI cost abuse." |
| M3 AI security | "User resume text is wrapped in XML delimiters and scanned for injection patterns before LLM calls." |
| M4 STT | "We proxy Whisper server-side so API keys never hit the browser." |
| M5 Templates | "Six system templates + user CRUD for one-click interview start." |
| M6 Reports | "Opt-in share tokens with expiry; account deletion for GDPR-minded users." |
| M7 Demo | "Recruiter funnel: sample question without signup, magic-link read-only demo." |
| M8 SEO | "Sitemap, robots.txt, JSON-LD, OG tags for discoverability." |
| M9 Polish | "Dark mode, Vercel-style landing, lazy routes, error boundaries." |

Detail: [V2_STATE.md](../development/V2_STATE.md)

---

## Known limitations (honesty wins interviews)

| Limitation | What you'd say |
|------------|----------------|
| AI output inconsistency | "We validate JSON shape server-side; Groq sometimes returns arrays where we expect strings." |
| Gemini billing | "Fallback chains matter — when Gemini 429s, Groq handles most tasks." |
| Render cold starts | "Free tier trade-off; acceptable for portfolio, not for SLA." |
| No job queue | "Async work is fire-and-forget in-process; I'd add BullMQ at scale." |
| Polling vs WebSockets | "Chose polling for simplicity; SSE would reduce load." |

---

## Demo script (if interviewer asks to see it)

1. Open home → try sample question (no login)  
2. Sign up → dashboard with quotas  
3. Start template interview (no resume for reliability)  
4. Answer one question via voice  
5. Show report with scores + PDF  
6. Optional: share link  

---

## Question banks

| Doc | Contents |
|-----|----------|
| [Technical Questions](./technical-questions.md) | React, Node, MongoDB, AI, auth, API design |
| [Behavioral Questions](./behavioral-questions.md) | STAR stories tied to this project |
| [System Design Questions](./system-design.md) | Scale, security, redesign scenarios |

---

## Study checklist (before an interview)

- [ ] Draw architecture from memory in < 3 minutes  
- [ ] Explain async interview flow (setup → questions → answers → report)  
- [ ] Name three error codes and HTTP statuses from envelope API  
- [ ] Explain why Firebase + MongoDB (not just Firebase for everything)  
- [ ] Describe one bug you debugged (AI provider / resume summary / summary generation)  
- [ ] Run `npm run dev` and complete one interview  
- [ ] Read PRD problem statement in [PLAN.md](../development/PLAN.md)  

---

## Related documentation

- [docs/README.md](../README.md) — Documentation index  
- [Getting Started](../getting-started.md) — Local setup  
- [API Overview](../api-overview.md) — Endpoints  
