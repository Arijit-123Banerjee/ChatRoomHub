import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const LandingPage = () => {
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);
  const getStartedRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/app");
      }
    });

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    gsap.fromTo(
      subHeadingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
    );

    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 1 }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 1.4 }
    );

    gsap.fromTo(
      getStartedRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "elastic.out(1, 0.75)",
        delay: 1.8,
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-hero-illustration text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
        <div className="w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-2xl relative"></div>
      </div>

      <div className="text-center px-4 z-10">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-6 tracking-wide leading-tight"
          ref={headingRef}
        >
          Redefine Your Collaboration
        </h1>
        <p
          className="text-6xl sm:text-7xl font-extrabold leading-tight mb-8 relative"
          ref={subHeadingRef}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            Innovate
          </span>{" "}
          & Create
        </p>
        <div
          className="flex flex-col sm:flex-row sm:space-x-6 justify-center mb-12"
          ref={buttonsRef}
        >
          <Link
            to="/app"
            className="px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 transform transition-transform duration-300 shadow-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/signin"
            className="mt-4 sm:mt-0 px-8 py-4 text-lg font-bold rounded-full border border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up Free
          </Link>
        </div>
        <p
          className="text-gray-600 text-lg mb-8 font-medium"
          ref={getStartedRef}
        >
          Start your journey with us today
        </p>
      </div>
    </section>
  );
};

export default LandingPage;
