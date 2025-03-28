import { motion } from "framer-motion";
import { FaHandsHelping } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      {/* Outer Pulse Circle */}
      <motion.div
        className="relative flex items-center justify-center p-10"
        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Circle Border */}
        <div className="absolute border-4 border-blue-800 rounded-full w-40 h-40 animate-pulse"></div>

        {/* Cross Icon */}
        <div className="bg-blue-800 rounded-xl w-24 h-24 flex items-center justify-center shadow-lg relative z-10">
          <FaHandsHelping className="text-white text-4xl" />
        </div>
      </motion.div>

      {/* Loading Text */}
      <p className="mt-4 text-blue-800 font-semibold tracking-wide text-lg">
        Loading Medicare...
      </p>
    </div>
  );
};

export default Loading;
