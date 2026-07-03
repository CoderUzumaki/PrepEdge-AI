import { cn } from "@/lib/utils";

/**
 * ScoreRing — circular score display for reports.
 * @param {Object} props
 * @param {number|null} props.score - 0–100
 * @param {number} [props.size=120]
 * @param {string} [props.className]
 */
export function ScoreRing({ score, size = 120, className }) {
  const value = score ?? 0;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 80 ? "var(--color-success, #16a34a)" :
    value >= 60 ? "var(--color-primary)" :
    value >= 40 ? "var(--color-warning, #d97706)" :
    "var(--color-destructive)";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={score != null ? `Score ${score} percent` : "Score not available"}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none">{score != null ? score : "—"}</span>
        {score != null && <span className="text-xs text-[var(--color-muted)]">%</span>}
      </div>
    </div>
  );
}
