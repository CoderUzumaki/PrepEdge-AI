import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupInterview } from "@/hooks/useInterview";
import { useQuotas } from "@/hooks/useQuotas";
import { useTemplates, useCreateTemplate } from "@/hooks/useTemplates";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuotaBadge } from "@/components/layout/QuotaBadge";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { TemplateCard } from "@/components/layout/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { Upload, ArrowLeft, ArrowRight, BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basics", "Job Details", "Resume & Focus"];
const MODES = [
  { id: "custom", label: "Custom setup" },
  { id: "templates", label: "From template" },
];

export default function CreateInterview() {
  const navigate = useNavigate();
  const setupMutation = useSetupInterview();
  const createTemplateMutation = useCreateTemplate();
  const { data: quotas, isLoading: quotasLoading } = useQuotas();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const [mode, setMode] = useState("custom");
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    interviewName: "",
    numOfQuestions: 5,
    interviewType: "mixed",
    role: "",
    experienceLevel: "fresher",
    companyName: "",
    companyDescription: "",
    jobDescription: "",
    resume: null,
    focusAt: "",
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "resume" && v) fd.append("resume", v);
      else if (k !== "resume") fd.append(k, v);
    });

    try {
      const res = await setupMutation.mutateAsync(fd);
      if (!res?.interviewId) {
        throw new Error("Interview was not created");
      }
      navigate(`/interview/${res.interviewId}`);
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Setup failed"), type: "error" });
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setToast({ show: true, message: "Enter a template name", type: "error" });
      return;
    }
    try {
      await createTemplateMutation.mutateAsync({
        name: templateName.trim(),
        interviewName: form.interviewName,
        numOfQuestions: form.numOfQuestions,
        interviewType: form.interviewType,
        role: form.role,
        experienceLevel: form.experienceLevel,
        companyName: form.companyName,
        companyDescription: form.companyDescription,
        jobDescription: form.jobDescription,
        focusArea: form.focusAt,
      });
      setToast({ show: true, message: "Template saved", type: "success" });
      setShowSaveTemplate(false);
      setTemplateName("");
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Failed to save template"), type: "error" });
    }
  };

  const canNext = () => {
    if (step === 0) return form.interviewName && form.role;
    if (step === 1) return true;
    return true;
  };

  const canSaveTemplate = form.interviewName && form.role;

  const interviewsAtLimit = quotas?.interviews_month?.remaining === 0;
  const resumeAtLimit = quotas?.resume_week?.remaining === 0;
  const resumeSelected = Boolean(form.resume);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Interview Setup"
        description="Configure a custom interview or start from a saved template."
      />

      <div className="mb-6 flex gap-2 rounded-lg border border-[var(--color-border)] p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {quotas && !quotasLoading && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuotaBadge
            label="Mock interviews this month"
            used={quotas.interviews_month.used}
            limit={quotas.interviews_month.limit}
            resetsAt={quotas.interviews_month.resetsAt}
          />
          <QuotaBadge
            label="Resume uploads this week"
            used={quotas.resume_week.used}
            limit={quotas.resume_week.limit}
            resetsAt={quotas.resume_week.resetsAt}
          />
        </div>
      )}

      {interviewsAtLimit && (
        <p className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-warning)]">
          You&apos;ve used all mock interviews for this month. Your quota resets on the 1st (UTC).
        </p>
      )}

      {mode === "templates" ? (
        <Card>
          <CardHeader>
            <CardTitle>Choose a template</CardTitle>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {templates?.system?.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {templates.system.map((template) => (
                      <TemplateCard key={template._id} template={template} isSystem />
                    ))}
                  </div>
                )}
                {templates?.user?.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm text-[var(--color-muted)]">Your templates</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {templates.user.map((template) => (
                        <TemplateCard key={template._id} template={template} />
                      ))}
                    </div>
                  </div>
                )}
                {!templates?.system?.length && !templates?.user?.length && (
                  <p className="text-center text-sm text-[var(--color-muted)] py-8">
                    No templates available yet.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <StepIndicator steps={STEPS} currentStep={step} className="mb-8" />

          <Card>
            <CardHeader><CardTitle>{STEPS[step]}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Interview Name</Label>
                    <Input value={form.interviewName} onChange={(e) => set("interviewName", e.target.value)} placeholder="Google SWE Mock" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Software Engineer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                        {["fresher", "junior", "mid", "senior"].map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Questions</Label>
                      <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.numOfQuestions} onChange={(e) => set("numOfQuestions", Number(e.target.value))}>
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Interview Type</Label>
                    <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.interviewType} onChange={(e) => set("interviewType", e.target.value)}>
                      {["technical", "behavioral", "mixed"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Description</Label>
                    <Textarea value={form.companyDescription} onChange={(e) => set("companyDescription", e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea value={form.jobDescription} onChange={(e) => set("jobDescription", e.target.value)} rows={5} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${drag ? "border-[var(--color-primary)] bg-indigo-50" : "border-[var(--color-border)]"}`}
                    onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      const file = e.dataTransfer.files[0];
                      if (file?.type === "application/pdf") set("resume", file);
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-[var(--color-muted)] mb-2" />
                    {form.resume ? (
                      <p className="text-sm font-medium">{form.resume.name}</p>
                    ) : (
                      <p className="text-sm text-[var(--color-muted)]">Drop PDF resume or click to upload (optional)</p>
                    )}
                    {resumeAtLimit && !form.resume && (
                      <p className="mt-2 text-xs text-[var(--color-warning)]">
                        Weekly resume upload limit reached. Continue without a resume or wait until Monday (UTC).
                      </p>
                    )}
                    <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && set("resume", e.target.files[0])} />
                  </div>
                  <div className="space-y-2">
                    <Label>Focus Areas</Label>
                    <Input value={form.focusAt} onChange={(e) => set("focusAt", e.target.value)} placeholder="System Design, DSA, React..." />
                  </div>

                  {canSaveTemplate && (
                    <div className="rounded-lg border border-[var(--color-border)] p-4">
                      {!showSaveTemplate ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSaveTemplate(true)}
                        >
                          <BookmarkPlus size={16} className="mr-2" />
                          Save as template
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Label htmlFor="template-name">Template name</Label>
                          <Input
                            id="template-name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="My React interview"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleSaveTemplate}
                              disabled={createTemplateMutation.isPending}
                            >
                              {createTemplateMutation.isPending ? "Saving..." : "Save template"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowSaveTemplate(false);
                                setTemplateName("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                  <ArrowLeft size={16} /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                    Next <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={setupMutation.isPending || interviewsAtLimit || (resumeSelected && resumeAtLimit)}
                  >
                    {setupMutation.isPending ? "Setting up..." : "Start Interview"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
