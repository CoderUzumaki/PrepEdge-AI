import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEnterDemo } from "@/hooks/useDemo";
import { PageSeo } from "@/components/seo/PageSeo";
import { DEFAULT_DESCRIPTION, getSiteUrl } from "@/config/site";
import { SampleQuestionCard } from "@/components/demo/SampleQuestionCard";
import { DemoPreview } from "@/components/demo/DemoPreview";
import { Mic, BarChart3, FileText, Sparkles, ArrowRight } from "lucide-react";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { useState } from "react";
import { cn } from "@/lib/utils";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PrepEdge AI",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: DEFAULT_DESCRIPTION,
  url: getSiteUrl(),
};

const features = [
  {
    icon: Sparkles,
    title: "AI question generation",
    desc: "Personalized questions from your resume, role, and job description.",
    span: "md:col-span-2",
  },
  {
    icon: Mic,
    title: "Voice & speech analysis",
    desc: "Groq Whisper transcription with filler-word and WPM tracking.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Score trends",
    desc: "Track improvement across every mock session.",
    span: "",
  },
  {
    icon: FileText,
    title: "PDF & shareable reports",
    desc: "Download reports or share opt-in links with mentors.",
    span: "md:col-span-2",
  },
];

const logos = ["Google", "Meta", "Amazon", "Stripe", "Figma"];

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
    <div className="relative">
      <PageSeo path="/" jsonLd={homeJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="landing-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="landing-glow absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 md:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up mb-6 inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/80 px-3 py-1 text-xs font-medium text-[var(--color-muted)] backdrop-blur-sm">
              Free AI mock interviews for job seekers
            </p>

            <h1
              className="animate-fade-up text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="text-gradient">Practice interviews.</span>
              <br />
              Get scored. Improve fast.
            </h1>

            <p
              className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
              style={{ animationDelay: "0.1s" }}
            >
              Personalized mock interviews with instant AI feedback, voice analysis,
              and shareable reports — try it in under 30 seconds.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "0.15s" }}
            >
              <Link
                to={user ? "/interview/setup" : "/signup"}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition-opacity hover:opacity-90",
                  "bg-[var(--color-cta)] text-[var(--color-cta-foreground)]"
                )}
              >
                {user ? "Start interview" : "Start for free"}
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={handleViewDemo}
                disabled={enterDemo.isPending}
                className={cn(
                  "inline-flex h-11 items-center rounded-full border border-[var(--color-border)] px-6 text-sm font-medium",
                  "bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)]",
                  "disabled:opacity-50"
                )}
              >
                {enterDemo.isPending ? "Loading demo…" : "View demo"}
              </button>
            </div>

            <p
              className="animate-fade-up mt-4 text-xs text-[var(--color-muted)]"
              style={{ animationDelay: "0.2s" }}
            >
              No credit card ·{" "}
              <a href="#try-sample" className="underline underline-offset-2 hover:text-[var(--color-foreground)]">
                try a sample question
              </a>
            </p>
          </div>

          <div
            className="animate-fade-up mx-auto mt-16 max-w-4xl"
            style={{ animationDelay: "0.25s" }}
          >
            <DemoPreview />
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Built for candidates targeting
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {logos.map((name) => (
              <span key={name} className="text-sm font-medium text-[var(--color-muted)]/70">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sample question */}
      <section id="try-sample" className="py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Try it now</h2>
            <p className="mt-2 text-[var(--color-muted)]">One question. Instant AI feedback. No signup.</p>
          </div>
          <SampleQuestionCard />
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="border-t border-[var(--color-border)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need to prepare
            </h2>
            <p className="mt-3 text-[var(--color-muted)]">
              From setup to shareable results — one platform, zero fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, span }) => (
              <div
                key={title}
                className={cn(
                  "group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-colors hover:border-[var(--color-muted)]/40 hover:bg-[var(--color-surface)]",
                  span
                )}
              >
                <div className="mb-4 inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                  <Icon size={18} className="text-[var(--color-foreground)]" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-foreground)] hover:underline underline-offset-4"
            >
              Learn how it works <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[var(--color-border)] py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to ace your next interview?
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Join free and run your first mock interview in minutes.
          </p>
          <Link
            to={user ? "/interview/setup" : "/signup"}
            className={cn(
              "mt-8 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition-opacity hover:opacity-90",
              "bg-[var(--color-cta)] text-[var(--color-cta-foreground)]"
            )}
          >
            {user ? "Start interview" : "Get started"}
            <ArrowRight size={16} />
          </Link>
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
