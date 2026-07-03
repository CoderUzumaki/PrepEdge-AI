# System Design Interview Questions — PrepEdge AI

Use **RADIO**: Requirements → Architecture → Data → Interfaces → Optimizations → Ops.

---

## Scenario 1: Design PrepEdge from scratch

### Requirements

**Functional:**
- Users sign up, configure mock interviews, answer by text/voice, receive scored reports and trends.
- Recruiters try product without signup.

**Non-functional:**
- Free tier / low cost initially
- P95 API < 3s for non-AI paths; AI async acceptable
- Basic security (auth, data isolation)

### Architecture

```
CDN (static) + SPA
        |
    API Gateway / Load Balancer
        |
   Stateless API servers
    /     |      \
  DB    Queue    Object storage
         |
    AI worker pool
```

**PrepEdge today:** Simplified — no queue; AI in API process; Vercel + Render + Atlas.

### Data

- **Users** — auth ID, quotas, preferences
- **Interviews** — setup + generated questions
- **Reports** — answers, scores, summary
- **Templates** — reusable setup presets

MongoDB documents match current implementation.

### Interfaces

- REST + `{ data, error }` envelope
- 202 for long operations
- `GET /scoring-status` for polling

### Optimizations (at scale)

| Bottleneck | Mitigation |
|------------|------------|
| LLM latency | Job queue + workers; cache similar JD hashes |
| DB reads | Index `user_id`, `interviewId`; read replicas |
| STT upload | Presigned S3 URLs; chunk streaming |
| Dashboard analytics | Pre-aggregate nightly job |

### Ops

- Structured logs + trace IDs (have `X-Request-Id`)
- Alerts on `upstream_failure` rate
- Health checks (`/api/health`)

**Interview close:** *"I built a minimal version without the queue because portfolio scale didn't justify Redis yet, but the boundaries — services and providers — are where I'd attach workers."*

---

## Scenario 2: Scale to 100k daily active users

### Requirements

- Same features; SLA 99.5%; AI cost controlled

### Changes from current design

| Component | Today | At scale |
|-----------|-------|----------|
| API | Single Render instance | K8s / ECS autoscaling |
| AI calls | In-process async | Dedicated worker tier + priority queues |
| Rate limits | In-memory / per-instance | Redis sliding window |
| DB | Atlas M0 | Sharded cluster; archive cold reports |
| CDN | Vercel | Same + edge caching for public demo |
| Auth | Firebase | Same (scales well) |

### Cost control

- Tiered quotas (already have server caps)
- Cheaper model for practice mode
- Batch question generation
- Cache resume summaries (already 7-day TTL)

### Failure modes

- Provider outage → circuit breaker per provider
- Queue backlog → scale workers; degrade to text-only
- DB slow → timeout + cached dashboard snapshots

---

## Scenario 3: Secure the AI pipeline

### Threat model

| Threat | Mitigation in PrepEdge |
|--------|------------------------|
| Prompt injection in answers/resume | `assertSafeForAi`, XML delimiters, system rules |
| User reads others' reports | Owner middleware + share tokens only |
| API key theft | Server-side AI only; never in Vite bundle |
| Token replay | Firebase short-lived ID tokens |
| Abuse / cost explosion | Rate limits + usage caps |
| Malicious PDF | Parse text only; size limits; no execution |

### Additional at scale

- WAF on API
- Per-user AI budget in Redis
- Human review queue for flagged guardrail hits
- Audit log of AI inputs (hashed)

**Interview answer:** Walk through one answer submission from mic → transcribe → sanitize → prompt → validate output.

---

## Scenario 4: Real-time scoring instead of polling

### Requirements

- User sees score within 1s of submit without refresh

### Design

```
Client --WS/SSE--> API gateway
                      |
                 Redis pub/sub <-- worker (AI score done)
```

**PrepEdge polling today:** `GET /scoring-status` every 2s — simple, works behind corporate firewalls.

**Trade-off:** WebSockets add connection state on server; SSE one-way may suffice.

**Migration path:** Add SSE endpoint; keep polling fallback in React Query.

---

## Scenario 5: Multi-tenant B2B (companies buy PrepEdge for candidates)

### New requirements

- Org admin invites candidates
- Branded reports
- Org-level analytics

### Data model changes

```
Organization (1) ──< Users (many)
Organization (1) ──< InterviewTemplates (many)
```

- Add `org_id` to users, interviews, reports
- RBAC: `admin`, `candidate`, `viewer`
- Row-level security or query filters on every service method

**PrepEdge today:** Single-tenant per user; `ownerMiddleware` is user-scoped only.

---

## Scenario 6: Design shareable report links safely

### Requirements

- Opt-in public read
- Revocable
- Optional expiry
- No PII leak beyond report

### PrepEdge implementation

- `shareToken` UUID on report
- `GET /api/reports/public/:token` — no auth
- `shareExpiresAt` optional
- `DELETE .../share` revokes

### Enhancements

- Password-protected shares
- View count analytics
- Watermark on PDF
- robots noindex on public report pages

---

## Scenario 7: How would you test this system end-to-end?

### Pyramid

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Services, validators, sanitizer |
| Integration | Supertest | Routes + envelope |
| E2E | Playwright | Signup → interview → report |
| AI | Mock providers | Deterministic CI without API keys |
| Load | k6 | Rate limits, cold starts |

**Current gap:** No Playwright; AI tests mock or use real keys in dev.

---

## Whiteboard exercise: Draw PrepEdge data flow

Practice drawing in 5 minutes:

1. User → Firebase Auth → SPA
2. SPA → API (Bearer)
3. Setup → MongoDB interview (generating)
4. Worker concept → AI → MongoDB (ready)
5. Answers → Report → AI score → finalize summary
6. Dashboard reads aggregated reports

---

## Comparison questions

### Q: PrepEdge vs simple ChatGPT wrapper?

| ChatGPT wrapper | PrepEdge |
|-----------------|----------|
| Single prompt | Structured lifecycle + persistence |
| No auth/quotas | Firebase + server caps |
| No validation | Output validators + guardrails |
| Sync only | Async jobs + polling |
| No analytics | Dashboard trends, templates, PDF |

---

## Related

- [Architecture](../architecture.md)
- [Technical Questions](./technical-questions.md)
- [Interview Prep Guide](./README.md)
