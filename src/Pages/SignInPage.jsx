import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner"; // Import the loading spinner

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false); // Stop loading on error
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", response.user.uid), {
        username: username,
        email: email,
        id: response.user.uid,
      });

      console.log("Sign Up Successful!", response);
      setError("");
      navigate("/login"); // Redirect to login page after sign up
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading after processing
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Initiated");
    // Implement Google Sign-In logic here
  };

  // Render the spinner if loading, else render the form
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#000e2d] rounded-xl shadow-lg border border-gray-800 max-md:h-screen">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-100">
          Sign In
        </h2>

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

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
              name="email"
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
              name="password"
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
          <a href="/signin" className="text-cyan-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
