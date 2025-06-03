import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import nurse from "../assets/nurse.png";
import Logo from "../assets/Logo/hand logo.png";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingActionButton from "../components/FloatingActionButton";
import { FiSearch, FiArrowRight, FiStar, FiCheck } from "react-icons/fi";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";
import Lenis from '@studio-freight/lenis';

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

  const [formData, setFormData] = useState({
    name: "",
    role: "patient",
    review: "",
    rating: 0,
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const scrollToVision = () => {
    const visionSection = document.getElementById("vision-section");
    if (visionSection) {
      visionSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      if (!formData.review) {
        throw new Error("Please share your experience");
      }

      if (formData.review.length < 10) {
        throw new Error("Your review must be at least 10 characters long");
      }

      if (formData.review.length > 1000) {
        throw new Error("Your review must not exceed 1000 characters");
      }

      if (!formData.isAnonymous && !formData.name) {
        throw new Error(
          "Please enter your name or select anonymous submission"
        );
      }

      if (!formData.rating) {
        throw new Error("Please provide a rating");
      }

      const response = await axios.post("/api/reviews/submit", {
        ...formData,
        reviewType: "normal",
      });

      setFormData({
        name: "",
        role: "patient",
        review: "",
        rating: 0,
        isAnonymous: false,
      });

      setShowSuccessModal(true);
      setSubmitStatus({
        type: "success",
        message:
          response.data.message || "Thank you for sharing your experience!",
      });

      // Auto-hide the modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Satoshi']">
      <Helmet>
        <html lang="en" />
        <title>Medicare</title>
        <meta
          name="description"
          content="Medicare is a secure healthcare platform connecting patients, doctors, and hospitals. Access medical records, find hospitals, and manage your healthcare journey efficiently."
        />
        <meta
          name="keywords"
          content="healthcare platform, medical records, hospital finder, digital health, patient care, healthcare management, hospital locator, medical reports"
        />

        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Medicare - Healthcare Management Platform"
        />
        <meta
          property="og:description"
          content="Access your medical records, find hospitals, and manage your healthcare journey with our secure platform."
        />
        <meta property="og:image" content={Logo} />
        <meta property="og:url" content="https://www.medicares.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Medicare" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Medicares_india" />
        <meta name="twitter:creator" content="@Medicares_india" />
        <meta
          name="twitter:title"
          content="Medicare - Healthcare Management Platform"
        />
        <meta
          name="twitter:description"
          content="Access your medical records, find hospitals, and manage your healthcare journey with our secure platform."
        />
        <meta name="twitter:image" content={Logo} />

        {/* Additional SEO meta tags */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="author" content="Medicare" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://medicares.in" />

        {/* Additional meta tags for better SEO */}
        <meta name="application-name" content="Medicare" />
        <meta name="theme-color" content="#252A61" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Medicare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Medicare",
            description:
              "A secure healthcare platform that connects patients, doctors, and hospitals, providing instant access to medical records and expert care.",
            url: "https://medicares.in",
            logo: Logo,
            sameAs: [
              "https://twitter.com/Medicares_india",
              "https://instagram.com/medicaresindia",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "",
              email: "support@medicares.in",
              contactType: "customer service",
              availableLanguage: ["English", "Hindi"],
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Medicare",
            url: "https://medicares.in",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://medicares.in/find-hospital?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthAndBeautyBusiness",
            name: "Medicare Platform",
            image: Logo,
            url: "https://medicares.in",
            description:
              "A comprehensive healthcare management platform providing digital health records and hospital finding services.",
            priceRange: "Free",
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2000",
              bestRating: "5",
              worstRating: "1",
            },
            review: {
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
              },
              author: {
                "@type": "Person",
                name: "Dr. Rajesh Sharma",
              },
              reviewBody:
                "Being a doctor in one of Delhi's busiest hospitals, Medicare has helped me access patient records efficiently. The platform is reliable and user-friendly even during peak hours.",
            },
          })}
        </script>
      </Helmet>

      {/* Main content container with improved spacing */}
      <div className="relative flex flex-col items-center w-full max-w-full overflow-x-hidden">
        <div className="w-full pt-0 pb-8 max-w-full mx-auto">
          <div className="flex justify-center w-full bg-white dark:bg-gray-900 pb-3">
            <Navbar user={user} onLogout={handleLogout} />
          </div>

          {/* Hero Section */}
          <motion.div
            style={{ scale }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full relative -mt-2 px-5"
          >
            {/* Desktop Hero Section with improved gradients and layout */}
            <div className="hidden md:block rounded-[30px] lg:rounded-[50px] overflow-hidden bg-linear-to-r from-[#1a1f4d] via-primary to-[#2f347c] shadow-2xl h-[800px] ">
              <div className="relative ">
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
                        <h3 className="text-white/90 pl-5 text-2xl font-medium tracking-wide">
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
                        <h1
                          className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight cursor-pointer"
                          onClick={scrollToVision}
                        >
                          <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-purple-200">
                            Healthcare
                          </span>
                          <br />
                          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-200 to-purple-300">
                            Reimagined
                          </span>
                        </h1>
                        <p className="text-3xl text-white/80 font-normal">
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
                        Experience healthcare evolved. Our secure platform
                        seamlessly connects patients, doctors, and hospitals,
                        providing instant access to medical records and expert
                        care—anytime, anywhere.
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
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-white/90 text-sm font-medium">
                            Secure & Certified
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="inline-flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <span className="text-white/90 text-sm font-medium">
                            End-to-End Encrypted
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column -Image Section */}
                  <div className="relative hidden lg:flex items-end justify-center p-8">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="relative z-10 h-full flex items-end"
                    >
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/40 rounded-full filter blur-xl animate-pulse"></div>
                      <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-purple-400/40 rounded-full filter blur-xl animate-pulse animation-delay-1000"></div>

                      {/* Main image with shadow */}
                      <img
                        src={nurse}
                        alt="Healthcare Professional"
                        className="relative z-10 h-[650px] lg:h-[750px] w-auto object-contain drop-shadow-2xl filter brightness-105 translate-y-8 pt-14"
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
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Verified Records
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              10M+
                            </p>
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
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Active Users
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              500k+
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile and Tablet Hero Section - Enhanced for all device sizes */}
            <div className="md:hidden bg-linear-to-r from-primary to-[#3a3f7a] rounded-2xl overflow-hidden p-3 sm:p-4">
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
                    <h3 className="text-white pl-2 text-base font-semibold">
                      Medicare
                    </h3>
                  </div>

                  <h1 className="font-bold text-white mb-1">
                    <span className="text-x bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">
                      Healthcare
                    </span>
                    <br />
                    <span className="text-xl bg-clip-text text-transparent bg-linear-to-r from-blue-200 to-purple-300">
                      Reimagined
                    </span>
                  </h1>

                  <p className="text-white/90 text-xs mb-2 max-w-[180px] line-clamp-2">
                    A secure platform that connects patients, doctors, and
                    hospitals.
                  </p>

                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <div className="flex items-center justify-center w-3 h-3 bg-green-500 rounded-full">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90 text-[10px] font-medium">
                        Secure & Certified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-40 h-40 sm:w-24 sm:h-24">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                  <img
                    src={nurse}
                    alt="Healthcare Professional"
                    className="relative z-10 object-contain w-full h-full drop-shadow-lg mt-15px filter brightness-105 mt-6"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section - Enhanced Responsive Design */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 md:gap-6 lg:gap-10 px-5 py-4 md:py-8 mt-4 xs:mt-6 sm:mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-1 sm:col-span-2 md:col-span-1"
            >
              <Link
                to="/hospital"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#f8e5e5] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <img
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  src={HealthRecordsimage}
                  alt="Hospital"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  Hospital
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Link
                to="/doctor"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#CDEBF1] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <motion.img
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  src={FindHospitalimage}
                  alt="Doctor"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  Doctor
                </span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/medical"
                className="w-full flex items-center space-x-3 xs:space-x-4 md:justify-center bg-[#DEF1D0] rounded-xl xs:rounded-2xl md:rounded-[30px] p-3 xs:p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                 <img
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  src={HealthRecordsimage}
                  alt="Health Records"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  Medical
                </span>
              </Link>
            </motion.div>
          </motion.section>

          {/* Why Choose Medicare Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-8 my-4 md:py-10 md:my-4"
          >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <span className="inline-block px-3 py-1 text-xs md:text-sm bg-[#eef1ff] text-primary rounded-full mb-3 font-medium">
                  Why Choose Us
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">
                  Why Choose Medicare
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto font-normal">
                  We're revolutionizing healthcare management with our secure,
                  accessible, and user-friendly platform
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
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
                    title: "Secure & Certified",
                    description:
                      "Your medical data is encrypted and protected with the highest security standards. We comply with all healthcare privacy regulations.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
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
                        className="w-8 h-8 text-primary"
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
                        className="w-8 h-8 text-primary"
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
                        className="w-8 h-8 text-primary"
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
                        className="w-8 h-8 text-primary"
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
                <Link to="/aboutus">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#363b7e] shadow-md"
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

          {/* Vision Section - Enhanced */}
          <motion.section
            id="vision-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-14 my-4 md:py-8 md:my-4 bg-linear-to-b from-indigo-50 to-white"
          >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="md:order-2">
                  <div className="relative">
                    <div className="absolute inset-0 -m-10 bg-linear-to-r from-purple-500/20 to-[#252A61]/20 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        className="w-full h-auto object-cover"
                        src="https://images.unsplash.com/photo-1580281657702-257584239a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Digital healthcare"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-6 text-white">
                          <span className="text-sm bg-purple-600 py-1 px-3 rounded-full font-medium">
                            Our Vision
                          </span>
                          <h3 className="text-2xl font-bold mt-2">
                            Healthcare of Tomorrow
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:order-1">
                  <div className="inline-block mb-6 rounded-full bg-purple-100 px-4 py-1.5">
                    <span className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                      Our Vision
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    Healthcare{" "}
                    <span className="text-purple-600 italic">Reimagined</span>{" "}
                    For The Digital Age
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    We envision a future where healthcare information is easily
                    accessible, securely managed, and efficiently shared between
                    patients and healthcare providers, leading to better health
                    outcomes for all. Our platform aims to bridge the gap
                    between patients and healthcare providers, creating a
                    unified ecosystem where health information flows seamlessly.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Universal access to medical records anytime, anywhere",
                      "Simplified communication between patients and providers",
                      "Data-driven healthcare for personalized treatment plans",
                      "Elimination of administrative barriers to quality care",
                    ].map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                          <FiCheck className="w-4 h-4" />
                        </div>
                        <span className="ml-3 text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Our Services Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full py-14 my-4 md:py-10 md:my-4 bg-linear-to-b from-[#eef1ff] to-white"
          >
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">
                  Our Services
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto font-normal">
                  Comprehensive healthcare solutions designed to simplify your
                  medical journey
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Digital Health Records",
                    desc: "Securely store and manage your medical records in one place, accessible anytime.",
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Appointment Management",
                    desc: "Schedule and manage your medical appointments with ease and receive reminders.",
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    comingSoon: true,
                  },
                  {
                    title: "Digital Prescription",
                    desc: "Access and manage digital prescriptions securely, with automated reminders for medications and easy sharing with pharmacies.",
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Health Analytics",
                    desc: "Get insights into your health data and trends to make informed decisions.",
                    icon: (
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    ),
                  },
                ].map((service, index) => (
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
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                  >
                    {service.comingSoon && (
                      <>
                        <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/90 to-primary/95 backdrop-blur-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center">
                          <div className="transform scale-95 group-hover:scale-100 transition-transform duration-500 space-y-4">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25"></div>
                              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3">
                                <span className="text-white font-medium text-lg tracking-wide">
                                  Coming Soon
                                </span>
                              </div>
                            </div>
                            <p className="text-white/90 text-sm max-w-[200px] text-center px-4 mt-3">
                              We're working on bringing you seamless appointment
                              scheduling. Stay tuned!
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-linear-to-r from-blue-100 to-purple-100 text-primary border border-blue-200/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            Coming Soon
                          </span>
                        </div>
                      </>
                    )}
                    <div className="w-16 h-16 bg-[#eef1ff] rounded-full flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#252A61] mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base font-normal">
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <Link to="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#363b7e] shadow-md"
                  >
                    Explore All Services
                    <FiArrowRight className="ml-2" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.section>

          {/* Add Your Review Section - Enhanced Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-10 md:mt-12 bg-linear-to-br from-white to-gray-50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg max-w-3xl mx-auto border border-gray-100"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#252A61] mb-3">
                Share Your Experience
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Help others by sharing your experience with Medicare
              </p>
              <Link
                to="/detail-review"
                className="inline-block mt-4 text-[#252A61] hover:text-[#363b7e] text-sm font-medium"
              >
                Are you a healthcare provider? Share your detailed experience →
              </Link>
            </div>

            {submitStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name{" "}
                    {!formData.isAnonymous && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={formData.isAnonymous}
                    className={`w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#252A61] focus:border-[#252A61] transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      formData.isAnonymous
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder={
                      formData.isAnonymous ? "Anonymous" : "Enter your name"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#252A61] focus:border-[#252A61] transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select your role</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="hospital-staff">Hospital Staff</option>
                      <option value="healthcare-admin">Healthcare Admin</option>
                      <option value="medical-student">Medical Student</option>
                      <option value="medical-store">Medical Store</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`p-1 transition-all duration-200 ${
                        formData.rating >= star
                          ? "text-yellow-400 scale-110"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      <FiStar className="w-8 h-8" />
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.rating} {formData.rating === 1 ? "star" : "stars"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Experience <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.review.length}/1000 characters)
                  </span>
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  required
                  maxLength={1000}
                  rows="4"
                  className={`w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#252A61] focus:border-[#252A61] transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none ${
                    formData.review.length > 1000 ? "border-red-300" : ""
                  }`}
                  placeholder="Share your experience with Medicare... (minimum 10 characters)"
                ></textarea>
                {formData.review.length < 10 && formData.review.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please write at least 10 characters
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#252A61] border-gray-300 rounded focus:ring-[#252A61]"
                  />
                  <label
                    htmlFor="isAnonymous"
                    className="text-sm text-gray-600"
                  >
                    Submit anonymously
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full sm:w-auto px-8 py-3 bg-[#252A61] text-white font-medium rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-[#363b7e]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        {/* <FloatingActionButton /> */}
        <Footer />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Your review has been submitted successfully. It will be published after approval."
      />
    </div>
  );
};

export default Home;
