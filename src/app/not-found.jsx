"use client";

import Link from "next/link";
import React from "react";

const NotFoundComp = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden">
      {/* Content */}
      <div className="text-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Whoops, that page is gone.
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          The page you are looking for does not exist. How you got here is a
          mystery. Go back to the{" "}
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline transition-all"
          >
            homepage
          </Link>
          .
        </p>
      </div>

      {/* Large 404 in the background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[30vw] md:text-[20vw] font-extrabold text-gray-800 opacity-10 select-none pointer-events-none">
          404
        </h1>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
    </div>
  );
};

export default NotFoundComp;