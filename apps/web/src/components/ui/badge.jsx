import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
        secondary:
          "border-transparent bg-[var(--color-secondary)] text-[var(--color-foreground)]",
        outline: "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)]",
        success:
          "border-transparent bg-emerald-50 text-[var(--color-success)]",
        warning:
          "border-transparent bg-amber-50 text-[var(--color-warning)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

/**
 * Badge — compact status or metadata label.
 */
export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
