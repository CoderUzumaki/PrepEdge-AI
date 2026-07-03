import { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary (M9).
 */
export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-[var(--color-muted)]">
            An unexpected error occurred. Try refreshing the page or return home.
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => window.location.reload()}>Refresh</Button>
            <Button variant="outline" asChild>
              <Link to="/">Go home</Link>
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
