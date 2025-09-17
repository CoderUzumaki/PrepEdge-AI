import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../firebase";
import { GithubAuthProvider } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast"; // ✅ import toast

export default function Login() {
  const githubProvider = new GithubAuthProvider();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ Email + Password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("⚠️ Please enter email and password", {
        style: {
          borderRadius: "10px",
          background: "#ef4444", // red
          color: "#fff",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ef4444",
        },
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setUser(userCredential.user);
      toast.success("🎉 Login successful", {
        style: {
          borderRadius: "10px",
          background: "#22c55e", // green
          color: "#fff",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#22c55e",
        },
      });

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      toast.error(err.message || "❌ Login failed", {
        style: {
          borderRadius: "10px",
          background: "#f97316", // orange
          color: "#fff",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#f97316",
        },
      });
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setUser(result.user);
      toast.success("🚀 Signed in with Google", {
        style: {
          borderRadius: "10px",
          background: "#3b82f6", // blue
          color: "#fff",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#3b82f6",
        },
      });

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      toast.error(err.message || "❌ Google login failed", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  // ✅ GitHub login
  const handleGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const idToken = await result.user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setUser(result.user);
      toast.success("🐙 Signed in with GitHub", {
        style: {
          borderRadius: "10px",
          background: "#111827", // black/gray
          color: "#fff",
          fontWeight: "600",
        },
      });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.message || "❌ GitHub login failed", {
        style: {
          borderRadius: "10px",
          background: "#6b7280", // gray
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 min-w-screen">
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Login</h1>
            </div>

            {/* ✅ Email + password form */}
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
            </form>

            {/* ✅ Social login buttons */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGithub}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaGithub className="w-4 h-4 mr-2" />
                  Github
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="w-4 h-4 mr-2 text-red-500" />
                  Google
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {"Don’t have an account? "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
