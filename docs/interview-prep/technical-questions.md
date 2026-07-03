# Technical Interview Questions — PrepEdge AI

Answers use **CTAR**: Claim → Technical detail → Trade-off → Result.

---

## Architecture & system design

### Q1: Walk me through what happens when a user starts a mock interview.

**Claim:** The client gets a fast 202 response while questions generate asynchronously.

**Technical detail:**
1. `POST /api/interviews/setup` (multipart) hits `interviewController.setupInterview`.
2. Middleware verifies Firebase token; `userService` loads MongoDB user.
3. `quotaService` checks `interviews_month` cap (from `@prepedge/shared`).
4. Optional resume: PDF parsed with `pdf-parse`, summarized via `summarizeResume` AI task (cached 7 days by file hash).
5. `interviewService.createInterview` saves an `Interview` with `status: "generating"` and empty `questions[]`.
6. `generateQuestionsAsync` runs in background calling `generateQuestions` with Groq-first fallback chain.
7. On success, interview `status` → `ready`; on failure → `draft`.

**Trade-off:** Client polls or waits on UI; no WebSocket complexity.

**Result:** Users see immediate feedback ("setup started") instead of a 15s blocked HTTP request.

---

### Q2: How does answer scoring work?

**Claim:** Answers are accepted synchronously but scored asynchronously, like question generation.

**Technical detail:**
- `POST /api/interviews/:id/answers` saves the answer on `Report`, sets `scoringStatus: "pending"`, returns 202.
- `scoreAnswerAsync` calls `analyzeAnswer` with sanitized user text in XML delimiters.
- Validator ensures `score` 0–100, `feedback` string, `tags` array.
- When all answers are `scored`, `finalizeReport` runs `generateInterviewSummary` and sets `summaryStatus`.

**Trade-off:** Report may show partial scores while polling; `GET /scoring-status` exposes per-question state.

**Result:** Last answer submission doesn't block on N × LLM latency.

---

### Q3: Why did you use MongoDB instead of PostgreSQL?

**Claim:** Document model fits nested interview and report data.

**Technical detail:** Interviews embed `questions[]`; reports embed `answers[]` with scoring metadata. Templates mirror setup fields. Few cross-user joins needed.

**Trade-off:** Analytics across users uses application-level aggregation; no SQL window functions.

**Result:** Faster schema iteration across M0–M9 modules without migrations.

---

### Q4: Explain your API response envelope.

**Claim:** Every endpoint returns `{ data, error }` for predictable client handling.

**Technical detail:** `responseEnvelopeMiddleware` adds `res.success(data, status)` and `res.fail(code, message)`. Shared `ERROR_CODES` map to HTTP status. Web Axios interceptor unwraps `data` or throws `ApiError` with `code`.

**Trade-off:** Slightly more verbose than raw JSON; can't mix envelope and non-envelope endpoints.

**Result:** Frontend shows `rate_limited` and `validation_error` with user-friendly messages via `getErrorMessage()`.

---

## Tech stack choices

### Q5: Why Firebase Auth instead of rolling your own auth?

**Claim:** Firebase handles credential security and OAuth; API stays stateless.

**Technical detail:** Client uses Firebase SDK; each API request sends ID token; `firebaseAuthMiddleware` verifies with Admin SDK and attaches `uid`. `POST /api/auth/register` links `firebase_uid` to MongoDB user document.

**Trade-off:** Vendor dependency; service account JSON in Render env.

**Result:** No password hashing, session store, or refresh token logic in our codebase.

---

### Q6: Why a monorepo with `packages/shared`?

**Claim:** Single source of truth for validation and error contracts.

**Technical detail:** Zod schemas in `@prepedge/shared` used by API `validate` middleware. Quota caps, `AppError`, AI sanitizer, speech helpers all shared.

**Trade-off:** Workspace tooling complexity; both apps must rebuild on shared changes.

**Result:** Web and API cannot drift on `interviews_month` limit or error code strings.

---

### Q7: Why multiple AI providers?

**Claim:** Resilience and free-tier rate limit handling.

**Technical detail:** `completeWithFallback` loops task-specific chains in `providers/ai/index.js`. Errors collected; if all fail → `upstream_failure` 502. Output validated per task.

**Trade-off:** Non-deterministic outputs; harder debugging; provider-specific JSON quirks.

**Result:** Demo scoring works on Groq when Gemini billing is depleted.

---

## Security

### Q8: How do you prevent prompt injection?

**Claim:** Defense in depth before any LLM call.

**Technical detail:**
1. `assertSafeForAi()` scans for patterns like "ignore previous instructions".
2. Untrusted content wrapped in `<user_answer>`, `<resume_text>` tags.
3. System prompts explicitly say never follow instructions inside tags.
4. Output validated — reject malformed scores/JSON.

**Trade-off:** False positives possible on legitimate resume text; patterns must evolve.

**Result:** `guardrail_violation` 422 instead of model compliance attacks.

---

### Q9: How do you authorize users to only see their data?

**Claim:** Owner checks on every resource access.

**Technical detail:** `ownerMiddleware` compares `req.user._id` to document `user_id`. Reports and interviews queried with `userId` filter. Public reports only via explicit `shareToken` route without auth.

**Trade-off:** No role-based admin panel in v2.

**Result:** User A cannot fetch User B's interview by ID guessing.

---

## Frontend

### Q10: Why TanStack Query instead of Redux?

**Claim:** Server state is the hard problem; Query handles cache, polling, mutations.

**Technical detail:** `useScoringStatus` polls while answers score. `useTemplates` invalidates on create/delete. Auth stays in Context (client-only state).

**Trade-off:** Learning curve; less ideal for complex offline-first.

**Result:** Dashboard refetches quotas after interview without manual refresh logic.

---

### Q11: How does voice input work?

**Claim:** Browser records audio; server transcribes; client computes speech metrics.

**Technical detail:** `RecordingControls` uses `MediaRecorder` → blob → `POST /api/speech/transcribe` → Groq Whisper. Transcript analyzed by `analyzeTranscript` in shared package for WPM and filler words.

**Trade-off:** Mic permissions UX; latency vs typing.

**Result:** API key never exposed to browser; same rate-limit model as other routes.

---

### Q12: How did you handle SEO for a SPA?

**Claim:** Static SEO files + per-page meta via `PageSeo`.

**Technical detail:** `sitemap.xml`, `robots.txt` in `public/`. Home page JSON-LD for `SoftwareApplication`. `react-helmet-async` sets title, description, OG tags per route.

**Trade-off:** No SSR — social crawlers may see less on deep routes than Next.js SSR.

**Result:** Home and marketing pages indexable; app routes behind auth matter less for SEO.

---

## Backend / Node

### Q13: How do you structure the Express app?

**Claim:** Thin routes → controllers → services → models/providers.

**Technical detail:** `index.js` wires global middleware then route modules. Controllers handle HTTP; services hold business rules; no DB calls in controllers beyond orchestration.

**Trade-off:** More files than single-file tutorial apps.

**Result:** `interviewService` testable; AI swappable in `providers/`.

---

### Q14: How do you log and debug production issues?

**Claim:** Structured JSON logs correlated by request ID.

**Technical detail:** `requestIdMiddleware` sets UUID; `requestLoggerMiddleware` logs `durationMs`, `route`, `statusCode`. Async jobs receive `requestId` from controller. Render log drain.

**Trade-off:** No distributed tracing (Jaeger) in v2.

**Result:** Traced a "Summary generation failed" to AI provider chain using `errorDetail` in logs.

---

### Q15: How are usage caps enforced?

**Claim:** Server-side only — never trust the client.

**Technical detail:** `quotaService.assertWithinLimit` before work; `checkAndIncrement` atomically updates user document counters. Periods reset per calendar month/day/week in shared package.

**Trade-off:** Clock skew edge cases; demo account may bypass some limits.

**Result:** Dashboard shows remaining quota from `GET /api/users/me/quotas`.

---

## AI / ML (conceptual)

### Q16: How do you ensure AI returns usable JSON?

**Claim:** Provider JSON mode + server-side parsing + validation.

**Technical detail:** Groq uses `response_format: { type: "json_object" }`; Gemini uses `responseMimeType: application/json`. `parseJsonResponse` extracts JSON substring; task validators enforce schema.

**Trade-off:** Groq may return nested objects when strings expected — validation fails with `upstream_failure`.

**Result:** Bad LLM output never corrupts MongoDB documents.

---

### Q17: What's different between question generation and answer analysis prompts?

**Claim:** Different tasks, different chains, different validators.

**Technical detail:** Questions use setup context (role, JD, resume summary). Analysis compares `user_answer` to `preferred_answer`. Chains both Groq-first but prompts and `maxTokens` differ (1200 vs 150).

**Trade-off:** Cannot reuse one generic prompt.

**Result:** Analysis is fast (~1s); question batch slower (~5s).

---

## Testing

### Q18: What do your tests cover?

**Claim:** API integration tests for envelope, middleware, quotas, templates — 78+ passing.

**Technical detail:** Vitest + Supertest against Express app. Tests assert `{ data, error }` shape, auth failures, validation errors.

**Trade-off:** Limited E2E; no Playwright in v2.

**Result:** CI confidence for refactors across M0–M9.

---

## Debugging (real scenarios)

### Q19: User reported "AI service unavailable" when starting a template with resume. What happened?

**Claim:** Resume summarization failed on sync path before interview creation.

**Technical detail:** Gemini returned 429 (credits depleted). Groq fallback returned `summary` as nested object; `validateResumeSummaryOutput` expected string → generic `upstream_failure`. Without resume, setup returns 202 and Groq generates questions fine.

**Trade-off:** Misleading error message from `toAiAppError` catch-all.

**Result:** Workaround — start without resume; fix — normalize Groq output or reorder provider chain.

---

### Q20: Report summary said "could not be generated" but scores worked. Why?

**Claim:** `INTERVIEW_SUMMARY` task uses Gemini-first chain; same provider/schema issues as resume.

**Technical detail:** `finalizeReport` caught error, set `summaryStatus: "failed"`, placeholder summary text. Per-question `analyzeAnswer` uses Groq-first and succeeded.

**Trade-off:** Partial report UX — scores without narrative summary.

**Result:** Log line `Summary generation failed` in `async/finalizeReport` with `errorDetail`.

---

## Quick-fire round

| Question | Short answer |
|----------|--------------|
| HTTP status for validation error? | 400, code `validation_error` |
| HTTP status for AI failure? | 502, code `upstream_failure` |
| Auth header format? | `Bearer <Firebase ID token>` |
| Where are Zod schemas? | `packages/shared/src/schemas/` |
| STT provider? | Groq Whisper via `/api/speech/transcribe` |
| Frontend host? | Vercel |
| API host? | Render |
| DB? | MongoDB Atlas |
| Cold start concern? | Render free tier spin-down |

---

## Related

- [Behavioral Questions](./behavioral-questions.md)
- [System Design Questions](./system-design.md)
- [Interview Prep Guide](./README.md)
