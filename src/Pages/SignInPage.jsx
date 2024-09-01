import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database, provider } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
      await addDoc(collection(database, "users"), {
        uid: user.uid,
        username,
        email,
      });

      setError("");
      navigate("/login");
    } catch (error) {
      console.error("Sign-In failed", error);
      setError("Sign-In failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user info in Firestore
      await addDoc(collection(database, "users"), {
        uid: user.uid,
        username: user.displayName || "",
        email: user.email,
      });

      // Navigate or update the UI as needed
      navigate("/login");
    } catch (error) {
      console.error("Google Sign-In failed", error);
      setError("Google Sign-In failed");
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 bg-[#000e2d] rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-extrabold text-center text-gray-100">
          Sign In
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
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
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
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
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
              className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Sign In
          </button>
        </form>
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
