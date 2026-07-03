import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEnterDemo } from "@/hooks/useDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleQuestionCard } from "@/components/demo/SampleQuestionCard";
import { DemoPreview } from "@/components/demo/DemoPreview";
import { Mic, BarChart3, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { useState } from "react";

const features = [
  {
    icon: Sparkles,
    title: "AI Question Generation",
    desc: "Questions tailored to your resume, role, and job description.",
  },
  {
    icon: Mic,
    title: "Voice + Speech Analysis",
    desc: "Practice speaking with Groq Whisper transcription and filler-word tracking.",
  },
  {
    icon: BarChart3,
    title: "Score Trends",
    desc: "Track improvement across mock interviews on your dashboard.",
  },
  {
    icon: FileText,
    title: "PDF & Shareable Reports",
    desc: "Download reports or share opt-in links with mentors.",
  },
];

const proofPoints = [
  "Personalized mock interviews in minutes",
  "Real AI scoring — not multiple choice",
  "Built for portfolio & recruiter demos",
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const enterDemo = useEnterDemo();
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleViewDemo = async () => {
    try {
      await enterDemo.mutateAsync();
      navigate("/dashboard");
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Could not load demo"), type: "error" });
    }
  };

  return (
    <div>
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--color-primary)]">
              AI mock interviews for job seekers
            </p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
              Practice interviews. Get scored. Improve fast.
            </h1>
            <p className="mb-8 max-w-xl text-lg text-[var(--color-muted)]">
              PrepEdge AI runs personalized mock interviews with instant feedback, voice analysis,
              and shareable reports — understand the product in under 30 seconds.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to={user ? "/interview/setup" : "/signup"}>
                  {user ? "Start Interview" : "Get Started Free"}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleViewDemo}
                disabled={enterDemo.isPending}
              >
                {enterDemo.isPending ? "Loading demo..." : "View Demo"}
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href="#try-sample">Try sample question</a>
              </Button>
            </div>
            <ul className="space-y-2">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <CheckCircle2 size={16} className="shrink-0 text-[var(--color-primary)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <DemoPreview />
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <SampleQuestionCard />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-3 text-center text-2xl font-bold">Why PrepEdge AI?</h2>
        <p className="mb-10 text-center text-[var(--color-muted)]">
          Everything you need to prepare — from setup to shareable results.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 h-8 w-8 text-[var(--color-primary)]" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted)]">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/about">Learn how it works</Link>
          </Button>
        </div>
      </section>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}
