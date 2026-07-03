# Getting Started

Local development setup for PrepEdge AI v2.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 LTS |
| npm | ≥ 10 |
| Git | ≥ 2.40 |
| MongoDB Atlas | Free M0 cluster |
| Firebase | Spark (free) project |

---

## 1. Clone and install

```bash
git clone https://github.com/CoderUzumaki/PrepEdge-AI.git
cd PrepEdge-AI
npm install
```

This is an **npm workspaces** monorepo:

- `apps/api` — Express REST API
- `apps/web` — React + Vite SPA
- `packages/shared` — Zod schemas, error codes, quotas, AI sanitizer

---

## 2. Environment variables

### API (`apps/api/.env`)

Copy from example:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `FIREBASE_SERVICE_ACCOUNT` | Yes | JSON string for Firebase Admin SDK |
| `GROQ_API_KEY` | Recommended | Primary LLM + Whisper STT |
| `GEMINI_API_KEY` | Recommended | AI fallback (resume/summary tasks) |
| `HUGGING_FACE_API_KEY` | Optional | Third AI fallback |
| `CLOUDINARY_*` | Optional | Resume PDF storage |
| `EMAIL_*` | Optional | Contact form |
| `ALLOWED_ORIGINS` | Yes | CORS — include `http://localhost:5173` |

### Web (`apps/web/.env`)

```bash
cp apps/web/.env.example apps/web/.env
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API base URL (`http://localhost:5000` locally) |
| `VITE_FIREBASE_*` | Firebase client config for auth |

---

## 3. Run locally

```bash
# Both API (5000) and web (5173)
npm run dev

# Or separately
npm run dev:api
npm run dev:web
```

- **Web:** http://localhost:5173  
- **API:** http://localhost:5000  
- **Health:** http://localhost:5000/api/health  

---

## 4. Test and lint

```bash
npm test    # API Vitest suite
npm run lint
```

---

## 5. First-time flows to verify

1. Sign up / log in (Firebase Auth)
2. Dashboard — quota display
3. Create interview or start from template
4. Answer questions (text or voice via Groq Whisper)
5. View report + PDF download
6. Public demo — home page sample question (no auth)

---

## Troubleshooting

| Issue | Likely cause |
|-------|----------------|
| `User not found` on first login | Race before `/api/auth/register` — refresh or log in again |
| `AI service unavailable` on template start **with resume** | Gemini credits depleted + Groq resume JSON shape mismatch |
| Summary not generated on report | Same AI provider chain issue for `INTERVIEW_SUMMARY` task |
| CORS errors | `ALLOWED_ORIGINS` missing frontend URL |

See [Tech Stack — AI providers](./tech-stack.md#ai-providers) for provider fallback details.

---

## Contributing

1. Read [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
2. Pick an issue or propose one
3. Branch from `main` or `v2` per [BUILD.md](./development/BUILD.md)
4. Keep PRs focused; ensure `npm test` and `npm run lint` pass

Original contributor guide: [development/LEARN.md](./development/LEARN.md)
