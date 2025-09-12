import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header />

      <main className="flex-grow">
        <Outlet /> {/* This will render the current page */}
      </main>

      <Footer />

      {/* Global Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "14px",
            padding: "14px 20px",
            color: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 3s ease infinite",
          },
          success: {
            style: {
              background: "linear-gradient(135deg, #34d399, #3b82f6)", // teal → blue
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "linear-gradient(135deg, #f472b6, #a78bfa)", // pink → purple
            },
            iconTheme: {
              primary: "#8b5cf6",
              secondary: "#fff",
            },
          },
          loading: {
            style: {
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)", // cyan → blue
            },
          },
        }}
      />

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default App;
