import { useState } from "react";
import api from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Toast from "@/components/Toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", category: "General", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/contact", form);
      setToast({ show: true, message: "Message sent successfully!", type: "success" });
      setForm({ name: "", email: "", subject: "", category: "General", message: "" });
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Failed to send"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <Card>
        <CardHeader><CardTitle>Send a Message</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Category</Label>
              <select className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {["General", "Support", "Feedback", "Bug Report"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={5} required /></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send Message"}</Button>
          </form>
        </CardContent>
      </Card>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
