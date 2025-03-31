import { motion } from "framer-motion";
import logo from "../assets/logo copy.png";

const LoadingSpinner = () => (
  <div className="relative w-16 h-16">
    <motion.div
      className="absolute inset-0 border-4 border-blue-200/50 rounded-full"
      style={{ borderTopColor: '#3b82f6' }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div
      className="absolute inset-1 border-4 border-transparent rounded-full"
      style={{ borderRightColor: '#6366f1' }}
      animate={{ rotate: [0, -360] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
);

const Loading = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        
        {/* Logo Background Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Large Outer Circle */}
          <motion.div
            className="absolute w-[120vh] h-[120vh]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)'
            }}
          />
          
          {/* Middle Glow */}
          <motion.div
            className="absolute w-[500px] h-[500px]"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(219,234,254,0.3) 40%, transparent 60%)'
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute w-[300px] h-[300px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(219,234,254,0.4) 50%, transparent 70%)'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-16 relative"
        >
          {/* <motion.img 
            src={logo} 
            alt="Logo" 
            className="w-80 h-auto mix-blend-multiply"
            animate={{
              scale: [1, 1.02, 1],
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(59, 130, 246, 0.2))'
            }}
          /> */}
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Welcome to Medicare
          </motion.h2>
          
          <motion.p
            className="mt-4 text-gray-600 text-base font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Setting up your secure healthcare environment
          </motion.p>
        </motion.div>

        {/* Loading Spinner and Status */}
        <motion.div
          className="mt-12 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <LoadingSpinner />
          
          {/* Status Text */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <span className="text-sm text-gray-500 font-medium block">Loading your profile</span>
            <span className="text-sm text-blue-600 font-semibold mt-1 block">Please wait...</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
