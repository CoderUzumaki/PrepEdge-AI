import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
   <AuthProvider>
	   <UserDataProvider>
		   <RouterProvider router={router} />
	   </UserDataProvider>
   </AuthProvider>
);
