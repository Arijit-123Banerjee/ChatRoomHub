import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already signed in when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/app"); // Redirect to /app if user is already signed in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      navigate("/app");
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-100">
          Log In
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Log In
          </button>
        </form>

        <div className="relative flex items-center justify-center mt-4">
          <div className="absolute inset-0 flex items-center">
            <hr className="w-full border-gray-700" />
          </div>
          <div className="relative px-3 text-gray-400 bg-gray-900">or</div>
        </div>

        <p className="text-sm text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signin" className="text-cyan-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
