import React from "react";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";

const WorkingOnIt = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">We are working on this page</h1>
        <p className="text-base sm:text-lg md:text-xl mb-4">Thank you for your patience. Stay tuned for updates!</p>
        <FaHeartbeat className="text-3xl sm:text-4xl md:text-6xl mx-auto" />
      </div>
    </div>
  );
};

export default WorkingOnIt;