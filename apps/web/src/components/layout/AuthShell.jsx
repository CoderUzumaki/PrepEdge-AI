import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * AuthShell — centered SaaS-style layout for Login and SignUp pages.
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.className]
 */
export function AuthShell({ children, className }) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[var(--color-surface)] px-4 py-12">
      <div className={cn("w-full max-w-md space-y-6", className)}>
        <div className="text-center">
          <Link
            to="/"
            className="inline-block text-xl font-semibold tracking-tight text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
          >
            PrepEdge AI
          </Link>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            AI-powered mock interview practice
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
