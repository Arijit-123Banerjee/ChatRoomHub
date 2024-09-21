import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const LandingPage = () => {
  const refs = {
    heading: useRef(null),
    subHeading: useRef(null),
    buttons: useRef(null),
    getStarted: useRef(null),
  };
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/app");
    });

    const animations = [
      { ref: refs.heading, y: -50, delay: 0.2 },
      { ref: refs.subHeading, y: 50, delay: 0.6 },
      { ref: refs.buttons, scale: 0.8, delay: 1 },
      { ref: refs.getStarted, x: 50, delay: 1.8, ease: "elastic.out(1, 0.75)" },
    ];

    animations.forEach(
      ({ ref, y = 0, x = 0, scale = 1, delay, ease = "power3.out" }) => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y, x, scale },
          { opacity: 1, y: 0, x: 0, scale: 1, duration: 1, ease, delay }
        );
      }
    );

    return unsubscribe;
  }, [navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center px-4 z-10 max-w-4xl">
        <h1
          ref={refs.heading}
          className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-none"
        >
          Redefine Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            Collaboration
          </span>
        </h1>
        <p
          ref={refs.subHeading}
          className="text-2xl sm:text-3xl font-medium mb-12 text-gray-300"
        >
          Innovate & Create with our cutting-edge platform
        </p>
        <div
          ref={refs.buttons}
          className="flex flex-col sm:flex-row sm:space-x-6 justify-center mb-12"
        >
          <Link
            to="/app"
            className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/signin"
            className="mt-4 sm:mt-0 px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign Up Free
          </Link>
        </div>
        <p
          ref={refs.getStarted}
          className="text-gray-300 text-lg mb-8 font-medium"
        >
          Join thousands of teams already using our platform
        </p>
      </div>
    </section>
  );
};

export default LandingPage;
