import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Ensure the correct path to your hook
import image from "../assets/landingPageImage.png";
import { Link } from "react-router-dom";
import BackgroundImage from "../assets/backgroundimg.jpg";
import LoadingSpinner from "../Components/LoadingSpinner";

const LandingPage = () => {
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);
  const getStarted = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/app");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
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
      getStarted.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: "elastic", delay: 1.8 }
    );
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section
      className="overflow-hidden pt-12 bg-gradient-to-br from-gray-900 to-gray-800 bg-cover bg-center min-h-screen flex flex-col justify-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-lg text-gray-400 font-inter mb-4"
            ref={headingRef}
          >
            Smart Communication Hub, Designed for Seamless Collaboration
          </h1>
          <p
            className="text-4xl font-bold leading-tight text-gray-100 sm:text-5xl lg:text-6xl font-pj mb-6"
            ref={subHeadingRef}
          >
            Transform how you connect and collaborate
            <span className="relative inline-flex">
              <span className="bg-gradient-to-r from-cyan-700 to-blue-800 blur-md rounded-full filter opacity-30 absolute inset-0"></span>
              <span className="relative text-cyan-400"> effortlessly </span>
            </span>
          </p>
          <div
            className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-center mb-12"
            ref={buttonsRef}
          >
            <Link
              to="/app"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-cyan-700 to-blue-800 rounded-xl transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-8 py-3 mt-4 sm:mt-0 text-lg font-bold text-gray-500 border-2 border-transparent rounded-xl transition-transform transform hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Sign Up Free
            </Link>
          </div>
          <p
            className=" text-base text-gray-400 font-inter mb-8"
            ref={getStarted}
          >
            Get started with effortless communication
          </p>
          <img
            src={image}
            alt="Illustration"
            className="w-full h-auto max-w-3xl mx-auto rounded-2xl"
            ref={imageRef}
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
