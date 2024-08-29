import React from "react";
import image from "../assets/landingPageImage.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="pt-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex flex-col justify-center">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg text-gray-400 font-inter mb-4">
            Smart Communication Hub, Designed for Seamless Collaboration
          </h1>
          <p className="text-4xl font-bold leading-tight text-gray-100 sm:text-5xl lg:text-6xl font-pj mb-6">
            Transform how you connect and collaborate
            <span className="relative inline-flex">
              <span className="bg-gradient-to-r from-cyan-700 to-blue-800 blur-md rounded-full filter opacity-30 absolute inset-0"></span>
              <span className="relative text-cyan-400"> effortlessly </span>
            </span>
          </p>

          <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-center mb-12">
            <Link
              to="#features"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-cyan-700 to-blue-800 rounded-xl transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Explore Features
            </Link>
            <Link
              to="#demo"
              className="inline-flex items-center justify-center px-8 py-3 mt-4 sm:mt-0 text-lg font-bold text-gray-900 border-2 border-transparent rounded-xl transition-transform transform hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-800 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Watch Free Demo
            </Link>
          </div>

          <p className="text-base text-gray-500 font-inter mb-8">
            Start your journey today · No credit card required
          </p>

          <img
            src={image}
            alt="Illustration"
            className="w-full h-auto max-w-3xl mx-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
