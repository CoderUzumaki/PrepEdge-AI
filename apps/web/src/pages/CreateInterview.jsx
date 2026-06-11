import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupInterview } from "@/hooks/useInterview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Toast from "@/components/Toast";
import { Upload, ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = ["Basics", "Job Details", "Resume & Focus"];

export default function CreateInterview() {
  const navigate = useNavigate();
  const setupMutation = useSetupInterview();
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
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
      setToast({ show: true, message: err.response?.data?.error || "Setup failed", type: "error" });
    }
  };

  const canNext = () => {
    if (step === 0) return form.interviewName && form.role;
    if (step === 1) return true;
    return true;
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Interview Setup</h1>
      <p className="text-[var(--color-muted)] mb-6">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      <div className="w-full bg-[var(--color-secondary)] rounded-full h-2 mb-8">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

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
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && set("resume", e.target.files[0])} />
              </div>
              <div className="space-y-2">
                <Label>Focus Areas</Label>
                <Input value={form.focusAt} onChange={(e) => set("focusAt", e.target.value)} placeholder="System Design, DSA, React..." />
              </div>
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
              <Button onClick={handleSubmit} disabled={setupMutation.isPending}>
                {setupMutation.isPending ? "Setting up..." : "Start Interview"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
