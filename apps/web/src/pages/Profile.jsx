import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/errors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function Profile() {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || "");
  const [ttsEnabled, setTtsEnabled] = useState(profile?.preferences?.ttsEnabled ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/users/me", {
        name,
        preferences: { ttsEnabled },
      });
      await refreshProfile();
      setToast({ show: true, message: "Profile updated!", type: "success" });
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Update failed"), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setToast({ show: true, message: 'Type DELETE to confirm', type: "error" });
      return;
    }
    setDeleting(true);
    try {
      await api.delete("/api/users/me");
      await logout();
      navigate("/");
      setToast({ show: true, message: "Account deleted", type: "success" });
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Account deletion failed"), type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email || ""} disabled />
          </div>
          <div className="flex items-center gap-2">
            <Label>Plan</Label>
            <Badge className="capitalize">{profile?.tier || "basic"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Enable text-to-speech for questions</span>
          </label>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="mb-8">
        {saving ? "Saving..." : "Save Changes"}
      </Button>

      <Card className="border-[var(--color-destructive)]/30">
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--color-destructive)]" />
          <CardTitle className="text-base text-[var(--color-destructive)]">Delete account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--color-muted)]">
            Permanently delete your account, interviews, reports, and saved templates. This cannot be undone.
          </p>
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleting || confirmText !== "DELETE"}
          >
            {deleting ? "Deleting..." : "Delete my account"}
          </Button>
        </CardContent>
      </Card>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
