import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-hero-illustration">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-700 to-blue-800 animate-spin"></div>
        <div className="absolute inset-0 m-2 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
