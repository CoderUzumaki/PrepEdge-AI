# LEARN.md – PrepEdge AI

Welcome to the **PrepEdge AI** project!  
If you're new here or looking to contribute meaningfully, this guide will help you **understand the project**, **explore its tech stack**, and **get started with contributions** quickly and confidently.

---

## What is PrepEdge AI?

**PrepEdge AI** is a smart, full-stack interview preparation platform designed to:
- Automatically generate personalized mock interview questions.
- Evaluate candidate answers using AI.
- Provide detailed PDF-based reports for performance review.

It empowers job seekers to **prepare better**, **track progress**, and **improve faster**.

---

## Live Demo

🔗 [prepedgeai.vercel.app](https://prepedgeai.vercel.app)

---

## Core Features

| Feature               | Description                                           |
|----------------------|-------------------------------------------------------|
| Firebase Auth      | Secure login/signup                                   |
| AI Evaluation      | Answer assessment with Groq, Gemini, and Hugging Face |
| PDF Reports        | Auto-generated interview feedback reports             |
| Role-Based Qs      | Dynamic question generation by domain                 |
| Resources Page     | Helpful materials for candidates                      |

---

## Tech Stack

### Frontend (`apps/web`)
- **React + Vite** – Component-based SPA with fast bundling
- **TailwindCSS** – Utility-first CSS for responsive design
- **Firebase Auth** – User authentication and session handling

### Backend (`apps/api`)
- **Express.js** – REST API handling and routes
- **MongoDB Atlas** – Cloud-hosted database for storing responses
- **Firebase Admin SDK** – Securely verifies user identity
- **Multer** – Handles file uploads (e.g., user resumes)
- **Groq / Gemini / Hugging Face** – Multi-provider AI with automatic fallback

### Shared (`packages/shared`)
- **Zod schemas** – Shared request validation for API and web

---

## Folder Structure

```
PrepEdge-AI/
├── apps/
│   ├── api/                 # Backend (Express API)
│   │   ├── config/          # Env, DB, Firebase
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── models/          # Mongoose models
│   │   ├── providers/       # AI provider integrations
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── tests/           # Vitest tests
│   │   └── index.js         # API entry point
│   └── web/                 # Frontend (React + Vite)
│       ├── public/
│       └── src/
│           ├── components/  # Reusable UI components
│           ├── pages/       # Route-based pages
│           ├── hooks/       # Data-fetching hooks
│           ├── lib/         # API client, Firebase
│           └── utils/       # Helper functions
├── packages/
│   └── shared/              # Shared Zod schemas & constants
├── docs/                       # Project documentation (see docs/README.md)
│   ├── interview-prep/         # Interview Q&A study guide
│   └── development/            # BUILD, PLAN, V2_STATE, LEARN
```

---

## How to Contribute

1. **Fork the repository**
```bash
git clone https://github.com/YOUR_USERNAME/PrepEdge-AI.git
cd PrepEdge-AI
```

2. Install dependencies from the repo root:
```bash
npm install
```

3. Create `apps/api/.env` with:
```bash
PORT=5000
MONGO_URI=
FIREBASE_SERVICE_ACCOUNT=
GROQ_API_KEY=
GEMINI_API_KEY=
HUGGING_FACE_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
EMAIL_RECEIVER=
ALLOWED_ORIGINS=http://localhost:5173
```

4. Create `apps/web/.env` with:
```bash
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_API_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

4. Run the project from the repo root:
```bash
# Frontend + backend together
npm run dev

# Or run individually
npm run dev:api
npm run dev:web
```

5. Run tests:
```bash
npm test
```

## Contribution Tips

1. Pick an issue, or create your own

2. Ask questions in the Discussions tab or Discord

3. Wait for Project Admin or Mentor to assign the issue to you

4. Make small, meaningful PRs

5. Use clear commit messages (fix:, feat:, docs:)


## Code of Conduct
Before contributing, please read and follow our [Code of Conduct](../../CODE_OF_CONDUCT.md). We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone in the GSSoC community.


## Maintainers
  [Abhinav Mishra](https://github.com/CoderUzumaki) – Project Admin   

## Inspiration

PrepEdge AI was born to solve the real struggle of candidates preparing for interviews who need personalized practice, feedback, and confidence – powered by AI.

*Ready to make an impact? Start contributing today*
