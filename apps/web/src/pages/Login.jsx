import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Toast from "@/components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "error") => setToast({ show: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, show: false }));

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return showToast("Enter your email first");
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent!", "success");
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to continue your interview prep</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="button" onClick={handleForgotPassword} className="text-sm text-[var(--color-primary)] hover:underline">
              Forgot password?
            </button>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--color-border)]" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--color-card)] px-2 text-[var(--color-muted)]">Or</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleOAuth(googleProvider)} disabled={loading}>Google</Button>
            <Button variant="outline" onClick={() => handleOAuth(githubProvider)} disabled={loading}>GitHub</Button>
          </div>

          <p className="text-center text-sm text-[var(--color-muted)]">
            No account? <Link to="/signup" className="text-[var(--color-primary)] hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
