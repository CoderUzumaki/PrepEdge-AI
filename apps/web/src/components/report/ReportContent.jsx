import { ScoreRing } from "@/components/interview/ScoreRing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { computeSpeechSummary } from "@prepedge/shared";
import { Mic } from "lucide-react";

/**
 * ReportContent — shared report layout for owner and public views.
 * @param {Object} props
 * @param {Object} props.report
 * @param {string} [props.interviewName]
 */
export function ReportContent({ report, interviewName }) {
  const speech = computeSpeechSummary(report.answers);

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">Interview Report</h1>
          <p className="text-[var(--color-muted)]">{interviewName}</p>
        </div>
        <ScoreRing score={report.finalScore} />
      </div>

      {report.summary && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Overall Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed">{report.summary}</p></CardContent>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {report.strengths && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-emerald-700">Strengths</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm">{report.strengths}</p></CardContent>
          </Card>
        )}
        {report.areaOfImprovement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-amber-700">Areas to Improve</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm">{report.areaOfImprovement}</p></CardContent>
          </Card>
        )}
      </div>

      {speech && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Mic size={18} className="text-[var(--color-primary)]" />
            <CardTitle>Speech Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] p-4 text-center">
                <p className="text-2xl font-bold">{speech.avgWpm}</p>
                <p className="text-xs text-[var(--color-muted)]">Avg words/min</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-4 text-center">
                <p className="text-2xl font-bold">{speech.totalFillers}</p>
                <p className="text-xs text-[var(--color-muted)]">Filler words</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-4 text-center">
                <p className="text-2xl font-bold">{speech.questionsWithSpeech}</p>
                <p className="text-xs text-[var(--color-muted)]">Voice answers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader><CardTitle>Question Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(report.answers || []).map((a, i) => (
            <details key={i} className="rounded-lg border border-[var(--color-border)] p-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium">
                <span>
                  Q{i + 1}: {a.question?.slice(0, 80)}{a.question?.length > 80 ? "..." : ""}
                </span>
                {a.score != null && <Badge variant="secondary">{a.score}%</Badge>}
              </summary>
              <div className="mt-3 space-y-3 text-sm">
                <p><strong>Your answer:</strong> {a.userAnswer}</p>
                {a.preferredAnswer && (
                  <p className="text-[var(--color-muted)]">
                    <strong className="text-[var(--color-foreground)]">Model answer:</strong> {a.preferredAnswer}
                  </p>
                )}
                {a.feedback && <p><strong>Feedback:</strong> {a.feedback}</p>}
                {a.speechMetrics?.wordCount > 0 && (
                  <p className="text-[var(--color-muted)]">
                    Speech: {a.speechMetrics.wordsPerMinute} WPM · {a.speechMetrics.fillerCount} fillers ·{" "}
                    {a.speechMetrics.wordCount} words
                    {a.speechMetrics.fillerWords?.length > 0 && (
                      <> ({a.speechMetrics.fillerWords.join(", ")})</>
                    )}
                  </p>
                )}
                {a.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {a.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                )}
              </div>
            </details>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
