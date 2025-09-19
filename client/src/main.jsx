import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import {VariantsProvider} from './context/motionContext'


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <VariantsProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      </VariantsProvider>
</React.StrictMode>
);
