import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import nurse from "../assets/nurse.png";
import Logo from "../assets/hand logo.png";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import Navbar from "../components/Navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 },
};

const slideIn = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

const Home = () => {
  const [user, setUser] = useState(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-Background">
      {/* Enhanced background with more dynamic gradients */}
      <motion.div
        style={{ opacity }}
        className="hidden md:block absolute inset-0 overflow-hidden"
      >
        <div className="w-[90%] h-[90%] max-w-[900px] max-h-[900px] absolute top-[40%] left-[85%] transform -translate-x-1/2 -translate-y-1/2 rotate-[45deg] opacity-70 bg-gradient-to-br from-[#a8b4fd] via-[#d8b3e5] to-[#f8c3c5] blur-[120px] animate-pulse" />
        <div className="w-[80%] h-[80%] max-w-[800px] max-h-[800px] absolute top-[-25%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 opacity-70 bg-gradient-to-r from-[#b8e7fd] to-[#c3d5e8] rounded-full blur-[100px] animate-pulse" />
        <div className="w-[60%] h-[60%] max-w-[600px] max-h-[600px] absolute top-[60%] left-[-10%] transform -translate-x-1/2 -translate-y-1/2 opacity-70 bg-gradient-to-l from-[#fdc8b8] to-[#e8c3d5] rounded-full blur-[90px] animate-pulse" />
      </motion.div>

      {/* Main content container with improved spacing */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-full overflow-x-hidden">
        <div className="w-full px-4 pt-0 pb-8 max-w-[1700px] mx-auto">
          <Navbar user={user} onLogout={handleLogout} />

          {/* Enhanced Hero Section */}
          <motion.div
            style={{ scale }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full relative -mt-2"
          >
            {/* Desktop Hero Section with improved gradients and layout */}
            <div className="hidden md:block rounded-[30px] lg:rounded-[50px] overflow-hidden bg-gradient-to-r from-[#1a1f4d] via-[#252a61] to-[#2f347c] shadow-2xl">
              <div className="relative w-full">
                {/* Enhanced animated background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-20 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-24 left-0 w-80 h-80 bg-indigo-400/30 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                
                {/* Main Content Grid with improved spacing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px] lg:min-h-[750px]">
                  {/* Left Column - Enhanced Content */}
                  <div className="relative z-10 py-20 px-8 lg:px-16 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Enhanced logo section */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center mb-8"
                      >
                        <div className="bg-white/15 backdrop-blur-xl p-3 rounded-2xl shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                          <img
                            src={Logo}
                            alt="Medicare Logo"
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                        <h3 className="text-white/90 pl-5 text-2xl font-semibold tracking-wide">
                          Medicare
                        </h3>
                      </motion.div>

                      {/* Enhanced heading with gradient text */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-8"
                      >
                        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
                            Healthcare
                          </span>
                          <br />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-300">
                            Reimagined
                          </span>
                        </h1>
                        <p className="text-3xl text-white/80 font-light">
                          for the Digital Age
                        </p>
                      </motion.div>

                      {/* Enhanced description with backdrop blur */}
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10 shadow-lg"
                      >
                        Experience healthcare evolved. Our secure platform seamlessly connects patients, doctors, and hospitals, providing instant access to medical records and expert care—anytime, anywhere.
                      </motion.p>
                      
                      {/* Enhanced floating badges */}
                      <div className="flex flex-wrap gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                          className="inline-flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-white/90 text-sm font-medium">HIPAA Compliant & Certified</span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="inline-flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <span className="text-white/90 text-sm font-medium">End-to-End Encrypted</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Enhanced Image Section */}
                  <div className="relative hidden lg:flex items-end justify-center p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="relative z-10"
                    >
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/40 rounded-full filter blur-xl animate-pulse"></div>
                      <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-purple-400/40 rounded-full filter blur-xl animate-pulse animation-delay-1000"></div>
                      
                      {/* Main image with enhanced shadow */}
                      <img
                        src={nurse}
                        alt="Healthcare Professional"
                        className="relative z-10 max-h-[550px] object-contain drop-shadow-2xl filter brightness-105 mb-0"
                      />
                      
                      {/* Enhanced floating stat boxes */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="absolute top-20 -right-12 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Verified Records</p>
                            <p className="text-lg font-bold text-gray-900">10M+</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="absolute bottom-20 -left-12 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-lg font-bold text-gray-900">2M+</p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile and Tablet Hero Section - Enhanced for all device sizes */}
            <div className="md:hidden bg-gradient-to-r from-[#252a61] to-[#3a3f7a] rounded-2xl overflow-hidden p-3 sm:p-4">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
              {/* <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full filter blur-xl opacity-30 animate-pulse animation-delay-1000"></div> */}
              
              <div className="relative flex flex-row items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
                      <img
                        src={Logo}
                        alt="Medicare Logo"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <h3 className="text-white pl-2 text-base font-semibold">Medicare</h3>
                  </div>
                  
                  <h1 className="font-bold text-white mb-1">
                    <span className="text-x bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                      Healthcare
                    </span>
                    <br/>
                    <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-300">
                            Reimagined
                          </span>
                  </h1>
                  
                  <p className="text-white/90 text-xs mb-2 max-w-[180px] line-clamp-2">
                    A secure platform that connects patients, doctors, and hospitals.
                  </p>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <div className="flex items-center justify-center w-3 h-3 bg-green-500 rounded-full">
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/90 text-[10px] font-medium">HIPAA Compliant & Certified</span>
                      
                    </div>
                  </div>
                </div>
                
                <div className="relative w-40 h-40 sm:w-24 sm:h-24">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                  <img
                    src={nurse}
                    alt="Healthcare Professional"
                    className="relative z-10 object-contain w-full h-full drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services Section - Enhanced Responsive Design */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 md:gap-6 lg:gap-10 py-4 md:py-8 mt-4 xs:mt-6 sm:mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Link
                to="/find-hospital"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#CDEBF1] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <motion.img
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  src={FindHospitalimage}
                  alt="Find Hospital"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#252a61]">
                  Find Hospital
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/upload"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#DEF1D0] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <svg
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#252a61]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#252a61]">
                  Upload Reports
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-1 sm:col-span-2 md:col-span-1"
            >
              <Link
                to="/health-records"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#f8e5e5] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <img
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  src={HealthRecordsimage}
                  alt="Health Records"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#252a61]">
                  Health Records
                </span>
              </Link>
            </motion.div>
          </motion.section>

          {/* What We Do - Enhanced for better responsiveness */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full text-center py-4 sm:py-6 md:py-8 lg:py-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-3xl lg:text-5xl font-normal text-Text mb-4 sm:mb-6 md:mb-8"
            >
              What We Do
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            >
              {[
                {
                  icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  title: "Digital Health Records",
                  description:
                    "Securely store and manage your medical records in one place. Access your health information anytime, anywhere.",
                  bgColor: "bg-[#CDEBF1]",
                },
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  title: "Report Management",
                  description:
                    "Upload and organize your medical reports, test results, and prescriptions in a structured format.",
                  bgColor: "bg-[#DEF1D0]",
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                  title: "Hospital Locator",
                  description:
                    "Find nearby hospitals, clinics, and healthcare facilities with detailed information and ratings.",
                  bgColor: "bg-[#f8e5e5]",
                },
                {
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",s
                  title: "Appointment Scheduling",
                  description:
                    "Book appointments with healthcare providers, receive reminders, and manage your medical schedule.",
                  bgColor: "bg-[#CDEBF1]",
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Secure Data Storage",
                  description:
                    "Your health information is protected with advanced encryption and security measures.",
                  bgColor: "bg-[#DEF1D0]",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  title: "Healthcare Network",
                  description:
                    "Connect with healthcare providers and share your medical information securely.",
                  bgColor: "bg-[#f8e5e5]",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.1 },
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                  >
                    <motion.svg
                      whileHover={{
                        scale: 1.2,
                        rotate: 180,
                        transition: { duration: 0.2 },
                      }}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#252A61]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.h3
                    whileHover={{
                      color: "#252A61",
                      scale: 1.05,
                      transition: { duration: 0.1 },
                    }}
                    className="text-base sm:text-lg md:text-xl font-semibold text-[#252A61] mb-1 sm:mb-2"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    whileHover={{
                      color: "#4a5568",
                      scale: 1.02,
                      transition: { duration: 0.1 },
                    }}
                    className="text-xs sm:text-sm text-gray-600"
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Why Choose Medicare Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-14 md:py-20 my-8 md:my-16"
          >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <span className="inline-block px-3 py-1 text-xs md:text-sm bg-[#eef1ff] text-[#252a61] rounded-full mb-3">
                  Why Choose Us
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-[#252a61] mb-4">
                  Why Choose Medicare
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're revolutionizing healthcare management with our secure,
                  accessible, and user-friendly platform
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    ),
                    title: "Secure & Private",
                    description:
                      "Your medical data is encrypted and protected with the highest security standards. We comply with all healthcare privacy regulations.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Accessible Anywhere",
                    description:
                      "Access your health records on any device, anytime, anywhere. Your medical history is always at your fingertips when you need it most.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                    ),
                    title: "Easy to Use",
                    description:
                      "Our intuitive interface makes managing your healthcare simple. No technical expertise required—just sign up and get started.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    ),
                    title: "Connect with Healthcare Providers",
                    description:
                      "Seamlessly share your medical records with doctors and hospitals. Improve the quality of care with complete medical history access.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Time-Saving",
                    description:
                      "No more filling out the same forms repeatedly. Your information is readily available, saving time for both you and healthcare providers.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-[#252a61]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ),
                    title: "Always Up-to-Date",
                    description:
                      "Our platform is continuously updated with the latest features and security measures to provide you with the best healthcare management experience.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transition: { duration: 0.2 },
                    }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-[#eef1ff] rounded-full flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-[#252A61] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 md:mt-16 text-center"
              >
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-[#252a61] text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#363b7e] shadow-md"
                  >
                    Learn More About Us
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.section>

          {/* Testimonials Section - Enhanced with horizontal scroll */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-6 sm:py-8 md:py-12 lg:py-16"
          >
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <span className="inline-block px-3 py-1 text-xs md:text-sm bg-[#eef1ff] text-[#252a61] rounded-full mb-3">
                Testimonials
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#252a61] mb-4">
                What Our Users Say
              </h2>
              <motion.p
                variants={fadeInUp}
                className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2"
              >
                Our platform is trusted by thousands of users who have
                experienced seamless healthcare management.
              </motion.p>
            </div>

            {/* Horizontal scrollable testimonials */}
            <div className="relative px-4 sm:px-6">
              <div className="overflow-x-auto hide-scrollbar">
                <div className="inline-flex gap-4 sm:gap-5 md:gap-6 pb-4 min-w-full">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Patient",
                      image: "https://randomuser.me/api/portraits/women/32.jpg",
                      quote:
                        "Medicare has transformed how I manage my health records. I can access all my medical information in one place, making it so much easier to share with doctors.",
                    },
                    {
                      name: "Dr. Rajesh Sharma",
                      role: "Physician, Delhi",
                      image: "https://randomuser.me/api/portraits/men/73.jpg",
                      quote:
                        "Being a doctor in one of Delhi's busiest hospitals, Medicare has helped me access patient records efficiently. The platform is reliable and user-friendly even during peak hours.",
                    },
                    {
                      name: "Priya Patel",
                      role: "Healthcare Professional, Mumbai",
                      image: "https://randomuser.me/api/portraits/women/79.jpg",
                      quote:
                        "Medicare has revolutionized healthcare management in our clinic. The integration with local health systems and ease of use has greatly improved our patient care experience.",
                    },
                    {
                      name: "Dr. Michael Chen",
                      role: "Cardiologist",
                      image: "https://randomuser.me/api/portraits/men/46.jpg",
                      quote:
                        "As a healthcare provider, I appreciate how Medicare streamlines patient information sharing. It has significantly improved my workflow and patient care quality.",
                    },
                    {
                      name: "Emily Rodriguez",
                      role: "Healthcare Administrator",
                      image: "https://randomuser.me/api/portraits/women/68.jpg",
                      quote:
                        "The platform's intuitive design and robust security features make it an essential tool for modern healthcare management. Our entire clinic has benefited from it.",
                    },
                    {
                      name: "Ananya Desai",
                      role: "Patient, Bangalore",
                      image: "https://randomuser.me/api/portraits/women/26.jpg",
                      quote:
                        "I've been using Medicare for my family's health records for over a year now. The ability to share medical history across different hospitals in Bangalore has been incredibly helpful.",
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm p-6 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-w-[300px] sm:min-w-[340px] md:min-w-[380px] border border-gray-100/80 relative overflow-hidden"
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-8 -mt-8"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/5 rounded-full -ml-12 -mb-12"></div>
                      
                      <div className="relative">
                        {/* Quote icon */}
                        <svg
                          className="w-8 h-8 text-[#252A61]/10 absolute -top-2 -left-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.51.884-3.995 2.979-3.995 5.849h4v10h-10zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.511.884-3.996 2.979-3.996 5.849h3.999v10h-9.999z" />
                        </svg>
                        
                        {/* Quote text */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10 pl-6">
                          {testimonial.quote}
                        </p>
                        
                        {/* Profile section */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"></div>
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                            />
                          </div>
                          <div>
                            <h3 className="text-[#252A61] font-semibold">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Add Your Review Section - Enhanced Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-10 md:mt-12 bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg max-w-3xl mx-auto"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#252A61] mb-4 sm:mb-6 text-center">
              Share Your Experience
            </h3>
            <form className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-[#252A61] focus:border-[#252A61] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Role/Location
                  </label>
                  <input
                    type="text"
                    id="role"
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-[#252A61] focus:border-[#252A61] transition-colors"
                    placeholder="e.g., Patient, Mumbai"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-[#252A61] focus:border-[#252A61] transition-colors"
                  placeholder="Share your experience with Medicare..."
                ></textarea>
              </div>
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#252A61] text-white font-medium rounded-lg sm:rounded-xl hover:bg-[#3b3f7c] transition-colors duration-200 shadow-md"
                >
                  Submit Review
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Call to Action - Enhanced Responsiveness */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-6 sm:py-8 md:py-12"
          >
            <div className="bg-gradient-to-r from-[#252a61] to-[#4f56a9] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Ready to Take Control of Your Health?
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8">
                    Join thousands of users who have transformed their
                    healthcare experience with Medicare's digital platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link to="/start" className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-white text-[#252a61] font-semibold rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                      >
                        Get Started
                      </motion.button>
                    </Link>
                    <Link to="/about" className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-transparent text-white border-2 border-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center p-6 sm:p-8">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                    <img
                      src={nurse}
                      alt="Healthcare professional"
                      className="relative z-10 max-h-48 lg:max-h-64 object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#252a61] text-white pt-12 pb-8"
        >
          <div className="max-w-[1700px] mx-auto px-4 md:px-8">
            {/* Top footer with columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {/* Column 1: About */}
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={Logo}
                    alt="Medicare Logo"
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                  <h3 className="text-xl font-bold">Medicare</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Empowering individuals to take control of their health through
                  accessible digital healthcare management.
                </p>
                <div className="flex space-x-4 mt-6">
                  {/* Social Media Icons */}
                  {["facebook", "twitter", "instagram", "linkedin"].map(
                    (platform) => (
                      <a
                        key={platform}
                        href={`https://${platform}.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <span className="sr-only">{platform}</span>
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {platform === "facebook" && (
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          )}
                          {platform === "twitter" && (
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          )}
                          {platform === "instagram" && (
                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.074-4.947c-.061-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.06-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                          )}
                          {platform === "linkedin" && (
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          )}
                        </svg>
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  {[
                    "Home",
                    "About Us",
                    "Services",
                    "Find Hospital",
                    "Contact",
                  ].map((link) => (
                    <li key={link}>
                      <Link
                        to={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Services */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Our Services</h3>
                <ul className="space-y-3">
                  {[
                    "Health Records",
                    "Report Management",
                    "Hospital Locator",
                    "Medical Consultations",
                    "Health Tips",
                  ].map((service) => (
                    <li key={service}>
                      <Link
                        to={`/services/${service
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-white/70 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-white/70 text-sm">
                      support@medicares.com
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/20 my-6"></div>

            {/* Bottom footer */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/70">
                &copy; {new Date().getFullYear()} Medicare. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  to="/privacy-policy"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookie-policy"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Add this CSS to your global styles or in a style tag */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(200%);
          }
        }
        .animate-scroll {
          animation: scroll 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
