import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layers, Trash2 } from "lucide-react";

/**
 * TemplateCard — pre-made or user template picker card.
 * @param {Object} props
 * @param {Object} props.template
 * @param {boolean} [props.isSystem]
 * @param {function(): void} [props.onDelete]
 * @param {string} [props.className]
 */
export function TemplateCard({ template, isSystem = false, onDelete, className }) {
  const templateId = template._id;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-shadow hover:shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <h3 className="text-sm font-semibold leading-snug text-[var(--color-foreground)]">
            {template.name}
          </h3>
        </div>
        {isSystem ? (
          <Badge variant="secondary">Pre-made</Badge>
        ) : (
          onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label={`Delete template ${template.name}`}
              onClick={onDelete}
            >
              <Trash2 size={14} />
            </Button>
          )
        )}
      </div>

      <dl className="mb-4 space-y-1 text-xs text-[var(--color-muted)]">
        <div className="flex justify-between gap-2">
          <dt>Role</dt>
          <dd className="text-right text-[var(--color-foreground)]">{template.role}</dd>
        </div>
        <div className="flex justify-between gap-2 capitalize">
          <dt>Level</dt>
          <dd className="text-right text-[var(--color-foreground)]">{template.experience_level}</dd>
        </div>
        <div className="flex justify-between gap-2 capitalize">
          <dt>Type</dt>
          <dd className="text-right text-[var(--color-foreground)]">{template.interview_type}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Questions</dt>
          <dd className="text-right text-[var(--color-foreground)]">{template.num_of_questions}</dd>
        </div>
        {template.focus_area && (
          <div className="pt-1">
            <dt className="mb-0.5">Focus</dt>
            <dd className="text-[var(--color-foreground)]">{template.focus_area}</dd>
          </div>
        )}
      </dl>

      <Button asChild size="sm" className="mt-auto w-full">
        <Link to={`/interview/template/${templateId}`}>Start interview</Link>
      </Button>
    </div>
  );
}
