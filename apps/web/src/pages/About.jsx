import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { title: "Setup", desc: "Upload your resume and configure role, company, and interview type." },
  { title: "Practice", desc: "Answer AI-generated questions via text or voice with speech analysis." },
  { title: "Improve", desc: "Review detailed feedback, scores, and downloadable PDF reports." },
];

const stack = [
  { layer: "Web", tech: "React 19 · Vite · TanStack Query · Tailwind" },
  { layer: "API", tech: "Node.js · Express · Firebase Auth · Zod envelopes" },
  { layer: "Data", tech: "MongoDB Atlas · Mongoose" },
  { layer: "AI", tech: "Groq · Gemini · Hugging Face (fallback chain)" },
  { layer: "Speech", tech: "Groq Whisper v3 Turbo · MediaRecorder" },
];

export default function About() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">About PrepEdge AI</h1>
      <p className="mb-10 leading-relaxed text-[var(--color-muted)]">
        PrepEdge AI is an AI-powered interview preparation platform that helps job seekers
        practice mock interviews tailored to their resume, target role, and company.
        Our multi-provider AI engine delivers fast, reliable feedback to help you improve.
      </p>

      <h2 className="mb-6 text-2xl font-bold">How It Works</h2>
      <div className="mb-12 grid gap-4">
        {steps.map((s, i) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm text-white">
                  {i + 1}
                </span>
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted)]">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold">Architecture</h2>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <pre className="overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 text-xs leading-relaxed text-[var(--color-foreground)]">
{`┌─────────────────────────────────────────────────────────┐
│  Browser (React + Vite)                                  │
│  Home · Dashboard · Interview · Report · Profile         │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS  { data, error } envelope
┌──────────────────────────▼──────────────────────────────┐
│  Express API (Render)                                    │
│  Auth · Interviews · Reports · Speech · Templates · Demo │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
       ▼              ▼              ▼
  MongoDB Atlas   Firebase Auth   AI Providers
  (users,         (JWT verify)    Groq → Gemini → HF
   interviews,
   reports)`}
          </pre>
        </CardContent>
      </Card>

      <h3 className="mb-4 text-lg font-semibold">Tech stack</h3>
      <div className="grid gap-3">
        {stack.map((row) => (
          <div
            key={row.layer}
            className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-medium">{row.layer}</span>
            <span className="text-sm text-[var(--color-muted)]">{row.tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
