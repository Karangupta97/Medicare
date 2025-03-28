import React from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-blue-800 text-9xl flex items-center">
          <FaHeartbeat className="mr-2 text-red-500 animate-pulse" />
          <span>404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
          Oops! Page Not Found
        </h1>
        <p className="text-center text-gray-600 max-w-md">
          It looks like you've wandered off the path. The page you're looking
          for doesn’t exist. Let's get you back on track!
        </p>
        <Link
          to="/"
          className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
        >
          <FaHome className="mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
