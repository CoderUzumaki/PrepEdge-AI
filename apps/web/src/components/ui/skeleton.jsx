import { cn } from "@/lib/utils";

/**
 * Skeleton — loading placeholder with pulse animation.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-secondary)]",
        className
      )}
      {...props}
    />
  );
}
