import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api/client";
import { trackEvent } from "@/lib/analytics";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setProfile(null);
      return;
    }
    setUser(firebaseUser);
    try {
      const res = await api.post("/api/auth/login");
      setProfile(res.data.user);
    } catch {
      try {
        const res = await api.post("/api/auth/register");
        setProfile(res.data.user);
        trackEvent("signup");
      } catch {
        setProfile(null);
      }
    }
  };

  const logout = () => auth.signOut();

  const refreshProfile = async () => {
    if (!user) return;
    const res = await api.get("/api/users/me");
    setProfile(res.data);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      await syncUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
