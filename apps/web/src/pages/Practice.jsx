import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePracticeQuestion } from "@/hooks/useInterview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Toast from "@/components/Toast";
import { Zap } from "lucide-react";

export default function Practice() {
  const navigate = useNavigate();
  const practiceMutation = usePracticeQuestion();
  const [form, setForm] = useState({
    role: "",
    experienceLevel: "fresher",
    interviewType: "technical",
    topic: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleStart = async () => {
    if (!form.role) return;
    try {
      const res = await practiceMutation.mutateAsync(form);
      if (!res?.interviewId) {
        throw new Error("Practice session was not created");
      }
      navigate(`/interview/${res.interviewId}`);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.error || "Failed to start practice", type: "error" });
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Zap className="h-8 w-8 text-[var(--color-primary)]" />
        <div>
          <h1 className="text-3xl font-bold">Quick Practice</h1>
          <p className="text-[var(--color-muted)]">Single-question drill mode</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Setup</CardTitle>
          <CardDescription>Get one targeted question without a full report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Frontend Developer" />
          </div>
          <div className="space-y-2">
            <Label>Topic (optional)</Label>
            <Input value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))} placeholder="React hooks, System Design..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}>
                {["fresher", "junior", "mid", "senior"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.interviewType} onChange={(e) => setForm((f) => ({ ...f, interviewType: e.target.value }))}>
                {["technical", "behavioral", "mixed"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={handleStart} disabled={practiceMutation.isPending || !form.role} className="w-full">
            {practiceMutation.isPending ? "Generating..." : "Start Practice"}
          </Button>
        </CardContent>
      </Card>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
