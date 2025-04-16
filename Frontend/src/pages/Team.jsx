import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from "../store/authStore";
import { FiLinkedin, FiGithub, FiMail, FiTwitter, FiGlobe } from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import MedicareLogo from '../assets/Medicare logo.png';

const Team = () => {
  const { user, logout } = useAuthStore();
  
  // Team members data - founder info
  const teamMembers = [
    {
      id: 1,
      name: 'Karan Gupta',
      role: 'Founder & CEO',
      title: 'Full Stack Developer',
      bio: 'Passionate about healthcare technology and committed to creating innovative solutions that improve patient care and medical record management. Specialized in building secure, scalable, and user-friendly healthcare applications.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS', 'Healthcare IT'],
      image: '/founder.jpg', // Replace with your image when available
      socialLinks: {
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername',
        email: 'founder@medicare.com',
        twitter: 'https://twitter.com/yourhandle',
        website: 'https://yourwebsite.com'
      }
    }
  ];
  
  // Future team sections - currently shown as "Coming Soon"
  const teamSections = [
    {
      title: 'Development Team',
      description: 'Our talented developers work on creating and maintaining the Medicare platform, ensuring it remains secure, efficient, and user-friendly.',
      comingSoon: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    },
    {
      title: 'Medical Advisors',
      description: 'Experienced healthcare professionals who provide guidance on medical best practices and ensure our platform meets the needs of patients and providers.',
      comingSoon: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    },
    {
      title: 'Customer Support',
      description: 'Dedicated specialists who help users navigate the Medicare platform and resolve any issues they might encounter.',
      comingSoon: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    }
  ];
  
  // Technology stack data
  const techStack = [
    {
      name: 'React',
      icon: <SiReact className="text-[#61DAFB] text-4xl" />,
      description: 'A JavaScript library for building user interfaces with component-based architecture. React enables efficient updates and rendering through its virtual DOM implementation.',
      usage: 'Powers our entire frontend with reusable components, React Router for navigation, and state management for a seamless user experience.',
      features: ['Component-based architecture', 'Virtual DOM', 'JSX syntax', 'Unidirectional data flow', 'React Router']
    },
    {
      name: 'Node.js',
      icon: <SiNodedotjs className="text-[#339933] text-4xl" />,
      description: 'A JavaScript runtime built on Chrome\'s V8 engine that allows executing JavaScript on the server-side, enabling a unified language across the full stack.',
      usage: 'Handles our server implementation, API routing, business logic, authentication flows, and real-time communication.',
      features: ['Non-blocking I/O', 'Event-driven architecture', 'NPM ecosystem', 'Asynchronous processing', 'Microservices support']
    },
    {
      name: 'MongoDB',
      icon: <SiMongodb className="text-[#47A248] text-4xl" />,
      description: 'A NoSQL document database that uses flexible JSON-like documents instead of traditional table-based relational data, providing high scalability and performance.',
      usage: 'Stores all healthcare data including patient records, hospital information, medical reports, and user credentials with advanced encryption.',
      features: ['Document-oriented', 'Schema flexibility', 'Horizontal scaling', 'Aggregation framework', 'Indexing']
    },
    {
      name: 'Express',
      icon: <SiExpress className="text-gray-700 dark:text-gray-300 text-4xl" />,
      description: 'A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications with a focus on APIs.',
      usage: 'Creates our RESTful API endpoints, implements middleware for authentication, error handling, and request processing.',
      features: ['Middleware support', 'Routing', 'Template engines', 'Error handling', 'HTTP utility methods']
    },
    {
      name: 'TailwindCSS',
      icon: <SiTailwindcss className="text-[#06B6D4] text-4xl" />,
      description: 'A utility-first CSS framework that helps build custom designs without leaving your HTML, providing low-level utility classes that can be composed to create any design.',
      usage: 'Delivers consistent design across the platform with responsive layouts, dark mode support, and customized components.',
      features: ['Utility-first approach', 'Responsive design', 'Dark mode', 'Component extraction', 'JIT compiler']
    },
    {
      name: 'AWS',
      icon: <FaAws className="text-[#FF9900] text-4xl" />,
      description: 'Amazon Web Services is a cloud platform offering over 200 fully featured services from data centers globally, providing computing power, storage, and security solutions.',
      usage: 'Hosts our application with EC2, stores medical records in S3 with encryption, uses RDS for database backups, and implements CloudFront for content delivery.',
      features: ['Amazon S3', 'EC2 instances', 'CloudFront CDN', 'Lambda functions', 'IAM security']
    }
  ];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // CSS classes for architecture components
  const architectureStyles = {
    card: "rounded-lg border p-4 transition-all duration-300 shadow-md hover:shadow-lg",
    title: "text-lg font-bold mb-2",
    subtitle: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
    text: "text-xs text-gray-600 dark:text-gray-400",
    badge: "px-2.5 py-0.5 rounded-full text-xs font-medium",
    connector: "absolute h-px w-8 bg-gradient-to-r from-blue-500 to-purple-500",
    folder: "flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-1",
    folderIcon: "h-3.5 w-3.5 text-blue-500 dark:text-blue-400"
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Centered Navbar */}
      <div className="flex justify-center w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container max-w-7xl">
          <Navbar user={user} onLogout={logout} />
        </div>
      </div>
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meet The <span className="text-[#252A61]">Team</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The innovative minds behind Medicare's mission to revolutionize healthcare management
            </p>
          </motion.div>
          
          {/* Main founder section - enhanced with better UI */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-gradient-to-br from-[#252A61] to-[#6236FF] md:w-96 flex items-center justify-center p-10">
                  <div className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm p-2 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {/* Replace with your actual image */}
                      <img 
                        src={MedicareLogo} 
                        alt="Karan Gupta" 
                        className="object-cover w-full h-full" 
                      />
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 md:pt-12">
                  <div className="uppercase tracking-wide text-sm text-[#252A61] dark:text-[#8B8FD9] font-semibold">
                    {teamMembers[0].role}
                  </div>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {teamMembers[0].name}
                  </h2>
                  <div className="mt-1 text-xl text-gray-600 dark:text-gray-300">
                    {teamMembers[0].title}
                  </div>
                  
                  <div className="mt-6 relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#252A61] to-[#6236FF] rounded-full"></div>
                    <p className="pl-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {teamMembers[0].bio}
                    </p>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Expertise & Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers[0].skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-[#252A61] hover:text-white transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-start space-x-4">
                    <a 
                      href={teamMembers[0].socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#252A61] hover:text-white dark:hover:bg-[#252A61] transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <FiLinkedin />
                    </a>
                    <a 
                      href={teamMembers[0].socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#252A61] hover:text-white dark:hover:bg-[#252A61] transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <FiGithub />
                    </a>
                    <a 
                      href={`mailto:${teamMembers[0].socialLinks.email}`} 
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#252A61] hover:text-white dark:hover:bg-[#252A61] transition-colors"
                      aria-label="Email Contact"
                    >
                      <FiMail />
                    </a>
                    <a 
                      href={teamMembers[0].socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#252A61] hover:text-white dark:hover:bg-[#252A61] transition-colors"
                      aria-label="Twitter Profile"
                    >
                      <FiTwitter />
                    </a>
                    <a 
                      href={teamMembers[0].socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#252A61] hover:text-white dark:hover:bg-[#252A61] transition-colors"
                      aria-label="Personal Website"
                    >
                      <FiGlobe />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Technology Stack Section - NEW */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our <span className="text-[#252A61]">Technology Stack</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Medicare is built with cutting-edge technologies to ensure security, performance, and scalability
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                  <div className="mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tech.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{tech.description}</p>
                  <div className="mt-auto">
                    <div className="text-sm font-medium text-[#252A61] dark:text-[#8B8FD9] bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <span className="font-semibold">How we use it:</span> {tech.usage}
                    </div>
                    <ul className="mt-3 space-y-1 text-gray-600 dark:text-gray-400">
                      {tech.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-[#252A61] dark:text-[#8B8FD9]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Project Overview - ENHANCED UI with Real Architecture Diagram based on actual folder structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col">
              {/* Architecture Diagram Header */}
              <div className="w-full bg-gradient-to-r from-[#252A61] to-[#6236FF] p-8 text-center">
                <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
                  Medicare Architecture
                </span>
                <h2 className="text-3xl font-bold text-white mb-4">Project Structure</h2>
                <p className="text-white/90 max-w-3xl mx-auto text-lg">
                  A comprehensive view of our codebase organization and infrastructure
                </p>
              </div>
              
              {/* Visual Architecture Diagram */}
              <div className="p-8 md:p-10">
                <div className="w-full overflow-hidden">
                  <div className="architecture-diagram relative grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    {/* FRONTEND SECTION */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200 dark:border-blue-800/50 p-6 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Frontend (React + Vite)</h3>
                        <div className="ml-auto flex space-x-2">
                          <span className={`${architectureStyles.badge} bg-[#61DAFB]/20 text-[#61DAFB] border border-[#61DAFB]/30`}>React</span>
                          <span className={`${architectureStyles.badge} bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800`}>Vite</span>
                          <span className={`${architectureStyles.badge} bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30`}>TailwindCSS</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Components</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            components/
                          </div>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-1">
                            <li>Navbar.jsx</li>
                            <li>DashboardLayout.jsx</li>
                            <li>Loading.jsx</li>
                            <li>LogoutModal.jsx</li>
                            <li>PhotoEditorModal.jsx</li>
                            <li>QRCodeModal.jsx</li>
                          </ul>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800 md:col-span-2`}>
                          <div className={architectureStyles.title}>Pages</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className={architectureStyles.folder}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                                pages/
                              </div>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-1">
                                <li>Home.jsx</li>
                                <li>About.jsx</li>
                                <li>About2.jsx</li>
                                <li>Team.jsx</li>
                                <li>Login.jsx</li>
                                <li>Signup.jsx</li>
                                <li>ForgotPassword.jsx</li>
                                <li>ResetPassword.jsx</li>
                                <li>VerifyEmail.jsx</li>
                                <li>NotFound.jsx</li>
                                <li>Settings.jsx</li>
                                <li>WorkingOnIt.jsx</li>
                              </ul>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <div className={architectureStyles.folder}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                  </svg>
                                  User/
                                </div>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                  <li>Dashboard.jsx</li>
                                  <li>Profile.jsx</li>
                                  <li>Reports.jsx</li>
                                  <li>Notifications.jsx</li>
                                  <li>Upload.jsx</li>
                                  <li>UserDetails.jsx</li>
                                </ul>
                              </div>
                              
                              <div>
                                <div className={architectureStyles.folder}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                  </svg>
                                  Hospital/
                                </div>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                                  <li>HospitalDashboard.jsx</li>
                                </ul>
                              </div>
                              
                              <div>
                                <div className={architectureStyles.folder}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                  </svg>
                                  Admin/ & Medical/
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                                  Future administration and medical staff modules
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>State Management</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            store/
                          </div>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-1">
                            <li>authStore.js</li>
                          </ul>
                          <div className="mt-4">
                            <div className={architectureStyles.subtitle}>Key Features</div>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                              <li>• Global Authentication State</li>
                              <li>• User Profile Management</li>
                              <li>• Session Persistence</li>
                              <li>• Role-based Access Control</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Assets & Utils</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            assets/
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 ml-4 mb-2">
                            <div className="mt-1">Medicare logo.png</div>
                            <div>Dashboard.png</div>
                            <div>HealthRecords.png</div>
                            <div>FindHospital.png</div>
                            <div>user.png, nurse.png...</div>
                          </div>
                          
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            utils/
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                            date.js - Date formatting utilities
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-center mt-6 text-blue-800 dark:text-blue-300 font-medium">
                        ↓ HTTP/API Requests ↓
                      </div>
                    </div>
                  
                    {/* BACKEND SECTION */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200 dark:border-purple-800/50 p-6 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Backend (Node.js + Express)</h3>
                        <div className="ml-auto flex space-x-2">
                          <span className={`${architectureStyles.badge} bg-[#339933]/10 text-[#339933] border border-[#339933]/30`}>Node.js</span>
                          <span className={`${architectureStyles.badge} bg-gray-100 text-gray-700 dark:bg-gray-700/70 dark:text-gray-300 border border-gray-200 dark:border-gray-600`}>Express</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>API Routes</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            routes/
                          </div>
                          
                          <div className="ml-4 mt-2 space-y-2">
                            <div>
                              <div className="text-xs font-medium text-purple-700 dark:text-purple-400">auth.routes.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                /api/auth/register, /api/auth/login, /api/auth/verify
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-purple-700 dark:text-purple-400">notifications.routes.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                /api/notifications, /api/notifications/:id
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-purple-700 dark:text-purple-400">reports.routes.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                /api/reports, /api/reports/:id
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-purple-700 dark:text-purple-400">Hospital/hospital.routes.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                /api/hospital/dashboard, /api/hospital/patients
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Admin/ & Medical/ & User/</span>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                Role-specific API endpoints
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Controllers</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            controllers/
                          </div>
                          
                          <div className="ml-4 mt-2 space-y-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400">auth.controller.js</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">notifications.controller.js</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">reports.controller.js</div>
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Hospital/hospital.controller.js</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Admin/ & Medical/ & User/</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Middleware</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            middleware/
                          </div>
                          
                          <div className="ml-4 mt-2">
                            <div className="text-xs text-gray-600 dark:text-gray-400">verifyToken.js</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-2">
                              • JWT Validation<br />
                              • Role-based Authentication<br />
                              • Request Validation
                            </div>
                            <div className="mt-2 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Admin/ & Hospital/ & Medical/ & User/</span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 ml-5">
                              Role-specific middleware
                            </div>
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Utils & Services</div>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <div className={architectureStyles.folder}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                                utils/
                              </div>
                              <div className="ml-4 text-xs text-gray-600 dark:text-gray-400">
                                <div>generateTokenAndsendcookie.js</div>
                                <div>socket.js</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className={architectureStyles.folder}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                                services/
                              </div>
                              <div className="ml-4 text-xs text-gray-600 dark:text-gray-400">
                                <div>s3.service.js</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    {/* DATABASE SECTION */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200 dark:border-green-800/50 p-6 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Database (MongoDB)</h3>
                        <div className="ml-auto flex space-x-2">
                          <span className={`${architectureStyles.badge} bg-[#47A248]/10 text-[#47A248] border border-[#47A248]/30`}>MongoDB</span>
                          <span className={`${architectureStyles.badge} bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30`}>Mongoose</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Database Configuration</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            DB/db.js
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-2">
                            • MongoDB Connection<br />
                            • Error Handling<br />
                            • Connection Pooling
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Models</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            models/
                          </div>
                          
                          <div className="ml-4 mt-2 space-y-3">
                            <div>
                              <div className="text-xs font-medium text-green-700 dark:text-green-400">user.model.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                User schema with authentication fields
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-green-700 dark:text-green-400">report.model.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                Medical reports with file references
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-green-700 dark:text-green-400">notification.model.js</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                System notifications and alerts
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                            <div className="text-xs font-medium text-green-700 dark:text-green-400">Schema Example (simplified):</div>
                            <pre className="text-xs text-gray-600 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded overflow-x-auto">
{`const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "hospital", "medical", "admin"],
    default: "user" 
  },
  isVerified: { type: Boolean, default: false },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }]
}, { timestamps: true });`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* EMAIL & CLOUD SERVICES SECTION */}
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-xl border border-yellow-200 dark:border-yellow-800/50 p-6 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">Email & Cloud Services</h3>
                        <div className="ml-auto flex space-x-2">
                          <span className={`${architectureStyles.badge} bg-[#FF9900]/10 text-[#FF9900] border border-[#FF9900]/30`}>AWS</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>S3 Integration</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            services/s3.service.js
                          </div>
                          
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-2">
                            • Upload Medical Records<br />
                            • Secure File Storage<br />
                            • Access Control<br />
                            • File Encryption
                          </div>
                          
                          <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 rounded p-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="font-medium text-yellow-800 dark:text-yellow-300">Implementation:</div>
                            S3 buckets store patient medical records, hospital documentation, and system backups with proper access controls and encryption at rest.
                          </div>
                        </div>
                        
                        <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                          <div className={architectureStyles.title}>Email Service</div>
                          <div className={architectureStyles.folder}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            emails/
                          </div>
                          
                          <div className="ml-4 mt-2 space-y-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400">email.config.js</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">emails.js</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">emailTemplates.js</div>
                          </div>
                          
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-3 ml-2">
                            • Welcome Emails<br />
                            • Verification<br />
                            • Password Reset<br />
                            • Notifications
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Realtime Communication */}
                  <div className="mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-6 shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300">Real-time Communication</h3>
                      <div className="ml-auto flex space-x-2">
                        <span className={`${architectureStyles.badge} bg-[#CC6699]/10 text-[#CC6699] border border-[#CC6699]/30`}>Socket.io</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                        <div className={architectureStyles.title}>WebSocket Integration</div>
                        <div className={architectureStyles.folder}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={architectureStyles.folderIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                          utils/socket.js
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-2">
                          Socket.io server configuration and event handlers
                        </div>
                        
                        <pre className="text-xs text-gray-600 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded overflow-x-auto">
{`// Simplified socket.io implementation
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  
  socket.on('newNotification', (data) => {
    socket.to(data.recipientId).emit(
      'notification', data
    );
  });
});`}
                        </pre>
                      </div>
                      
                      <div className={`${architectureStyles.card} bg-white dark:bg-gray-800 md:col-span-2`}>
                        <div className={architectureStyles.title}>Real-time Features</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-900/30">
                            <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Instant Notifications</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Real-time alerts for new reports, messages, and appointments
                            </div>
                          </div>
                          
                          <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-900/30">
                            <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Live Status Updates</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Report processing status and doctor availability indicators
                            </div>
                          </div>
                          
                          <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-900/30">
                            <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Connected User Sessions</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Multi-device user session management and synchronization
                            </div>
                          </div>
                          
                          <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-900/30">
                            <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Secure Room-based Communication</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Private channels for doctor-patient and inter-hospital communications
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Authentication Flow */}
                  <div className="mt-10 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Authentication Flow</h3>
                    <div className="overflow-x-auto">
                      <div className="inline-flex items-start min-w-[800px]">
                        {/* Auth Flow Steps */}
                        <div className="flex-1 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="text-center font-medium text-blue-800 dark:text-blue-300">Frontend</div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            User enters credentials in Login.jsx
                          </div>
                        </div>
                        
                        <div className="mx-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                          <div className="text-center font-medium text-purple-800 dark:text-purple-300">API Routes</div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            auth.routes.js processes request
                          </div>
                        </div>
                        
                        <div className="mx-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                          <div className="text-center font-medium text-purple-800 dark:text-purple-300">Authentication</div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            generateTokenAndSendCookie.js creates JWT
                          </div>
                        </div>
                        
                        <div className="mx-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <div className="text-center font-medium text-green-800 dark:text-green-300">Database</div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            User data validated and retrieved
                          </div>
                        </div>
                        
                        <div className="mx-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="text-center font-medium text-blue-800 dark:text-blue-300">Client Storage</div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            authStore.js updates global state
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Server Configuration */}
                  <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 rounded-xl border border-red-200 dark:border-red-800/50 p-6 shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Server Configuration</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                        <div className={architectureStyles.title}>Entry Point</div>
                        <div className="flex items-center gap-1 text-sm text-red-700 dark:text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          server.js
                        </div>
                        
                        <pre className="text-xs text-gray-600 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded overflow-x-auto">
{`// Simplified server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./DB/db');
const authRoutes = require('./routes/auth.routes');
const reportsRoutes = require('./routes/reports.routes');
const notificationRoutes = require('./routes/notifications.routes');
const hospitalRoutes = require('./routes/Hospital/hospital.routes');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hospital', hospitalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);`}
                        </pre>
                      </div>
                      
                      <div className={`${architectureStyles.card} bg-white dark:bg-gray-800`}>
                        <div className={architectureStyles.title}>Deployment Configuration</div>
                        <div className="flex items-center gap-1 text-sm text-red-700 dark:text-red-400 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          package.json & vercel.json
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <div className="font-medium">Backend Dependencies:</div>
                          <div className="mt-1 grid grid-cols-2 gap-1">
                            <div>• express</div>
                            <div>• mongoose</div>
                            <div>• jsonwebtoken</div>
                            <div>• bcryptjs</div>
                            <div>• cookie-parser</div>
                            <div>• cors</div>
                            <div>• dotenv</div>
                            <div>• socket.io</div>
                            <div>• aws-sdk</div>
                            <div>• nodemailer</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                          <div className="font-medium">Frontend Dependencies:</div>
                          <div className="mt-1 grid grid-cols-2 gap-1">
                            <div>• react</div>
                            <div>• react-router-dom</div>
                            <div>• framer-motion</div>
                            <div>• tailwindcss</div>
                            <div>• socket.io-client</div>
                            <div>• zustand</div>
                            <div>• react-icons</div>
                            <div>• axios</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technology Badges */}
                  <div className="flex flex-wrap justify-center gap-3 mt-10">
                    <span className="tech-badge bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/30 px-3 py-1.5 rounded-full text-sm font-medium">React</span>
                    <span className="tech-badge bg-[#339933]/10 text-[#339933] border-[#339933]/30 px-3 py-1.5 rounded-full text-sm font-medium">Node.js</span>
                    <span className="tech-badge bg-[#47A248]/10 text-[#47A248] border-[#47A248]/30 px-3 py-1.5 rounded-full text-sm font-medium">MongoDB</span>
                    <span className="tech-badge bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">Express</span>
                    <span className="tech-badge bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30 px-3 py-1.5 rounded-full text-sm font-medium">TailwindCSS</span>
                    <span className="tech-badge bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/30 px-3 py-1.5 rounded-full text-sm font-medium">AWS</span>
                    <span className="tech-badge bg-[#CC6699]/10 text-[#CC6699] border-[#CC6699]/30 px-3 py-1.5 rounded-full text-sm font-medium">Socket.io</span>
                    <span className="tech-badge bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 px-3 py-1.5 rounded-full text-sm font-medium">Mongoose</span>
                    <span className="tech-badge bg-[#8DD6F9]/10 text-[#8DD6F9] border-[#8DD6F9]/30 px-3 py-1.5 rounded-full text-sm font-medium">Vite</span>
                    <span className="tech-badge bg-[#764ABC]/10 text-[#764ABC] border-[#764ABC]/30 px-3 py-1.5 rounded-full text-sm font-medium">Zustand</span>
                  </div>
                </div>
              </div>
              
              {/* Key Features Section - ENHANCED REALISTIC DESIGN */}
              <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 py-16">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#252A61] to-[#6236FF]">
                        Key Features
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                      Medicare combines advanced technology with user-centered design to revolutionize healthcare record management and accessibility.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {/* Feature 1 - QR-Based Medical Records */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">QR-Based Medical Records</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Access your complete medical history instantly through a secure, personalized QR code. Share with healthcare providers for immediate access to your health information.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Instant Access
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Secure Sharing
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            QR Technology
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                            Learn how QR codes work
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature 2 - Hospital Dashboard */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Hospital Management</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Specialized dashboard for hospitals to manage patient records, appointments, and treatment plans. Track patient history and generate comprehensive medical reports.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Patient Management
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Report Generation
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1">
                            View hospital dashboard
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature 3 - User-Controlled Access */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-green-50 dark:bg-green-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">User-Controlled Access</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Full control over who can access your medical records. Grant and revoke access permissions for healthcare providers with detailed access logs for complete transparency.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Permission Controls
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Access Logs
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Privacy
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1">
                            Manage access permissions
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature 4 - Real-time Notifications */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-red-50 dark:bg-red-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Notifications</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Receive instant alerts for new reports, appointments, and record access events. Stay informed about your healthcare journey with customizable notification preferences.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            Instant Alerts
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            Customizable
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            Socket.io
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1">
                            Configure notifications
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature 5 - Secure File Upload */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure File Upload</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Easily upload medical reports, prescriptions, and test results. All files are encrypted and securely stored in AWS S3 with strict access controls and compliance measures.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                            End-to-End Encryption
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                            AWS S3
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium flex items-center gap-1">
                            Upload medical documents
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature 6 - Role-Based Access */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div className="rounded-full w-14 h-14 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Role-Based Access Control</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        Tailored interfaces for patients, hospitals, medical professionals, and administrators. Each role has specific permissions and capabilities designed for their needs.
                      </p>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            User Roles
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            Custom Dashboards
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            Permission Levels
                          </span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                            Explore role features
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Feature Comparison */}
                  <div className="mt-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-[#252A61]/10 to-[#6236FF]/10 dark:from-[#252A61]/20 dark:to-[#6236FF]/20">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">How Medicare Compares</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        See how Medicare stands out against traditional health record systems
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300">
                          <tr>
                            <th className="px-6 py-4 font-medium">Features</th>
                            <th className="px-6 py-4 font-medium">Medicare</th>
                            <th className="px-6 py-4 font-medium">Traditional EMR</th>
                            <th className="px-6 py-4 font-medium">Paper Records</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                            <td className="px-6 py-4 font-medium">Patient Access</td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Instant &amp; Mobile
                              </div>
                            </td>
                            <td className="px-6 py-4 text-yellow-600 dark:text-yellow-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Limited Access
                              </div>
                            </td>
                            <td className="px-6 py-4 text-red-600 dark:text-red-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                In-Person Only
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                            <td className="px-6 py-4 font-medium">Data Security</td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                End-to-End Encryption
                              </div>
                            </td>
                            <td className="px-6 py-4 text-yellow-600 dark:text-yellow-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Basic Encryption
                              </div>
                            </td>
                            <td className="px-6 py-4 text-red-600 dark:text-red-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Physical Security Only
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                            <td className="px-6 py-4 font-medium">Sharing Capability</td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                One-click QR Sharing
                              </div>
                            </td>
                            <td className="px-6 py-4 text-yellow-600 dark:text-yellow-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Complex Permissions
                              </div>
                            </td>
                            <td className="px-6 py-4 text-red-600 dark:text-red-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Physical Copy Only
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                            <td className="px-6 py-4 font-medium">Real-time Updates</td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Instant Notifications
                              </div>
                            </td>
                            <td className="px-6 py-4 text-yellow-600 dark:text-yellow-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Delayed Updates
                              </div>
                            </td>
                            <td className="px-6 py-4 text-red-600 dark:text-red-400">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Manual Updates Only
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Call-to-Action */}
                  <div className="mt-16 text-center">
                    <div className="inline-block rounded-lg bg-gradient-to-r from-[#252A61] to-[#6236FF] p-0.5">
                      <button className="px-8 py-3 rounded-lg bg-white dark:bg-gray-900 font-medium text-[#6236FF] dark:text-[#8B6FFF] hover:bg-transparent hover:text-white transition-all">
                        Get Started with Medicare
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Join thousands of users already managing their health records securely
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Section - Keep existing code */}
              <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-10">
                <div className="flex items-center mb-10">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#252A61] to-[#6236FF] rounded-full mr-4"></div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Key Features</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Feature Cards with Enhanced UI */}
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#252A61]/10 to-[#6236FF]/20 rounded-bl-3xl"></div>
                    <div className="w-14 h-14 rounded-2xl bg-[#252A61]/10 dark:bg-[#252A61]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Electronic Health Records</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Secure, centralized storage for medical history, lab results, medications, and diagnoses.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        End-to-end encryption
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Selective sharing permissions
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Document scanning capabilities
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#252A61]/10 to-[#6236FF]/20 rounded-bl-3xl"></div>
                    <div className="w-14 h-14 rounded-2xl bg-[#252A61]/10 dark:bg-[#252A61]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Appointment Management</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Smart scheduling system with calendar integration and multi-platform reminders.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Video consultation integration
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        SMS & email notifications
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Custom recurrence patterns
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#252A61]/10 to-[#6236FF]/20 rounded-bl-3xl"></div>
                    <div className="w-14 h-14 rounded-2xl bg-[#252A61]/10 dark:bg-[#252A61]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure Messaging</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">HIPAA-compliant encrypted communication between patients and providers.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        File attachment support
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Message categorization
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Emergency priority flagging
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#252A61]/10 to-[#6236FF]/20 rounded-bl-3xl"></div>
                    <div className="w-14 h-14 rounded-2xl bg-[#252A61]/10 dark:bg-[#252A61]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#252A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Patient Portal</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">A user-friendly interface for patients to access their health records, appointments, and communicate with providers.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Easy navigation
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Secure login
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Real-time updates
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Team;