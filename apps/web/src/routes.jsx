import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import {
  LazyPage,
  Login,
  SignUp,
  Dashboard,
  CreateInterview,
  TemplateStart,
  Interview,
  Report,
  PublicReport,
  Profile,
  Practice,
  Resources,
  About,
  Contact,
  Privacy,
  Terms,
  NotFound,
} from "@/routes/lazyPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <LazyPage><Login /></LazyPage> },
      { path: "signup", element: <LazyPage><SignUp /></LazyPage> },
      { path: "dashboard", element: <LazyPage><ProtectedRoute><Dashboard /></ProtectedRoute></LazyPage> },
      { path: "profile", element: <LazyPage><ProtectedRoute><Profile /></ProtectedRoute></LazyPage> },
      { path: "practice", element: <LazyPage><ProtectedRoute><Practice /></ProtectedRoute></LazyPage> },
      { path: "interview/setup", element: <LazyPage><ProtectedRoute><CreateInterview /></ProtectedRoute></LazyPage> },
      { path: "interview/template/:templateId", element: <LazyPage><ProtectedRoute><TemplateStart /></ProtectedRoute></LazyPage> },
      { path: "interview/:interviewId", element: <LazyPage><ProtectedRoute><Interview /></ProtectedRoute></LazyPage> },
      { path: "interview/report/:interviewId", element: <LazyPage><ProtectedRoute><Report /></ProtectedRoute></LazyPage> },
      { path: "report/public/:token", element: <LazyPage><PublicReport /></LazyPage> },
      { path: "resources", element: <LazyPage><Resources /></LazyPage> },
      { path: "about", element: <LazyPage><About /></LazyPage> },
      { path: "contact", element: <LazyPage><Contact /></LazyPage> },
      { path: "privacy", element: <LazyPage><Privacy /></LazyPage> },
      { path: "terms", element: <LazyPage><Terms /></LazyPage> },
      { path: "*", element: <LazyPage><NotFound /></LazyPage> },
    ],
  },
]);

export default router;
