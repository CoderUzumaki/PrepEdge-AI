# Data Models

MongoDB collections and relationships (Mongoose models in `apps/api/models/`).

---

## Entity relationship (logical)

```
User (1) ──────< Interview (many)
User (1) ──────< InterviewTemplate (many, user-created)
User (1) ──────< Report (many)
Interview (1) ──── Report (1)     [linked by interviewId]
ResumeCache (many)               [keyed by file hash, not user]
```

---

## User

**File:** `UserModel.js`

| Field | Type | Notes |
|-------|------|-------|
| `firebase_uid` | String | Unique; links to Firebase Auth |
| `email`, `name` | String | Profile |
| `quotas` | Object | Counters per period (interviews, practice, resume) |
| `preferences` | Object | User settings |
| `is_demo` | Boolean | Read-only demo account flag |

**Quotas** enforced server-side in `quotaService.js` using caps from `@prepedge/shared`.

---

## Interview

**File:** `InterviewModel.js`

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | ObjectId | Owner |
| `interview_name` | String | Display name |
| `num_of_questions` | Number | Expected count |
| `interview_type` | Enum | technical / behavioral / mixed |
| `role`, `experience_level` | String | Context for AI |
| `company_name`, `company_description`, `job_description` | String | Optional context |
| `focus_area` | String | Topic focus |
| `resume_link`, `resume_summary` | String | Optional |
| `status` | Enum | `generating` → `ready` → `in_progress` → `completed` |
| `questions` | Array | `{ question, preferred_answer }` |
| `current_question_index` | Number | Progress |

---

## Report

**File:** `ReportModel.js`

| Field | Type | Notes |
|-------|------|-------|
| `userId`, `interviewId` | ObjectId | Links |
| `answers` | Array | Per-question: answer, score, feedback, tags, `scoringStatus` |
| `finalScore` | Number | Average of scored answers |
| `summary`, `strengths`, `areaOfImprovement` | String | AI-generated |
| `summaryStatus` | Enum | `pending` / `generating` / `completed` / `failed` |
| `shareToken`, `shareExpiresAt` | String / Date | Public share (M6) |
| `speechMetrics` | Object | WPM, fillers (M4) |

---

## InterviewTemplate

**File:** `InterviewTemplateModel.js`

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | ObjectId | `null` for system templates |
| `name` | String | |
| `is_system` | Boolean | 6 seeded templates |
| Setup fields | — | Mirror interview setup (role, type, JD, etc.) |

---

## ResumeCache

**File:** `ResumeCacheModel.js`

| Field | Type | Notes |
|-------|------|-------|
| `fileHash` | String | SHA-256 of PDF buffer |
| `summary` | String | AI-generated summary |
| `expiresAt` | Date | 7-day TTL |

Avoids re-summarizing identical resumes; saves AI quota.

---

## Indexing recommendations (production)

| Collection | Index |
|------------|-------|
| User | `firebase_uid` (unique) |
| Interview | `user_id`, `status` |
| Report | `interviewId`, `userId`, `shareToken` (sparse unique) |
| ResumeCache | `fileHash`, `expiresAt` |
| Template | `user_id`, `is_system` |

---

## Related docs

- [Architecture](./architecture.md)
- [API Overview](./api-overview.md)
