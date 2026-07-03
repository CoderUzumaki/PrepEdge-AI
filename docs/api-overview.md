# API Overview

REST API reference for PrepEdge AI v2 (`apps/api`).

**Base URL (local):** `http://localhost:5000`  
**Base URL (prod):** Configured via Render service URL

---

## Response envelope

All endpoints return:

```json
{
  "data": { ... } | null,
  "error": { "code": "string", "message": "string", "details": {} } | null
}
```

| Code | HTTP | Meaning |
|------|------|---------|
| `unauthorized` | 401 | Missing/invalid Firebase token |
| `forbidden` | 403 | Not resource owner |
| `not_found` | 404 | Resource missing |
| `validation_error` | 400 | Zod validation failed |
| `rate_limited` | 429 | Too many requests |
| `guardrail_violation` | 422 | Prompt injection detected |
| `upstream_failure` | 502 | AI / external provider failed |
| `internal_error` | 500 | Unexpected server error |

**Headers:** `X-Request-Id` on every response.

---

## Authentication

Protected routes require:

```
Authorization: Bearer <Firebase ID token>
```

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/auth/register` | Bearer | Create/link MongoDB user after Firebase signup |
| `POST /api/auth/login` | Bearer | Sync user profile on login |

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Liveness check for Render |

---

## Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Current user profile |
| GET | `/api/users/me/quotas` | Usage caps (interviews/month, practice/day, resume/week) |
| PATCH | `/api/users/me` | Update preferences |
| DELETE | `/api/users/me` | Account + data deletion |

---

## Interviews

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/interviews/setup` | Create interview (multipart: setup fields + optional resume) → **202** |
| POST | `/api/interviews/practice` | Single practice question interview → **201** |
| GET | `/api/interviews/:id` | Interview details + questions |
| POST | `/api/interviews/:id/answers` | Submit answer → **202** (async scoring) |
| PATCH | `/api/interviews/:id/progress` | Save current question index |
| GET | `/api/interviews/:id/scoring-status` | Poll answer scores + summary status |
| GET | `/api/interviews/analytics/dashboard` | Score trends, weak topics |

---

## Reports

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reports/:interviewId` | Full report for owner |
| POST | `/api/reports/:interviewId/share` | Generate public share token |
| DELETE | `/api/reports/:interviewId/share` | Revoke share link |
| GET | `/api/reports/public/:token` | Public read-only report (no auth) |

---

## Templates

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/templates` | System + user templates |
| GET | `/api/templates/:id` | Template detail |
| POST | `/api/templates` | Create user template |
| DELETE | `/api/templates/:id` | Delete user template |
| POST | `/api/templates/:id/start` | Start interview from template (optional resume) → **202** |

---

## Speech

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/speech/transcribe` | Audio → text (Groq Whisper) |

---

## Demo (public / recruiter)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/demo/sample-question` | No | Static sample question |
| POST | `/api/demo/sample-answer` | No | Score sample answer (lead magnet) |
| POST | `/api/demo/session` | No | Magic-link demo account token |

---

## Contact

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/contact` | Contact form (rate limited; optional email) |

---

## Async patterns

| Endpoint | Sync work | Async work |
|----------|-----------|------------|
| `POST .../setup` | Save interview, quotas | `generateQuestions` |
| `POST .../answers` | Save answer, quotas | `analyzeAnswer`, maybe `finalizeReport` |
| `POST .../templates/:id/start` | Resume summarize if PDF uploaded | `generateQuestions` |

Clients should poll `GET .../scoring-status` or interview `status` field.

---

## Rate limiting

Applied per-route (see `apps/api/middleware/rateLimit.js`):

- Interview setup / answers
- Contact form
- Demo endpoints

Exceeded limits return `rate_limited` with envelope (not raw 429 body).

---

## Related docs

- [Architecture — request lifecycle](./architecture.md#request-lifecycle)
- [Data Models](./data-models.md)
- [BUILD.md — API envelope spec](./development/BUILD.md)
