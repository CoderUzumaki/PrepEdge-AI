# PrepEdge AI

<p align="center">
  <strong>AI-powered mock interview platform</strong> — personalized questions, instant scoring, voice analysis, and shareable PDF reports.
</p>

<p align="center">
  <a href="https://prepedgeai.vercel.app"><strong>Live Demo → prepedgeai.vercel.app</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="v2.0.0" />
  <img src="https://img.shields.io/badge/Frontend-Vercel-black" alt="Vercel" />
  <img src="https://img.shields.io/badge/Backend-Render-blue" alt="Render" />
  <img src="https://img.shields.io/badge/GSSoC-2025-orange" alt="GSSoC 2025" />
</p>

---

## Features

- **Personalized AI questions** from resume, role, job description, and interview type
- **Async scoring** with per-question feedback, tags, and overall summary
- **Voice input** via Groq Whisper (server-side STT proxy) + speech metrics
- **Interview templates** — 6 system presets + custom user templates
- **Dashboard analytics** — score trends, weak topics, type breakdown
- **PDF reports** + opt-in public share links
- **Recruiter demo** — sample question on homepage, magic-link demo account
- **Usage caps** — server-enforced free-tier limits
- **Dark mode** + SEO (sitemap, JSON-LD, OG tags)

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite 6, Tailwind v4, TanStack Query, React Router 7 |
| Backend | Express 5, Mongoose, Firebase Admin |
| Database | MongoDB Atlas |
| Auth | Firebase Auth |
| AI | Groq, Gemini, Hugging Face (task-specific fallback chains) |
| Hosting | Vercel (web) · Render (API) |

**Full justification:** [docs/tech-stack.md](./docs/tech-stack.md)

---

## Quick start

```bash
git clone https://github.com/CoderUzumaki/PrepEdge-AI.git
cd PrepEdge-AI
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Fill in MongoDB, Firebase, and AI keys — see getting-started guide
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:5000  

**Detailed setup:** [docs/getting-started.md](./docs/getting-started.md)

---

## Documentation

All documentation lives in **[`docs/`](./docs/README.md)**:

| For… | Read |
|------|------|
| **Interview prep** (technical + behavioral Q&A) | [docs/interview-prep/README.md](./docs/interview-prep/README.md) |
| Architecture & system design | [docs/architecture.md](./docs/architecture.md) |
| API reference | [docs/api-overview.md](./docs/api-overview.md) |
| Deployment | [docs/deployment.md](./docs/deployment.md) |
| Contributors | [docs/development/BUILD.md](./docs/development/BUILD.md) |
| Product requirements | [docs/development/PLAN.md](./docs/development/PLAN.md) |

---

## Project structure

```
PrepEdge-AI/
├── apps/
│   ├── api/          # Express REST API
│   └── web/          # React SPA
├── packages/
│   └── shared/       # Zod schemas, errors, quotas, AI sanitizer
├── docs/             # Documentation (start here for deep dives)
└── render.yaml       # Render deploy config
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + web concurrently |
| `npm run dev:api` | API only (port 5000) |
| `npm run dev:web` | Web only (port 5173) |
| `npm test` | API Vitest suite |
| `npm run lint` | ESLint (api + web) |
| `npm run build` | Production web build |

---

## Contributing

PrepEdge AI is part of **GirlScript Summer of Code (GSSoC) 2025**. Contributions welcome!

1. Read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
2. Read [docs/getting-started.md](./docs/getting-started.md) and [docs/development/BUILD.md](./docs/development/BUILD.md)
3. Pick or open an issue; wait for assignment
4. Fork → branch → PR with tests green

---

## Author

**Abhinav Mishra** — [@CoderUzumaki](https://github.com/CoderUzumaki)

---

## License

[MIT License](./LICENSE)
