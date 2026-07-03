import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * QuotaBadge — displays usage against a free-tier cap (e.g. "2/3 interviews this month").
 * @param {Object} props
 * @param {string} props.label - Human-readable resource name
 * @param {number} props.used
 * @param {number} props.limit
 * @param {string} [props.resetsAt] - ISO timestamp when the period resets
 * @param {string} [props.className]
 */
export function QuotaBadge({ label, used, limit, resetsAt, className }) {
  const atLimit = used >= limit;
  const ratio = limit > 0 ? used / limit : 0;

  let variant = "secondary";
  if (atLimit) variant = "warning";
  else if (ratio >= 0.67) variant = "outline";

  const resetLabel = resetsAt
    ? `Resets ${new Date(resetsAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })} (UTC)`
    : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[var(--color-foreground)]">{label}</span>
        <Badge variant={variant} aria-label={`${used} of ${limit} used`}>
          {used}/{limit}
        </Badge>
      </div>
      {resetLabel && (
        <p className="text-xs text-[var(--color-muted)]">{resetLabel}</p>
      )}
      {atLimit && (
        <p className="text-xs text-[var(--color-warning)]">Limit reached</p>
      )}
    </div>
  );
}
