import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import nurse from "../assets/nurse.png";
import Logo from "../assets/Medicare logo.jpg";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import UserIcon from "../assets/user.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

const slideIn = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-Background overflow-hidden">
      {/* Background gradients and blurs - only show on desktop */}
      <motion.div 
        style={{ opacity }}
        className="hidden md:block absolute inset-0"
      >
        <div className="w-[80%] h-[80%] max-w-[800px] max-h-[800px] absolute top-[50%] left-[90%] transform -translate-x-1/2 -translate-y-1/2 rotate-[51.71deg] opacity-60 bg-gradient-to-br from-[#b8c5fd] to-[#e8c3d5] blur-[100px]" />
        <div className="w-[70%] h-[70%] max-w-[700px] max-h-[700px] absolute top-[-15%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-3 rounded-full blur-[75px]" />
        <div className="w-[50%] h-[50%] max-w-[500px] max-h-[500px] absolute top-[40%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-1 rounded-full blur-[75px]" />
        <div className="w-[70%] h-[70%] max-w-[700px] max-h-[700px] absolute top-[65%] left-[-5%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-3 rounded-full blur-[75px]" />
      </motion.div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 space-y-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[1700px] flex justify-between items-center py-4 px-4 md:px-8"
        >
          {/* Mobile Controls */}
          <div className="md:hidden flex justify-between items-center w-full">
            {/* Mobile menu button */}
            <button 
              className="p-2 bg-white rounded-full shadow-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-8 h-8 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile Login/User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center border-2 border-[#252A61]"
                >
                  <img
                    src={UserIcon}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="h-[45px] flex items-center justify-center px-6 py-2 bg-[#252A61] text-white rounded-full text-base hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Desktop Navigation and Controls */}
          <div className="hidden md:flex items-center justify-between w-full">
            <img className="w-40 h-auto" src={Logo} alt="Logo" />
            <nav className="flex space-x-8 lg:space-x-12 text-base lg:text-lg font-[Montserrat Alternates] font-semibold">
              <Link to="/" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
                Home
              </Link>
              <Link to="/health-records" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
                Health Records
              </Link>
              <Link to="/upload-reports" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
                Upload Reports
              </Link>
              <Link to="/about" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
                About Us
              </Link>
              <Link to="/dashboard" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
                Dashboard
              </Link>
            </nav>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-[60px] h-[60px] focus:outline-none"
                >
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="w-full h-full rounded-full object-cover hover:ring-2 hover:ring-[#252A61] transition-all duration-300"
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="w-[200px] h-[60px] flex items-center justify-center px-6 py-2 bg-[#252A61] text-white rounded-full text-xl hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>
        </motion.header>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute left-0 top-0 h-full w-[80%] bg-white rounded-r-[30px] shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <img className="w-32 h-auto" src={Logo} alt="Logo" />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-8 h-8 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-4 p-6">
                <Link to="/" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </Link>
                <Link to="/health-records" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Health Records</span>
                </Link>
                <Link to="/upload-reports" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Reports</span>
                </Link>
                <Link to="/about-us" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>About Us</span>
                </Link>
                <Link to="/dashboard" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </nav>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <motion.div 
          style={{ scale }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1703px] relative"
        >
          {/* Mobile Hero */}
          <div className="md:hidden w-full h-[180px] bg-[#252a61] rounded-[30px] relative overflow-hidden">
            <h1 className="absolute inset-0 flex items-center justify-center text-[75px] font-bold font-['Montserrat Alternate'] leading-none text-[#d9e7ff] -translate-y-12">
              Medicare
            </h1>
            <div className="relative z-10 h-full flex items-end justify-center">
              <img
                src={nurse}
                alt="nurse"
                className="h-[160px] w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop Hero */}
          <div className="hidden md:block h-[800px] lg:h-[1000px]">
            <div className="w-full h-full bg-[#252a61] rounded-[50px] relative overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full flex justify-center mb-8">
                <h1 className="text-[150px] lg:text-[200px] font-bold font-['Montserrat Alternate'] leading-none text-[#d9e7ff] text-center">
                  Medicare
                </h1>
              </div>
              <div className="w-full flex justify-center mt-8">
                <img
                  src={nurse}
                  alt="nurse"
                  className="w-[400px] lg:w-[500px] h-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 py-4 md:py-8 px-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/find-hospital"
              className="w-full flex items-center space-x-4 md:justify-center bg-[#CDEBF1] rounded-2xl md:rounded-[30px] p-4 md:p-6 hover:shadow-xl transition-all duration-300"
            >
              <motion.img
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 md:w-16 md:h-16"
                src={FindHospitalimage}
                alt="Find Hospital"
              />
              <span className="text-lg md:text-2xl font-bold text-[#252a61]">
                Find Hospital
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/upload-reports"
              className="w-full flex items-center space-x-4 md:justify-center bg-[#DEF1D0] rounded-2xl md:rounded-[30px] p-4 md:p-6 hover:shadow-xl transition-all duration-300"
            >
              <svg className="w-12 h-12 md:w-16 md:h-16 text-[#252a61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-lg md:text-2xl font-bold text-[#252a61]">
                Upload Reports
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/health-records"
              className="w-full flex items-center space-x-4 md:justify-center bg-[#f8e5e5] rounded-2xl md:rounded-[30px] p-4 md:p-6 hover:shadow-xl transition-all duration-300"
            >
              <img
                className="w-12 h-12 md:w-16 md:h-16"
                src={HealthRecordsimage}
                alt="Health Records"
              />
              <span className="text-lg md:text-2xl font-bold text-[#252a61]">
                Health Records
              </span>
            </Link>
          </motion.div>
        </motion.section>

        {/* What We Do */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[1700px] text-center py-4 md:py-8"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-xl md:text-3xl lg:text-5xl font-normal text-Text mb-8"
          >
            What We Do
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
          >
            {[
              {
                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                title: "Digital Health Records",
                description: "Securely store and manage your medical records in one place. Access your health information anytime, anywhere.",
                bgColor: "bg-[#CDEBF1]"
              },
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                title: "Report Management",
                description: "Upload and organize your medical reports, test results, and prescriptions in a structured format.",
                bgColor: "bg-[#DEF1D0]"
              },
              {
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                title: "Hospital Locator",
                description: "Find nearby hospitals, clinics, and healthcare facilities with detailed information and ratings.",
                bgColor: "bg-[#f8e5e5]"
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Appointment Scheduling",
                description: "Book appointments with healthcare providers, receive reminders, and manage your medical schedule.",
                bgColor: "bg-[#CDEBF1]"
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Secure Data Storage",
                description: "Your health information is protected with advanced encryption and security measures.",
                bgColor: "bg-[#DEF1D0]"
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Healthcare Network",
                description: "Connect with healthcare providers and share your medical information securely.",
                bgColor: "bg-[#f8e5e5]"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.1 }
                }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-[30px] shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <motion.div 
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <motion.svg 
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 180,
                      transition: { duration: 0.2 }
                    }}
                    className="w-8 h-8 text-[#252A61]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </motion.svg>
                </motion.div>
                <motion.h3 
                  whileHover={{ 
                    color: "#252A61",
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                  className="text-xl font-semibold text-[#252A61] mb-2"
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  whileHover={{ 
                    color: "#4a5568",
                    scale: 1.02,
                    transition: { duration: 0.1 }
                  }}
                  className="text-gray-600"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full bg-Primary rounded-tl-[20px] rounded-tr-[20px] py-8"
        >
          {/* Footer content */}
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
