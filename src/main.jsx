import React, { useEffect, useState } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import App from "./App.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import SignInPage from "./Pages/SignInPage.jsx";
import Login from "./Pages/Login.jsx";
import "./index.css";

const Main = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading spinner or message
  }

  // Configure routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: authenticated ? <Navigate to="/app" /> : <LandingPage />,
    },
    {
      path: "/app",
      element: authenticated ? <App /> : <Navigate to="/" />,
    },
    {
      path: "/signin",
      element: !authenticated ? <SignInPage /> : <Navigate to="/app" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};

// Render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
