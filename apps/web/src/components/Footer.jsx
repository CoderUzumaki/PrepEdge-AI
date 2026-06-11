import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-2">PrepEdge AI</h3>
            <p className="text-sm text-[var(--color-muted)]">
              AI-powered mock interviews to help you land your dream job.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <div className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              <Link to="/about" className="hover:text-[var(--color-foreground)]">About</Link>
              <Link to="/resources" className="hover:text-[var(--color-foreground)]">Resources</Link>
              <Link to="/contact" className="hover:text-[var(--color-foreground)]">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <div className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              <Link to="/privacy" className="hover:text-[var(--color-foreground)]">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[var(--color-foreground)]">Terms of Service</Link>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-[var(--color-muted)] mt-8">
          © {new Date().getFullYear()} PrepEdge AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
