# PrepEdge AI — Documentation

Central documentation for **PrepEdge AI v2** — an AI-powered mock interview platform.

**Live app:** [prepedgeai.vercel.app](https://prepedgeai.vercel.app)

---

## Start here

| Document | Audience | Purpose |
|----------|----------|---------|
| [Getting Started](./getting-started.md) | Developers | Clone, env setup, run locally, test |
| [Architecture](./architecture.md) | Developers & interviews | System design, data flow, key decisions |
| [Tech Stack](./tech-stack.md) | Developers & interviews | Stack choices with justification |
| [API Overview](./api-overview.md) | Developers | REST routes, auth, envelope format |
| [Deployment](./deployment.md) | DevOps / interviews | Vercel + Render + env vars |
| [Data Models](./data-models.md) | Developers | MongoDB collections and relationships |

---

## Interview preparation (read this for job interviews)

| Document | Purpose |
|----------|---------|
| **[Interview Prep Guide](./interview-prep/README.md)** | Master guide — elevator pitch, walkthrough, trade-offs |
| [Technical Questions](./interview-prep/technical-questions.md) | 25+ technical Q&As in interview format |
| [Behavioral Questions](./interview-prep/behavioral-questions.md) | STAR-format behavioral Q&As |
| [System Design Questions](./interview-prep/system-design.md) | Scale, security, and design scenarios |

---

## Development & product (internal)

| Document | Purpose |
|----------|---------|
| [BUILD.md](./development/BUILD.md) | v2 rebuild guide, modules, coding standards |
| [PLAN.md](./development/PLAN.md) | Product requirements document (PRD) |
| [V2_STATE.md](./development/V2_STATE.md) | Module status and agent handoff log |
| [LEARN.md](./development/LEARN.md) | Original GSSoC contributor guide |

---

## Repository root

| File | Purpose |
|------|---------|
| [README.md](../README.md) | Project overview and quick links |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community guidelines |
| [LICENSE](../LICENSE) | MIT License |

---

## How to use this for interview prep

1. Read **[Interview Prep Guide](./interview-prep/README.md)** end-to-end (30–45 min).
2. Skim **[Architecture](./architecture.md)** and **[Tech Stack](./tech-stack.md)** — you should be able to draw the diagram from memory.
3. Practice aloud from **[Technical](./interview-prep/technical-questions.md)** and **[Behavioral](./interview-prep/behavioral-questions.md)** question banks.
4. Run the app locally (`npm run dev`) and complete one mock interview so you can speak from experience.

**Answer format reminder**

- **Technical:** Direct answer → How PrepEdge implements it → Trade-off → One-line takeaway
- **Behavioral:** STAR — Situation, Task, Action, Result (quantify when possible)
- **System design:** Requirements → High-level diagram → Deep dive on 1–2 components → Bottlenecks & mitigations
