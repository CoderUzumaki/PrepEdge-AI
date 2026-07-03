import { cn } from "@/lib/utils";

/**
 * Textarea — multi-line text field with visible focus ring.
 */
export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
