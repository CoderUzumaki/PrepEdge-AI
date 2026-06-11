import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, BarChart3, FileText, Sparkles } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Question Generation", desc: "Tailored questions based on your resume, role, and job description." },
  { icon: Mic, title: "Voice Practice", desc: "Practice speaking with real-time confidence analysis." },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track progress with detailed score trends and insights." },
  { icon: FileText, title: "PDF Reports", desc: "Download comprehensive interview reports instantly." },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Ace Your Next Interview with{" "}
          <span className="text-[var(--color-primary)]">AI Coaching</span>
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto mb-8">
          PrepEdge AI generates personalized mock interviews, evaluates your answers in real-time,
          and gives actionable feedback to help you improve.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link to={user ? "/interview/setup" : "/signup"}>
              {user ? "Start Interview" : "Get Started Free"}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Why PrepEdge AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="h-8 w-8 text-[var(--color-primary)] mb-2" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted)]">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
