import { useEffect, useState } from "react";
import { Mic, BarChart3, FileText } from "lucide-react";

const STEPS = [
  { icon: Mic, label: "Answer by voice or text" },
  { icon: BarChart3, label: "Get instant AI scoring" },
  { icon: FileText, label: "Download shareable report" },
];

/**
 * DemoPreview — Vercel-style product frame for the landing hero.
 */
export function DemoPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const Current = STEPS[step].icon;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-md)]"
      aria-label="Product demo preview"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[var(--color-muted)]">prepedge.ai — mock interview</span>
      </div>

      <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 bg-[var(--color-surface)]/50 p-10 sm:min-h-[320px]">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-sm)] transition-all duration-500">
          <Current size={36} className="text-[var(--color-foreground)]" />
        </div>
        <p className="text-center text-sm font-medium text-[var(--color-foreground)]">
          {STEPS[step].label}
        </p>
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 6,
                backgroundColor:
                  i === step ? "var(--color-foreground)" : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
