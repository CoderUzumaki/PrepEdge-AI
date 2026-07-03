import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

/**
 * DemoBanner — prompts logged-out visitors to try the recruiter demo path.
 */
export function DemoBanner({ onViewDemo, loading = false }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-2 sm:flex-row">
        <p className="text-center text-sm text-[var(--color-muted)] sm:text-left">
          Recruiter? Try a sample question or explore a pre-seeded demo dashboard — no signup required.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/#try-sample">Try sample</Link>
          </Button>
          <Button size="sm" onClick={onViewDemo} disabled={loading}>
            <Play size={14} className="mr-1" />
            {loading ? "Loading..." : "View Demo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
