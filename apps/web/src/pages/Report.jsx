import { useParams, Link } from "react-router-dom";
import { useReport } from "@/hooks/useReport";
import { useInterview } from "@/hooks/useInterview";
import { useScoringStatus } from "@/hooks/useInterview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadReportPdf } from "@/utils/pdfDownload";
import { getErrorMessage } from "@/lib/api/errors";
import { Download, RefreshCw } from "lucide-react";

export default function Report() {
  const { interviewId } = useParams();
  const { data: report, isLoading, error, refetch } = useReport(interviewId);
  const { data: interview } = useInterview(interviewId);
  const { data: scoringStatus } = useScoringStatus(interviewId, true);

  const isGenerating = scoringStatus?.summaryStatus === "generating" ||
    scoringStatus?.answers?.some((a) => a.scoringStatus === "pending");

  if (isLoading || isGenerating) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <p className="text-center text-[var(--color-muted)]">
          {isGenerating ? "Generating your report..." : "Loading report..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-destructive)] mb-4">
          {getErrorMessage(error, "Failed to load report. Please try again.")}
        </p>
        <Button onClick={() => refetch()}><RefreshCw size={16} /> Retry</Button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-muted)] mb-4">Report not available yet.</p>
        <Button onClick={() => refetch()}><RefreshCw size={16} /> Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interview Report</h1>
          <p className="text-[var(--color-muted)]">{interview?.interview_name}</p>
        </div>
        {report.finalScore != null && (
          <Badge className="text-lg px-4 py-2">{report.finalScore}%</Badge>
        )}
      </div>

      {report.summary && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Overall Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed">{report.summary}</p></CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {report.strengths && (
          <Card>
            <CardHeader><CardTitle className="text-base text-emerald-700">Strengths</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{report.strengths}</p></CardContent>
          </Card>
        )}
        {report.areaOfImprovement && (
          <Card>
            <CardHeader><CardTitle className="text-base text-amber-700">Areas to Improve</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{report.areaOfImprovement}</p></CardContent>
          </Card>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Question Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(report.answers || []).map((a, i) => (
            <details key={i} className="rounded-lg border border-[var(--color-border)] p-4">
              <summary className="font-medium cursor-pointer flex items-center justify-between">
                <span>Q{i + 1}: {a.question?.slice(0, 80)}{a.question?.length > 80 ? "..." : ""}</span>
                {a.score != null && <Badge variant="secondary">{a.score}%</Badge>}
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                <p><strong>Your answer:</strong> {a.userAnswer}</p>
                {a.feedback && <p><strong>Feedback:</strong> {a.feedback}</p>}
                {a.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {a.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                )}
              </div>
            </details>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => downloadReportPdf(report, interview)}>
          <Download size={16} /> Download PDF
        </Button>
        <Button variant="outline" asChild>
          <Link to="/interview/setup">New Interview</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
