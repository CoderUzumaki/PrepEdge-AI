import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import SetupForm from "./pages/CreateInterview";
import Interview from "./pages/Interview";
import InterviewReport from "./pages/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Error404 from "./pages/404";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/interview/setup", element: <ProtectedRoute><SetupForm /></ProtectedRoute> },
  { path: "/interview/:interviewId", element: <ProtectedRoute><Interview /></ProtectedRoute> },
  { path: "/interview/report/:interviewId", element: <ProtectedRoute><InterviewReport /></ProtectedRoute> },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/resources", element: <Resources /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: "*", element: <Error404 /> },
]);

export default router;