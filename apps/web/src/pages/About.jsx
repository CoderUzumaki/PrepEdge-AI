import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { title: "Setup", desc: "Upload your resume and configure role, company, and interview type." },
  { title: "Practice", desc: "Answer AI-generated questions via text or voice with confidence tracking." },
  { title: "Improve", desc: "Review detailed feedback, scores, and downloadable PDF reports." },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">About PrepEdge AI</h1>
      <p className="text-[var(--color-muted)] mb-10 leading-relaxed">
        PrepEdge AI is an AI-powered interview preparation platform that helps job seekers
        practice mock interviews tailored to their resume, target role, and company.
        Our multi-provider AI engine delivers fast, reliable feedback to help you improve.
      </p>

      <h2 className="text-2xl font-bold mb-6">How It Works</h2>
      <div className="grid gap-4 mb-10">
        {steps.map((s, i) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm">{i + 1}</span>
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-[var(--color-muted)]">{s.desc}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
