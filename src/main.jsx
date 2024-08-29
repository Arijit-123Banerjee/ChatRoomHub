import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import "./index.css";
import SignInPage from "./Pages/SignInPage.jsx";

// Configure routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <App />, // Add the route for the main app
  },
  { path: "/signin", element: <SignInPage /> },
]);

// Render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
