import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSubmitSampleAnswer } from "@/hooks/useDemo";
import api from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreRing } from "@/components/interview/ScoreRing";
import { getErrorMessage } from "@/lib/api/errors";
import { Link } from "react-router-dom";

/**
 * SampleQuestionCard — public try-before-signup flow on the landing page.
 */
export function SampleQuestionCard() {
  const { data: sample, isLoading } = useQuery({
    queryKey: ["sample-question"],
    queryFn: async () => (await api.get("/api/demo/sample-question")).data,
  });
  const submitMutation = useSubmitSampleAnswer();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await submitMutation.mutateAsync(answer);
      setResult(res);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to score answer"));
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Card id="try-sample" className="rounded-2xl border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <CardHeader>
        <CardTitle className="text-lg">Try a sample question</CardTitle>
        <p className="text-sm text-[var(--color-muted)]">
          No signup required — answer one behavioral question and get instant AI feedback.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <Badge variant="secondary" className="mb-2 capitalize">{sample?.interviewType}</Badge>
          <p className="text-sm font-medium leading-relaxed">{sample?.question}</p>
        </div>

        {!result ? (
          <>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here (use STAR format)..."
              rows={5}
            />
            {error && <p className="text-sm text-[var(--color-destructive)]">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || answer.trim().length < 10}
            >
              {submitMutation.isPending ? "Scoring..." : "Get feedback"}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <ScoreRing score={result.score} size={100} />
            <div className="flex-1 space-y-2">
              <p className="text-sm leading-relaxed">{result.feedback}</p>
              {result.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.tags.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => { setResult(null); setAnswer(""); }}>
                  Try again
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign up for full interviews</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
