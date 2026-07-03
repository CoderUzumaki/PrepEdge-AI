import { cn } from "@/lib/utils";

/**
 * EmptyState — placeholder when a list or section has no data.
 * @param {Object} props
 * @param {import("react").ReactNode} [props.icon]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
