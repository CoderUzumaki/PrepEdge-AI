import { Link } from "react-router-dom";

const footerLinkClass =
  "text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";

/**
 * Footer — minimal Vercel-style site footer.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold tracking-tight">PrepEdge</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              AI mock interviews with instant feedback.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">Product</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/#features" className={footerLinkClass}>Features</Link>
              <Link to="/#try-sample" className={footerLinkClass}>Try sample</Link>
              <Link to="/about" className={footerLinkClass}>About</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">Resources</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/resources" className={footerLinkClass}>Resources</Link>
              <Link to="/contact" className={footerLinkClass}>Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">Legal</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/privacy" className={footerLinkClass}>Privacy</Link>
              <Link to="/terms" className={footerLinkClass}>Terms</Link>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} PrepEdge AI
        </p>
      </div>
    </footer>
  );
}
