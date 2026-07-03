import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StepIndicator — horizontal progress for multi-step flows (e.g. interview setup wizard).
 * @param {Object} props
 * @param {string[]} props.steps - Step labels in order
 * @param {number} props.currentStep - Zero-based index of the active step
 * @param {string} [props.className]
 */
export function StepIndicator({ steps, currentStep, className }) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center gap-2">
        {steps.map((label, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                    isComplete &&
                      "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
                    isCurrent &&
                      "border-[var(--color-primary)] bg-[var(--color-card)] text-[var(--color-primary)]",
                    isUpcoming &&
                      "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? <Check size={16} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden truncate text-sm font-medium sm:block",
                    isCurrent
                      ? "text-[var(--color-foreground)]"
                      : "text-[var(--color-muted)]"
                  )}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    index < currentStep
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-border)]"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm font-medium text-[var(--color-foreground)] sm:hidden">
        {steps[currentStep]}
      </p>
    </nav>
  );
}
