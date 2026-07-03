import { useParams } from "react-router-dom";
import { usePublicReport } from "@/hooks/useReport";
import { ReportContent } from "@/components/report/ReportContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { downloadReportPdf } from "@/utils/pdfDownload";
import { Download } from "lucide-react";

/**
 * PublicReport — unauthenticated view of an opt-in shared report.
 */
export default function PublicReport() {
  const { token } = useParams();
  const { data: report, isLoading, error } = usePublicReport(token);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Report unavailable</h1>
        <p className="text-[var(--color-muted)]">
          {getErrorMessage(error, "This share link is invalid or has expired.")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <p className="mb-6 text-center text-xs text-[var(--color-muted)]">
        Shared via PrepEdge AI
        {report.shareExpiresAt && (
          <> · Expires {new Date(report.shareExpiresAt).toLocaleDateString()}</>
        )}
      </p>

      <ReportContent report={report} interviewName={report.interviewName} />

      <div className="mt-6 flex justify-center">
        <Button onClick={() => downloadReportPdf(report)}>
          <Download size={16} /> Download PDF
        </Button>
      </div>
    </div>
  );
}
