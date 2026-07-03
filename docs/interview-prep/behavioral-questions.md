# Behavioral Interview Questions — PrepEdge AI

Answers use **STAR**: Situation → Task → Action → Result.

Adapt names, dates, and metrics to your real experience. These are framed for GSSoC / open-source project leadership.

---

## Leadership & ownership

### Q1: Tell me about a project you're proud of.

**Situation:** Job candidates often practice interviews without personalized feedback. I maintained PrepEdge AI through GSSoC 2025 and led a full v2 rebuild.

**Task:** Deliver a production-grade platform on free-tier infrastructure — auth, AI scoring, voice, reports, and recruiter demo — while coordinating contributors.

**Action:**
- Defined a modular rebuild (M0–M9) with BUILD.md acceptance criteria and dependency order.
- Standardized API contracts (`{ data, error }`), logging, and shared Zod validation.
- Shipped features incrementally: STT proxy, templates, shareable reports, SEO, dark mode.
- Reviewed PRs for architecture consistency and test coverage.

**Result:** Live app at prepedgeai.vercel.app; 78+ API tests; v2 at npm `2.0.0`; documented handoff in `docs/` for future contributors and interviews like this one.

---

### Q2: Describe a time you had to make a technical decision with trade-offs.

**Situation:** v2 needed AI integration but free-tier Groq/Gemini have rate limits and outages.

**Task:** Choose between single-provider simplicity vs resilience.

**Action:**
- Built `completeWithFallback` with task-specific provider order.
- Added output validators so bad JSON never reaches MongoDB.
- Added `upstream_failure` error code and user-visible messages.

**Trade-off (mention explicitly):** More code and debugging complexity vs single OpenAI key.

**Result:** Demo and answer scoring kept working when Gemini billing hit 429; users see graceful errors instead of corrupt data.

---

## Problem-solving

### Q3: Tell me about a difficult bug you fixed.

**Situation:** Users saw `upstream_failure` when starting template interviews with a resume PDF, but the demo sample answer worked fine.

**Task:** Diagnose without disrupting production users.

**Action:**
- Correlated ~7s request duration with synchronous AI on template start path.
- Traced code: only `getOrCreateResumeSummary` blocks HTTP; question gen is async.
- Reproduced locally: Gemini 429, Groq returned nested JSON, validator rejected.
- Documented root cause in team docs (no silent failure).

**Result:** Identified workaround (skip resume upload); clear fix path (normalize Groq output or reorder providers). Showed systematic debugging: logs → code path → reproduction.

---

### Q4: Describe a time something failed in production.

**Situation:** After completing a mock interview, report showed scores but "Summary could not be generated."

**Task:** Determine if data loss occurred and severity.

**Action:**
- Found `Summary generation failed` in Render logs on `async/finalizeReport`.
- Confirmed `analyzeAnswer` succeeded (Groq-first); `generateInterviewSummary` failed (Gemini-first).
- Verified `summaryStatus: "failed"` in data model — interview still marked completed.

**Result:** No answer data lost; partial degradation. Planned provider-chain alignment for summary task. Demonstrated calm incident triage and honest UX (placeholder message vs crash).

---

## Collaboration (GSSoC / open source)

### Q5: How did you work with contributors?

**Situation:** GSSoC brings developers of varying experience to one repo.

**Task:** Keep quality high without blocking contributions.

**Action:**
- Wrote LEARN.md and BUILD.md with folder structure and setup steps.
- Used issue templates and CODE_OF_CONDUCT.
- Scoped modules (M4 STT, M5 templates) so PRs stay reviewable.
- Required `npm test` and lint before merge.

**Result:** Multiple modules merged to `v2` with consistent envelope API; contributors could onboard from docs alone.

---

### Q6: Tell me about receiving or giving critical feedback.

**Situation:** A contributor PR mixed feature work with unrelated formatting changes.

**Task:** Merge the feature without encouraging noisy diffs.

**Action:**
- Reviewed PR with specific line comments on scope.
- Asked to split or revert unrelated changes.
- Pointed to BUILD.md coding standards and module acceptance criteria.
- Approved quickly once focused.

**Result:** Cleaner git history; contributor learned project conventions for next PR.

---

## Prioritization

### Q7: How did you prioritize the v2 roadmap?

**Situation:** Many features requested — caps, STT, templates, SEO, polish — limited maintainer time.

**Task:** Order work for maximum user and demo value.

**Action:**
- M0 foundation first (envelope, errors, logging) — everything depends on it.
- M2 caps before heavy AI usage (cost abuse prevention).
- M3 AI security before scaling prompts.
- M4 + M5 parallel after foundation.
- M7 demo before M8 SEO (recruiter funnel).
- M9 polish last.

**Result:** Each merge left `v2` deployable; recruiter demo path worked before marketing polish.

---

## User focus

### Q8: Tell me about a time you advocated for the user.

**Situation:** Long LLM calls blocked HTTP requests in early flows.

**Task:** Improve perceived performance.

**Action:**
- Changed setup and answer endpoints to return 202 Accepted.
- Added scoring status polling and clear loading states.
- Surfaced quota limits on dashboard before users hit walls.

**Result:** Users navigate immediately; background work with transparent progress; fewer "frozen screen" reports.

---

### Q9: How did you design for recruiters, not just candidates?

**Situation:** Recruiters spend <30 seconds on portfolio projects (stated in PRD).

**Task:** Create a zero-friction demo path.

**Action:**
- Public sample question + instant AI score on home page (no signup).
- Magic-link demo account with read-only banner.
- Shareable report links with optional expiry.
- Landing page redesign (M9) with clear CTAs.

**Result:** Recruiter can evaluate AI quality in one minute without creating an account.

---

## Learning & growth

### Q10: What did you learn building this project?

**Situation:** First time operating multi-provider AI in production on free tiers.

**Task:** Ship reliable features despite non-deterministic LLMs.

**Action:**
- Learned prompt structuring with untrusted delimiters.
- Learned never trust LLM JSON without validation.
- Learned async job patterns for long-running inference.
- Learned Render/Vercel operational constraints (cold starts, ephemeral disk).

**Result:** I can discuss AI integration as engineering (validation, fallbacks, observability), not just API calls.

---

### Q11: What's a mistake you made and how did you fix it?

**Situation:** Early v2 assumed single AI provider would always return correct JSON shapes.

**Task:** Reports and summaries failed silently or with cryptic errors.

**Action:**
- Added `validateOutput.js` per AI task.
- Mapped errors to stable codes in `aiErrors.js`.
- Reordered provider chains per task based on reliability testing.

**Result:** Failures are explicit (`summaryStatus: "failed"`); easier debugging; taught me to design for provider failure as the norm.

---

## Conflict & pressure

### Q12: Deadline pressure — how did you handle it?

**Situation:** GSSoC timeline with multiple modules remaining before showcase.

**Task:** Ship M7–M9 without skipping tests.

**Action:**
- Cut scope to acceptance criteria in BUILD.md only (no gold-plating).
- Deferred nice-to-haves (e.g. WebSockets) explicitly.
- Ran full test suite before each merge.
- Documented known AI provider limitations honestly.

**Result:** v2 integration branch complete with green tests; known limitations documented for interview honesty.

---

## Motivation

### Q13: Why this project? Why open source?

**Situation:** Interview prep is a problem I relate to; GSSoC offered mentorship and community.

**Task:** Build something useful publicly.

**Action:** Invested in docs, live deployment, and contributor onboarding — not just code.

**Result:** Portfolio piece with real users, real infra, and verifiable GitHub history — stronger than a tutorial clone.

---

### Q14: Where do you see this project going?

**Honest forward-looking answer (not BS):**

**Situation:** v2 completes core loop; AI costs and provider quirks remain.

**Task:** Prioritize next investments if I continued.

**Action I'd take:**
- Job queue for AI tasks (BullMQ + Redis).
- Normalize LLM outputs in one layer.
- E2E tests with Playwright.
- Paid tier or sponsor keys for reliable Gemini.

**Result:** Shows product thinking beyond current codebase.

---

## PrepEdge-specific rapid STAR prompts

Practice 60-second answers for:

| Prompt | Hook |
|--------|------|
| Hardest technical challenge | Multi-provider AI + validation |
| Worked under constraints | Free tier only |
| Improved code quality | M0 envelope + tests |
| Handled ambiguous requirements | PRD → BUILD modules |
| Taught someone something | LEARN.md / code review |
| Disagreed with approach | Sync vs async AI (chose async) |

---

## Related

- [Technical Questions](./technical-questions.md)
- [System Design Questions](./system-design.md)
- [Interview Prep Guide](./README.md)
