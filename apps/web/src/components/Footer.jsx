import { Link } from "react-router-dom";

const footerLinkClass =
  "rounded-sm text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

/**
 * Footer — site links and legal information.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">
              PrepEdge AI
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              AI-powered mock interviews to help you land your dream job.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Quick Links</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/about" className={footerLinkClass}>
                About
              </Link>
              <Link to="/resources" className={footerLinkClass}>
                Resources
              </Link>
              <Link to="/contact" className={footerLinkClass}>
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Legal</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/privacy" className={footerLinkClass}>
                Privacy Policy
              </Link>
              <Link to="/terms" className={footerLinkClass}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} PrepEdge AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
