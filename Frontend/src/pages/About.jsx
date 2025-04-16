import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  FiArrowRight, FiCheck, FiPhone, FiMail, FiMapPin, FiClock, 
  FiShield, FiAward, FiUsers, FiHeart, FiSmile, FiGlobe 
} from 'react-icons/fi';
import { useAuthStore } from "../store/authStore";
import MedicareLogo from '../assets/Medicare logo.png';
import NurseImage from '../assets/nurse.png';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    quote: "Medicare has completely transformed my healthcare experience. I can access all my medical records instantly and book appointments with ease!",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote: "As a healthcare provider, Medicare has made my workflow much more efficient. Patient records are easily accessible and organized.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Peterson",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "The medication tracking feature is incredible. I never miss a dose, and my doctor can monitor my adherence remotely.",
    rating: 4
  }
];

// Stats data
const stats = [
  { number: "500K+", label: "Active Users" },
  { number: "1,200+", label: "Healthcare Partners" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" }
];

// FAQ data
const faqs = [
  {
    question: "How secure is my medical data on Medicare?",
    answer: "Medicare employs bank-level encryption and follows HIPAA compliance standards to ensure your medical data is completely secure. We implement advanced security measures including end-to-end encryption, regular security audits, and strict access controls."
  },
  {
    question: "Can I share my medical records with my doctor?",
    answer: "Yes, Medicare makes it easy to share your medical records with healthcare providers. You can grant temporary or permanent access to specific doctors or healthcare facilities, and revoke access at any time."
  },
  {
    question: "Is Medicare available on mobile devices?",
    answer: "Medicare is fully responsive and works perfectly on any mobile device. We also offer dedicated mobile apps for iOS and Android that provide additional features like offline access and push notifications."
  },
  {
    question: "How do I upload my existing medical reports?",
    answer: "You can easily upload your existing medical reports through our user-friendly interface. Simply navigate to the Upload section, select your files, add relevant details, and submit. We support various file formats including PDF, JPEG, and DICOM."
  }
];

const About = () => {
  const { user, logout } = useAuthStore();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={user} onLogout={logout} />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-[#252A61]/5 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                Revolutionizing <span className="text-[#252A61] relative">
                  Healthcare
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-[#252A61]/20 -z-10"></span>
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                At Medicare, we're on a mission to transform healthcare through technology, 
                placing patients at the center of their medical journey with security, 
                transparency, and ease of access.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  to="/signup" 
                  className="px-8 py-3.5 bg-[#252A61] text-white rounded-full text-lg font-medium hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                >
                  Join Medicare
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 bg-white border-2 border-[#252A61] text-[#252A61] rounded-full text-lg font-medium hover:bg-[#252A61]/5 transition-all duration-300 flex items-center"
                >
                  Explore Features
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-300/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-300/20 rounded-full filter blur-3xl"></div>
              <img 
                src={NurseImage} 
                alt="Healthcare Professional" 
                className="w-full h-auto object-cover rounded-2xl shadow-2xl relative z-10 transform -rotate-2"
              />
              <div className="absolute top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20 transform rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure & Private</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20 transform -rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-[#252A61] mb-2">{stat.number}</h2>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Mission & Vision
            </h2>
            <div className="w-24 h-1 bg-[#252A61] mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              We're committed to making healthcare more accessible, transparent, and patient-centered.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-blue-600"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center mx-auto mb-6">
                  <FiHeart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  At Medicare, we're dedicated to revolutionizing healthcare management
                  by providing a seamless, secure, and user-friendly platform for
                  managing medical records and healthcare services. We believe that everyone
                  deserves access to efficient, transparent healthcare information.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <FiUsers className="text-blue-500" />, text: "Patient-centered approach in everything we do" },
                    { icon: <FiShield className="text-blue-500" />, text: "Implementing the highest security standards for your data" },
                    { icon: <FiGlobe className="text-blue-500" />, text: "Making healthcare accessible to everyone, everywhere" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3">{item.icon}</div>
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-purple-600"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center mx-auto mb-6">
                  <FiSmile className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  We envision a future where healthcare information is easily accessible,
                  securely managed, and efficiently shared between patients and healthcare
                  providers, leading to better health outcomes for all. Our platform aims to
                  bridge the gap between patients and healthcare providers, creating a unified ecosystem 
                  where health information flows seamlessly.
                </p>
                <div className="relative p-6 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                    <FiAward className="text-purple-600 w-5 h-5" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "Our goal is to empower patients with their own health data and make healthcare 
                    more transparent, accessible and efficient for everyone."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <div className="w-24 h-1 bg-[#252A61] mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              The principles that guide everything we do at Medicare
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              { 
                icon: <FiShield className="w-8 h-8 text-indigo-600" />,
                title: "Security", 
                desc: "We prioritize the privacy and security of your medical data above all else." 
              },
              { 
                icon: <FiAward className="w-8 h-8 text-blue-600" />,
                title: "Excellence", 
                desc: "We strive for excellence in every aspect of our service and support." 
              },
              { 
                icon: <FiUsers className="w-8 h-8 text-green-600" />,
                title: "Patient-Centric", 
                desc: "Every feature we build is designed with patients' needs in mind." 
              },
              { 
                icon: <FiHeart className="w-8 h-8 text-red-600" />,
                title: "Compassion", 
                desc: "We approach healthcare with empathy and understanding for all users." 
              },
              { 
                icon: <FiGlobe className="w-8 h-8 text-yellow-600" />,
                title: "Accessibility", 
                desc: "Making healthcare data available to everyone, whenever they need it." 
              },
              { 
                icon: <FiCheck className="w-8 h-8 text-teal-600" />,
                title: "Integrity", 
                desc: "We maintain the highest ethical standards in everything we do." 
              }
            ].map((value, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center mb-4 shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <div className="w-24 h-1 bg-[#252A61] mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              Real experiences from patients and healthcare providers using Medicare
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#252A61]/10 rounded-full filter blur-xl z-0"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl z-0"></div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 relative z-10"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <img 
                        src={testimonials[activeTestimonial].image} 
                        alt={testimonials[activeTestimonial].name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-5 h-5 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl italic mb-4">
                        "{testimonials[activeTestimonial].quote}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {testimonials[activeTestimonial].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {testimonials[activeTestimonial].role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeTestimonial === index ? 'bg-[#252A61] w-6' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label={`View testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-[#252A61] mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              Common questions about Medicare and our services
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-[#252A61] transform transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-[#252A61] to-[#3b3b98] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-blue-100 mb-8">
                Have questions about Medicare or need assistance? Our support team is here to help.
                Feel free to reach out to us anytime.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FiPhone className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Call us at</p>
                    <p className="text-lg font-medium">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FiMail className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Email us at</p>
                    <p className="text-lg font-medium">support@medicare.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FiMapPin className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Visit our office</p>
                    <p className="text-lg font-medium">123 Healthcare Avenue, Medical District</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <FiClock className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Office hours</p>
                    <p className="text-lg font-medium">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <img 
                  src={MedicareLogo} 
                  alt="Medicare Logo" 
                  className="h-16 mx-auto filter brightness-0 invert opacity-80" 
                />
                <h3 className="text-2xl font-bold mt-4">Join Medicare Today</h3>
                <p className="text-blue-200 mt-2">Start managing your healthcare with ease</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <FiCheck className="text-green-400 w-5 h-5" />
                    </div>
                    <p className="text-lg">Secure health record storage</p>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <FiCheck className="text-green-400 w-5 h-5" />
                    </div>
                    <p className="text-lg">24/7 access to your medical data</p>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <FiCheck className="text-green-400 w-5 h-5" />
                    </div>
                    <p className="text-lg">Easy sharing with healthcare providers</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  to="/signup" 
                  className="block w-full py-4 bg-white text-[#252A61] rounded-xl text-center font-bold text-lg hover:bg-blue-50 transition-colors"
                >
                  Create Free Account
                </Link>
                <p className="text-center text-blue-200 text-sm mt-4">
                  Already have an account? <Link to="/login" className="text-white underline">Sign in</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src={MedicareLogo} 
                alt="Medicare Logo" 
                className="h-12 mb-4 filter brightness-0 invert" 
              />
              <p className="text-gray-400 mb-4">
                Revolutionizing healthcare through technology and putting patients at the center of their medical journey.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.022A9.578 9.578 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.48A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/health-records" className="text-gray-400 hover:text-white transition-colors">Health Records</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/upload" className="text-gray-400 hover:text-white transition-colors">Upload Reports</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and health tips.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none flex-1"
                />
                <button className="bg-[#252A61] text-white px-4 py-2 rounded-r-lg hover:bg-[#3b3b98] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Medicare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;