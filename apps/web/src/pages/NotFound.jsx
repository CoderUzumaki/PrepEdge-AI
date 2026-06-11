import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
      <p className="text-xl text-[var(--color-muted)] mb-8">Page not found</p>
      <Button asChild>
        <Link to="/"><Home size={16} /> Return to Home</Link>
      </Button>
    </div>
  );
}
