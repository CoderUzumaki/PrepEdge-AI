# Deployment

How PrepEdge AI is deployed to production.

---

## Topology

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend SPA | Vercel | https://prepedgeai.vercel.app |
| REST API | Render | Render web service URL |
| Database | MongoDB Atlas | M0 free cluster |
| Auth | Firebase | Firebase console project |

---

## Frontend — Vercel

1. Connect GitHub repo; set **root** to repo root or `apps/web` per Vercel project config.
2. Build command: `npm run build` (builds `apps/web` via workspace script).
3. Output: `apps/web/dist`
4. Environment variables (Vercel dashboard):

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-api.onrender.com` |
| `VITE_FIREBASE_*` | From Firebase console |

5. Custom domain: `prepedgeai.vercel.app`

**Analytics:** Vercel Web Analytics events (`signup`, `interview_complete`, `pdf_download`, `demo_click`) via `apps/web/src/lib/analytics.js`.

---

## Backend — Render

Defined in `render.yaml`:

```yaml
services:
  - type: web
    name: prepedge-api
    runtime: node
    rootDir: apps/api
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
```

**Critical Render rules:**

- Bind to `0.0.0.0` and `process.env.PORT`
- Filesystem is **ephemeral** — use MongoDB/Cloudinary, not local disk
- Free tier spins down after 15 minutes idle

**Environment variables (Render dashboard):**

| Variable | Required |
|----------|----------|
| `MONGO_URI` | Yes |
| `FIREBASE_SERVICE_ACCOUNT` | Yes (JSON string) |
| `GROQ_API_KEY` | Yes (recommended) |
| `GEMINI_API_KEY` | Recommended |
| `HUGGING_FACE_API_KEY` | Optional |
| `ALLOWED_ORIGINS` | `https://prepedgeai.vercel.app` |
| `CLOUDINARY_*` | Optional |
| `EMAIL_*` | Optional |
| `DEMO_FIREBASE_UID` | For seeded demo account |

---

## Database — MongoDB Atlas

1. Create M0 free cluster.
2. Network access: allow `0.0.0.0/0` (or Render IPs if restricted).
3. Database user with read/write.
4. Connection string → `MONGO_URI`.

**Seeding on startup:** API runs `seedSystemTemplates()` and `seedDemoAccount()` after DB connect.

---

## Firebase

1. Enable Email/Password + Google sign-in.
2. Download service account JSON → stringify for `FIREBASE_SERVICE_ACCOUNT`.
3. Add authorized domains: `prepedgeai.vercel.app`, `localhost`.

---

## CORS

`ALLOWED_ORIGINS` must include every frontend origin (comma-separated):

```
https://prepedgeai.vercel.app,http://localhost:5173
```

---

## CI / pre-deploy checklist

```bash
npm install
npm run lint
npm test
npm run build
```

---

## Interview talking points

**Q: How do you deploy frontend and backend separately?**

> *"The frontend is a static Vite build on Vercel's CDN. The API is a Node service on Render with a health check at `/api/health`. They communicate over HTTPS; the SPA reads `VITE_API_URL` at build time. Firebase handles auth tokens; the API is stateless and verifies each request."*

**Q: What happens when Render spins down?**

> *"Free tier cold starts add latency to the first API call after idle. The health check and user-facing loading states absorb this. At scale I'd use a paid instance or keep-warm ping."*

---

## Related docs

- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
- [Tech Stack — Infrastructure](./tech-stack.md#infrastructure)
