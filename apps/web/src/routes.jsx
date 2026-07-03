import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import CreateInterview from "@/pages/CreateInterview";
import TemplateStart from "@/pages/TemplateStart";
import Interview from "@/pages/Interview";
import Report from "@/pages/Report";
import PublicReport from "@/pages/PublicReport";
import Profile from "@/pages/Profile";
import Practice from "@/pages/Practice";
import Resources from "@/pages/Resources";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "practice", element: <ProtectedRoute><Practice /></ProtectedRoute> },
      { path: "interview/setup", element: <ProtectedRoute><CreateInterview /></ProtectedRoute> },
      { path: "interview/template/:templateId", element: <ProtectedRoute><TemplateStart /></ProtectedRoute> },
      { path: "interview/:interviewId", element: <ProtectedRoute><Interview /></ProtectedRoute> },
      { path: "interview/report/:interviewId", element: <ProtectedRoute><Report /></ProtectedRoute> },
      { path: "report/public/:token", element: <PublicReport /> },
      { path: "resources", element: <Resources /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
