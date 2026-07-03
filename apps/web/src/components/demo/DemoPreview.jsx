import { useEffect, useState } from "react";
import { Mic, BarChart3, FileText } from "lucide-react";

const STEPS = [
  { icon: Mic, label: "Answer by voice or text", color: "var(--color-primary)" },
  { icon: BarChart3, label: "Get instant AI scoring", color: "#16a34a" },
  { icon: FileText, label: "Download shareable report", color: "#d97706" },
];

/**
 * DemoPreview — animated product walkthrough embed for the landing page.
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
      className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-sm)]"
      aria-label="Product demo preview"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-[var(--color-muted)]">PrepEdge AI — Mock Interview</span>
      </div>

      <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 transition-all duration-500">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-500"
          style={{ backgroundColor: `${STEPS[step].color}20` }}
        >
          <Current size={32} style={{ color: STEPS[step].color }} />
        </div>
        <p className="text-center text-sm font-medium text-[var(--color-foreground)]">
          {STEPS[step].label}
        </p>
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 6,
                backgroundColor: i === step ? "var(--color-primary)" : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
