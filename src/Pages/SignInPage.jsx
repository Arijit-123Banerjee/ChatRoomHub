import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    // Add sign-in logic here (e.g., call an API)
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    console.log("Sign In Successful!");
  };

  const handleGoogleSignIn = () => {
    // Add Google Sign-In logic here (e.g., redirect to Google OAuth)
    console.log("Google Sign-In Initiated");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#000e2d] rounded-xl shadow-lg border border-gray-800 max-md:h-screen">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-100">
          Sign In
        </h2>

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {/* Email Input */}
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Sign In
          </button>
        </form>

        {/* Google Sign In Button */}
        <div className="relative flex items-center justify-center mt-4">
          <div className="absolute inset-0 flex items-center">
            <hr className="w-full border-gray-700" />
          </div>
          <div className="relative px-3 text-gray-400 bg-[#000e2d]">or</div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2 mt-4 bg-gray-800 text-gray-200 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <FaGoogle className="w-5 h-5" />
          Sign In with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-cyan-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
