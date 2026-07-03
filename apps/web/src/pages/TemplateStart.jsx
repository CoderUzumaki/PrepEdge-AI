import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTemplate, useStartFromTemplate } from "@/hooks/useTemplates";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { Upload } from "lucide-react";

/**
 * TemplateStart — optional resume upload then one-click interview from a template.
 */
export default function TemplateStart() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { data: template, isLoading, error } = useTemplate(templateId);
  const startMutation = useStartFromTemplate(templateId);
  const fileRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleStart = async () => {
    try {
      const fd = new FormData();
      if (resume) fd.append("resume", resume);
      const res = await startMutation.mutateAsync(fd);
      if (!res?.interviewId) throw new Error("Interview was not created");
      navigate(`/interview/${res.interviewId}`);
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Failed to start interview"), type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-destructive)] mb-4">
          {getErrorMessage(error, "Template not found")}
        </p>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <PageHeader
        title={template.name}
        description="Optional: upload a resume for this session. Then start your mock interview."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Template details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">{template.interview_type}</Badge>
          <Badge variant="outline" className="capitalize">{template.experience_level}</Badge>
          <Badge variant="outline">{template.num_of_questions} questions</Badge>
          <Badge variant="outline">{template.role}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resume (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-[var(--color-border)] p-8 text-center transition-colors hover:border-[var(--color-primary)]"
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-[var(--color-muted)]" />
            {resume ? (
              <p className="text-sm font-medium">{resume.name}</p>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">Drop PDF resume or click to upload</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files[0] && setResume(e.target.files[0])}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/dashboard">Cancel</Link>
            </Button>
            <Button className="flex-1" onClick={handleStart} disabled={startMutation.isPending}>
              {startMutation.isPending ? "Starting..." : "Start interview"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}
