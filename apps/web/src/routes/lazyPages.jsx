import { lazy, Suspense } from "react";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export function LazyPage({ children }) {
  return (
    <RouteErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-foreground)]" />
          </div>
        }
      >
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}

export const Login = lazy(() => import("@/pages/Login"));
export const SignUp = lazy(() => import("@/pages/SignUp"));
export const Dashboard = lazy(() => import("@/pages/Dashboard"));
export const CreateInterview = lazy(() => import("@/pages/CreateInterview"));
export const TemplateStart = lazy(() => import("@/pages/TemplateStart"));
export const Interview = lazy(() => import("@/pages/Interview"));
export const Report = lazy(() => import("@/pages/Report"));
export const PublicReport = lazy(() => import("@/pages/PublicReport"));
export const Profile = lazy(() => import("@/pages/Profile"));
export const Practice = lazy(() => import("@/pages/Practice"));
export const Resources = lazy(() => import("@/pages/Resources"));
export const About = lazy(() => import("@/pages/About"));
export const Contact = lazy(() => import("@/pages/Contact"));
export const Privacy = lazy(() => import("@/pages/Privacy"));
export const Terms = lazy(() => import("@/pages/Terms"));
export const NotFound = lazy(() => import("@/pages/NotFound"));
