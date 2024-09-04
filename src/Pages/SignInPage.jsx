import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user info in Firestore
      const userDocRef = doc(database, "users", user.uid);
      await setDoc(userDocRef, {
        username,
        email,
      });

      setError("");
      navigate("/login");
    } catch (error) {
      console.error("Sign-In failed", error);
      setError(error.message); // Provide detailed error message
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-100 mb-4">
          Sign Up
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your username"
              required
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your password"
              requiredz
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
