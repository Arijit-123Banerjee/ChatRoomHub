import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/app");
    });

    return () => unsubscribe();
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
      setError("Login failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            Log In
          </span>
        </h2>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transform hover:-translate-y-1"
          >
            Log In
          </button>
        </form>
        <div className="relative flex items-center justify-center mt-8">
          <div className="absolute inset-0 flex items-center">
            <hr className="w-full border-white border-opacity-20" />
          </div>
          <div className="relative px-4 bg-white bg-opacity-70 text-gray-500  rounded-full">
            or
          </div>
        </div>
        <p className="text-sm text-center text-gray-300 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signin"
            className="text-pink-400 hover:text-pink-300 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
