import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiArrowRight, FiCheck, FiPhone, FiMail, FiMapPin, FiClock, FiUser, FiHeart, FiShield, FiTarget, FiTrendingUp, FiDownload } from 'react-icons/fi';
import { useAuthStore } from "../store/authStore";
import MedicareLogo from '../assets/Medicare logo.png';

const About = () => {
  const { user, logout } = useAuthStore();
  const [isVisible, setIsVisible] = useState({
    mission: false,
    vision: false,
    values: false,
    services: false,
    team: false,
    contact: false
  });
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        mission: document.getElementById('mission-section'),
        vision: document.getElementById('vision-section'),
        values: document.getElementById('values-section'),
        services: document.getElementById('services-section'),
        team: document.getElementById('team-section'),
        contact: document.getElementById('contact-section')
      };
      
      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const visible = (
            rect.top <= (window.innerHeight * 0.75) &&
            rect.bottom >= (window.innerHeight * 0.25)
          );
          setIsVisible(prev => ({ ...prev, [key]: visible }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const valueCardVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };
  
  // Statistics 
  const stats = [
    { value: "250K+", label: "Registered Patients" },
    { value: "1500+", label: "Healthcare Providers" },
    { value: "98%", label: "Patient Satisfaction" },
    { value: "24/7", label: "Support Available" }
  ];
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] to-white dark:from-gray-800 dark:to-gray-900 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#252A61]/10 blur-3xl"></div>
          <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] rounded-full bg-[#4338ca]/10 blur-3xl"></div>
          <div className="absolute -bottom-[10%] right-[20%] w-[35%] h-[35%] rounded-full bg-[#252A61]/10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              About <span className="text-[#252A61] bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-500">Medicare</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Revolutionizing healthcare through technology and putting patients at the center of their medical journey.
            </p>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl w-full"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={valueCardVariant}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <p className="text-3xl md:text-4xl font-bold text-[#252A61] dark:text-blue-400">{stat.value}</p>
                <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Mission Section - Enhanced */}
      <section 
        id="mission-section" 
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.mission ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 -m-10 bg-gradient-to-r from-[#252A61]/20 to-blue-500/20 rounded-full filter blur-3xl opacity-30"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  className="w-full h-auto object-cover" 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Medical professionals" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <span className="text-sm bg-[#252A61] py-1 px-3 rounded-full font-medium">Our Purpose</span>
                    <h3 className="text-2xl font-bold mt-2">Transforming Healthcare</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="inline-block mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5">
                <span className="text-sm font-semibold text-[#252A61] dark:text-blue-400 uppercase tracking-wide">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Delivering Healthcare <span className="text-[#252A61] italic">Excellence</span> Through Technology
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                At Medicare, we're dedicated to revolutionizing healthcare management
                by providing a seamless, secure, and user-friendly platform for
                managing medical records and healthcare services. We believe that everyone
                deserves access to efficient, transparent healthcare information.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {icon: <FiHeart />, text: "Patient-centered approach"}, 
                  {icon: <FiShield />, text: "Highest security standards"},
                  {icon: <FiTarget />, text: "Seamless healthcare management"},
                  {icon: <FiUser />, text: "Personalized medical journey"}
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[#252A61] dark:text-blue-400">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Vision Section - Enhanced */}
      <section 
        id="vision-section" 
        className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.vision ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="md:order-2">
              <div className="relative">
                <div className="absolute inset-0 -m-10 bg-gradient-to-r from-purple-500/20 to-[#252A61]/20 rounded-full filter blur-3xl opacity-30"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    className="w-full h-auto object-cover" 
                    src="https://images.unsplash.com/photo-1580281657702-257584239a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Digital healthcare" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <span className="text-sm bg-purple-600 py-1 px-3 rounded-full font-medium">Our Vision</span>
                      <h3 className="text-2xl font-bold mt-2">Healthcare of Tomorrow</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:order-1">
              <div className="inline-block mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Healthcare <span className="text-purple-600 dark:text-purple-400 italic">Reimagined</span> For The Digital Age
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                We envision a future where healthcare information is easily accessible,
                securely managed, and efficiently shared between patients and healthcare
                providers, leading to better health outcomes for all. Our platform aims to
                bridge the gap between patients and healthcare providers, creating a unified ecosystem 
                where health information flows seamlessly.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Universal access to medical records anytime, anywhere",
                  "Simplified communication between patients and providers",
                  "Data-driven healthcare for personalized treatment plans",
                  "Elimination of administrative barriers to quality care"
                ].map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mt-0.5">
                      <FiCheck className="w-4 h-4" />
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Values Section - Enhanced with Cards */}
      <section 
        id="values-section" 
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.values ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5">
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">What We Stand For</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Core <span className="text-indigo-600 dark:text-indigo-400">Values</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              These principles guide everything we do as we work to transform healthcare experiences.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={isVisible.values ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { 
                title: "Security", 
                desc: "Patient privacy is our top priority, with industry-leading protocols to protect your sensitive medical data.",
                icon: <FiShield className="w-6 h-6" />,
                color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              },
              { 
                title: "Innovation", 
                desc: "We constantly evolve our platform with cutting-edge technology to improve the healthcare experience.",
                icon: <FiTrendingUp className="w-6 h-6" />,
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              },
              { 
                title: "User-Centric", 
                desc: "Every feature is designed with patients in mind, ensuring intuitive and accessible healthcare management.",
                icon: <FiUser className="w-6 h-6" />,
                color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              },
              { 
                title: "Transparency", 
                desc: "We believe in clear communication and providing complete visibility into your healthcare data.",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>,
                color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
              },
              { 
                title: "Accessibility", 
                desc: "Healthcare data should be available anywhere, anytime—providing vital information when you need it most.",
                icon: <FiDownload className="w-6 h-6" />,
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              },
              { 
                title: "Integrity", 
                desc: "We maintain the highest ethical standards in handling your health information and delivering our services.",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>,
                color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={valueCardVariant}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Services Section - Enhanced with Icons */}
      <section 
        id="services-section" 
        className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.services ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our <span className="text-blue-600 dark:text-blue-400">Services</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Comprehensive healthcare solutions designed to simplify your medical journey
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={isVisible.services ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "Digital Health Records",
                desc: "Securely store and manage your medical records in one place, accessible anytime.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: "Appointment Management",
                desc: "Schedule and manage your medical appointments with ease and receive reminders.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Prescription Tracking",
                desc: "Keep track of your medications, dosages, and refill schedules in one place.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )
              },
              {
                title: "Health Analytics",
                desc: "Get insights into your health data and trends to make informed decisions.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )
              }
            ].map((service, index) => (
              <motion.div 
                key={index} 
                variants={valueCardVariant}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300 group"
              >
                <div className="mb-6 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#252A61] dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.services ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-3 rounded-full bg-[#252A61] text-white font-medium hover:bg-[#3b3b98] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Explore All Services
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Team Section - Enhanced */}
      <section 
        id="team-section" 
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.team ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6 rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-1.5">
              <span className="text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">The People Behind Medicare</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our <span className="text-red-600 dark:text-red-400">Expert Team</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              A dedicated group of healthcare professionals and technology experts working together to provide you with the best healthcare management experience
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.team ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-red-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:space-x-8"
          >
            <div className="mb-8 md:mb-0 md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Medical Team"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Experts in Healthcare Technology
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our team consists of healthcare professionals, technology experts,
                and dedicated support staff working together to provide you with
                the best healthcare management experience. With decades of combined experience in
                both healthcare and technology, we're uniquely positioned to address the complex
                challenges of modern medical information management.
              </p>
              <Link
                to="/team"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[#252A61] text-white font-medium hover:bg-[#3b3b98] transition-colors duration-300 shadow-lg"
              >
                Meet our team
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Section - Enhanced */}
      <section 
        id="contact-section" 
        className="py-16 md:py-24 bg-[#252A61] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.contact ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-block mb-6 rounded-full bg-white/20 px-4 py-1.5">
                <span className="text-sm font-semibold text-white uppercase tracking-wide">Get in Touch</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                We're Here To <span className="italic">Help</span>
              </h2>
              <p className="text-lg text-blue-100 mb-10">
                Have questions or need assistance? Our support team is here to help.
                Feel free to reach out to us anytime through any of the channels below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Phone Support</p>
                    <p className="text-lg font-medium">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Email</p>
                    <p className="text-lg font-medium">support@medicare.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Office Location</p>
                    <p className="text-lg font-medium">123 Healthcare Avenue, Medical District</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Business Hours</p>
                    <p className="text-lg font-medium">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 -m-10 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full filter blur-3xl opacity-50"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex justify-center mb-8">
                    <img 
                      src={MedicareLogo} 
                      alt="Medicare Logo" 
                      className="h-16 filter brightness-0 invert opacity-90" 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
                    <p className="text-blue-100 mb-6">
                      Follow us on social media for updates, health tips, and more
                    </p>
                    <div className="flex justify-center space-x-4">
                      {[
                        { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                        { name: "Twitter", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                        { name: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                        { name: "Instagram", icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" }
                      ].map((social, index) => (
                        <a 
                          key={index} 
                          href="#" 
                          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                          aria-label={social.name}
                        >
                          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                            <path d={social.icon} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Medicare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;