import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 animate-spin"></div>
          <div className="absolute inset-0 m-0.5 rounded-full bg-gradient-to-br from-indigo-900 to-purple-800"></div>
          <div className="absolute inset-0 m-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
