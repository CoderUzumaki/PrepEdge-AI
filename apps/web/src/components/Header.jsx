import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEnterDemo } from "@/hooks/useDemo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api/errors";
import Toast from "@/components/Toast";

const publicNav = [
  { to: "/#features", label: "Features", hash: true },
  { to: "/#try-sample", label: "Try it", hash: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const appNav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/interview/setup", label: "Interviews" },
  { to: "/practice", label: "Practice" },
];

/**
 * Animated nav link — underline grows on hover and stays visible when active.
 */
function NavLinkItem({ to, label, hash, active, onClick, className }) {
  const classes = cn(
    "group relative inline-flex items-center rounded-full px-3 py-1.5 text-sm no-underline transition-colors",
    active
      ? "text-[var(--color-foreground)]"
      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]",
    className
  );

  const indicator = (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3 bottom-0.5 h-px rounded-full bg-[var(--color-foreground)]",
        "origin-center transition-transform duration-200 ease-out",
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      )}
    />
  );

  if (hash) {
    return (
      <a href={to} className={classes} onClick={onClick}>
        {label}
        {indicator}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {label}
      {indicator}
    </Link>
  );
}

/**
 * PrepEdge logo mark — minimal triangle inspired by geometric SaaS marks.
 */
function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2L2 19.5h20L12 2zm0 4.2L17.4 17.5H6.6L12 6.2z"
      />
    </svg>
  );
}

/**
 * Header — Vercel-inspired navbar with frosted glass, centered links, and theme toggle.
 */
export default function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const enterDemo = useEnterDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [activeSection, setActiveSection] = useState("");
  const accountRef = useRef(null);

  const isHome = location.pathname === "/";
  const navItems = user ? appNav : publicNav;

  const isNavActive = (link) => {
    if (link.hash) {
      if (location.pathname !== "/") return false;
      const sectionId = link.to.split("#")[1];
      if (location.hash) return location.hash === `#${sectionId}`;
      return activeSection === sectionId;
    }
    if (link.to === "/interview/setup") return location.pathname.startsWith("/interview");
    return location.pathname === link.to;
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["features", "try-sample"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleViewDemo = async () => {
    try {
      await enterDemo.mutateAsync();
      navigate("/dashboard");
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Could not load demo"), type: "error" });
    }
  };

  return (
    <>
      {profile?.is_demo && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
          Read-only demo account.{" "}
          <Link to="/signup" className="font-medium underline underline-offset-2">
            Create your free account
          </Link>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[border-color,background-color,box-shadow] duration-200",
          scrolled || !isHome
            ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/80 shadow-[var(--shadow-sm)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-md text-[var(--color-foreground)] no-underline transition-opacity hover:opacity-80"
          >
            <LogoMark className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-tight">PrepEdge</span>
          </Link>

          {/* Center nav — desktop */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex"
            aria-label="Main"
          >
            {navItems.map((link) => (
              <NavLinkItem
                key={link.to}
                to={link.to}
                label={link.label}
                hash={link.hash}
                active={isNavActive(link)}
              />
            ))}
          </nav>

          {/* Right actions — desktop */}
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
            {user ? (
              <div className="relative ml-1" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm",
                    "text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                  )}
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                >
                  <span className="max-w-[120px] truncate">
                    {profile?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={14} className="text-[var(--color-muted)]" />
                </button>
                {accountOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-[var(--shadow-md)]"
                    role="menu"
                  >
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="block px-4 py-2 text-sm hover:bg-[var(--color-surface)]"
                      onClick={() => setAccountOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="block px-4 py-2 text-sm hover:bg-[var(--color-surface)]"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-surface)]"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleViewDemo}
                  disabled={enterDemo.isPending}
                  className={cn(
                    "hidden rounded-full px-3 py-1.5 text-sm text-[var(--color-muted)] sm:inline-flex",
                    "hover:text-[var(--color-foreground)] transition-colors",
                    "disabled:opacity-50"
                  )}
                >
                  {enterDemo.isPending ? "Loading…" : "Demo"}
                </button>
                <Link
                  to="/login"
                  className="rounded-full px-3 py-1.5 text-sm text-[var(--color-foreground)] no-underline hover:bg-[var(--color-surface)] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    "ml-1 inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-opacity",
                    "bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:opacity-90"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-background)]/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navItems.map((link) => (
                <NavLinkItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  hash={link.hash}
                  active={isNavActive(link)}
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg px-3 py-2.5 hover:bg-[var(--color-surface)]"
                />
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
              {user ? (
                <>
                  <Link to="/profile" className="rounded-lg px-3 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-destructive)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full rounded-full" onClick={handleViewDemo} disabled={enterDemo.isPending}>
                    View Demo
                  </Button>
                  <Button variant="outline" className="w-full rounded-full" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Link
                    to="/signup"
                    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[var(--color-cta)] text-sm font-medium text-[var(--color-cta-foreground)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
