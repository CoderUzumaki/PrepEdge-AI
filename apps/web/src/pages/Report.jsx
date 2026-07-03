import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useReport,
  useEnableReportShare,
  useDisableReportShare,
} from "@/hooks/useReport";
import { useInterview, useScoringStatus } from "@/hooks/useInterview";
import { ReportContent } from "@/components/report/ReportContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Toast from "@/components/Toast";
import { downloadReportPdf } from "@/utils/pdfDownload";
import { getErrorMessage } from "@/lib/api/errors";
import { Download, RefreshCw, Link2, Link2Off, Copy } from "lucide-react";

export default function Report() {
  const { interviewId } = useParams();
  const { data: report, isLoading, error, refetch } = useReport(interviewId);
  const { data: interview } = useInterview(interviewId);
  const { data: scoringStatus } = useScoringStatus(interviewId, true);
  const enableShare = useEnableReportShare(interviewId);
  const disableShare = useDisableReportShare(interviewId);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const isGenerating =
    scoringStatus?.summaryStatus === "generating" ||
    scoringStatus?.answers?.some((a) => a.scoringStatus === "pending");

  const shareActive =
    report?.shareToken &&
    report?.shareExpiresAt &&
    new Date(report.shareExpiresAt) > new Date();

  const shareUrl = shareActive
    ? `${window.location.origin}/report/public/${report.shareToken}`
    : null;

  const handleEnableShare = async () => {
    try {
      await enableShare.mutateAsync();
      setToast({ show: true, message: "Share link created", type: "success" });
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Failed to create share link"), type: "error" });
    }
  };

  const handleDisableShare = async () => {
    try {
      await disableShare.mutateAsync();
      setToast({ show: true, message: "Share link revoked", type: "success" });
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Failed to revoke share link"), type: "error" });
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast({ show: true, message: "Link copied to clipboard", type: "success" });
    } catch {
      setToast({ show: true, message: "Could not copy link", type: "error" });
    }
  };

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
      <ReportContent report={report} interviewName={interview?.interview_name} />

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Share report</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--color-muted)]">
            Create an opt-in public link (expires in 7 days). Anyone with the link can view this report without signing in.
          </p>
          {shareActive ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex h-10 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
                />
                <Button type="button" variant="outline" onClick={handleCopyLink}>
                  <Copy size={16} /> Copy
                </Button>
              </div>
              {report.shareExpiresAt && (
                <p className="text-xs text-[var(--color-muted)]">
                  Expires {new Date(report.shareExpiresAt).toLocaleString()}
                </p>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDisableShare}
                disabled={disableShare.isPending}
              >
                <Link2Off size={16} /> Revoke link
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleEnableShare}
              disabled={enableShare.isPending}
            >
              <Link2 size={16} /> Create share link
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
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

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}
