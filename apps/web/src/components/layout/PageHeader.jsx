import { cn } from "@/lib/utils";

/**
 * PageHeader — consistent page title, description, and optional action slot.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function PageHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {title}
        </h1>
        {description && (
          <p className="text-base leading-relaxed text-[var(--color-muted)]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
