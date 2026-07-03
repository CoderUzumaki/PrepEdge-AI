import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-md px-1 py-0.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

/**
 * Header — site navigation with auth-aware links and mobile menu.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", auth: true },
    { to: "/interview/setup", label: "New Interview", auth: true },
    { to: "/practice", label: "Practice", auth: true },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          to="/"
          className="rounded-md text-lg font-semibold tracking-tight text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
        >
          PrepEdge AI
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks
            .filter((l) => !l.auth || user)
            .map((link) => (
              <Link key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <User size={16} aria-hidden="true" />
                Account
              </Button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-[var(--shadow-sm)]"
                  role="menu"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:bg-[var(--color-surface)]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:bg-[var(--color-surface)]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:bg-[var(--color-surface)]"
                  >
                    <LogOut size={14} aria-hidden="true" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "rounded-md p-2 text-[var(--color-foreground)] md:hidden",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
          <nav className="space-y-1" aria-label="Mobile">
            {navLinks
              .filter((l) => !l.auth || user)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block rounded-md px-2 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block rounded-md px-2 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-md px-2 py-2 text-left text-sm text-[var(--color-destructive)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block rounded-md px-2 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block rounded-md px-2 py-2 text-sm font-medium text-[var(--color-primary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
