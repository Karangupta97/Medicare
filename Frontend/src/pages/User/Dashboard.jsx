import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import QRCodeModal from "../../components/QRCodeModal";
import PrescriptionCard from "../../components/User/DigitalPrescriptionCard";
import { io } from "socket.io-client";
import MedicareLogo from "../../assets/logo/logo.png";
import {
  FiFileText,
  FiCheckCircle,
  FiUpload,
  FiSearch,
  FiRefreshCw,
  FiCreditCard,
  FiDownload,
  FiCalendar,
  FiShield,
  FiClock,
  FiBell,
  FiAlertTriangle,
  FiEye,
  FiChevronRight,
  FiHeart,
  FiSettings,
  FiArrowRight,
  FiHelpCircle,
  FiTarget,
  FiLayers,
  FiGrid,
  FiX,
  FiClipboard
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [prescriptions, setPrescriptions] = useState([]);
  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Upload Document', icon: <FiUpload />, path: '/upload', color: 'blue' },
    { id: 2, title: 'Schedule Appointment', icon: <FiCalendar />, path: '/appointments/new', color: 'green' },
    { id: 3, title: 'Find Doctor', icon: <FiSearch />, path: '/doctors', color: 'purple' },
    { id: 4, title: 'View Health Records', icon: <FiFileText />, path: '/reports', color: 'orange' },
  ]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  // Fetch data function
  const fetchDashboardData = async () => {
    try {
      await Promise.all([fetchNotifications(), fetchReports()]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Could not load your dashboard information');
      toast.error('Error loading dashboard information');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch real notifications from the API
  const fetchNotifications = async () => {
    try {
      if (!token) return;
      
      const response = await axios.get('/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.notifications) {
        // Format notifications for display
        const formattedNotifications = response.data.notifications.map(notification => ({
          id: notification._id,
          type: mapNotificationType(notification.type),
          message: notification.message,
          title: notification.title || '',
          time: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }),
          read: notification.read,
          link: notification.link,
          createdAt: notification.createdAt
        }));
        
        setNotifications(formattedNotifications);
        
        // Set unread count
        if (response.data.unreadCount !== undefined) {
          setUnreadNotificationsCount(response.data.unreadCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Don't set any fake notifications here - we'll just show "No notifications"
    }
  };

  // Fetch reports from the API
  const fetchReports = async () => {
    try {
      if (!token) return;

      const response = await axios.get('/api/reports', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.reports) {
        // Sort reports by creation date (newest first)
        const sortedReports = response.data.reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(sortedReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error loading reports');
    }
  };

  // Helper function to map backend notification types to UI types
  const mapNotificationType = (type) => {
    switch(type) {
      case 'info': return 'report';
      case 'warning': return 'reminder';
      case 'success': return 'appointment';
      case 'error': return 'reminder';
      default: return 'report';
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (id) => {
    try {
      if (!token) return;
      
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      // Update unread count
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      if (!token) return;
      
      await axios.put('/api/notifications/mark-all-read', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
      
      // Reset unread count
      setUnreadNotificationsCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up interval to refresh notifications every 30 seconds
    const notificationInterval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  // Add WebSocket connection for real-time updates
  useEffect(() => {
    if (!token || !user?._id) return;
  
    console.log('Setting up WebSocket connection for notifications');
    
    // Use environment variable or fallback to detected URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || 
                      (window.location.hostname === 'localhost' 
                        ? `http://localhost:4000`
                        : window.location.protocol === 'https:' 
                          ? 'https://medicare-backend-pdci8.ondigitalocean.app'
                          : 'http://medicare-backend-pdci8.ondigitalocean.app');
    
    console.log('Attempting WebSocket connection to:', apiBaseUrl);
    
    // Improved socket connection configuration
    const socket = io(apiBaseUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'], // Try websocket first, then fall back to polling
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      timeout: 30000,
      autoConnect: true,
      forceNew: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Store socket reference for debugging
    window.socket = socket;
  
    socket.on('connect', () => {
      console.log('WebSocket connection established with ID:', socket.id);
      // Reset any error state if we successfully connected
      window.hasShownSocketError = false;
      
      // Authenticate with the server
      if (user?._id) {
        socket.emit('authenticate', { userId: user._id, token });
        console.log('Sent authentication for user:', user._id);
      }
    });
  
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message || 'server error');
      
      // Don't show toast for every connection error
      if (!window.hasShownSocketError) {
        toast.error('Unable to establish real-time connection. Notifications will update manually.', {
          duration: 5000,
          id: 'socket-error'
        });
        window.hasShownSocketError = true;
      }
      
      // Manually refresh notifications after connection error
      setTimeout(() => {
        fetchNotifications();
      }, 5000);
    });
  
    socket.on('notification', (notification) => {
      console.log('Received real-time notification:', notification);
      
      // Add the new notification to the state
      setNotifications((prev) => [notification, ...prev]);
  
      // Increment unread count
      setUnreadNotificationsCount((prev) => prev + 1);
  
      // Show a toast notification
      showNotificationToast(notification);
    });
  
    socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
      
      // Only try to manually reconnect if it wasn't an intentional disconnect
      if (reason === 'io server disconnect' || reason === 'transport close') {
        // The server disconnected the socket, try reconnecting manually after a delay
        setTimeout(() => {
          if (socket && !socket.connected) {
            socket.connect();
          }
        }, 5000);
      }
    });
  
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      // No need to display a toast here as connect_error already handles that
    });
  
    // Ping the server periodically to keep the connection alive
    const pingInterval = setInterval(() => {
      if (socket && socket.connected) {
        socket.emit('ping');
      }
    }, 25000);
  
    return () => {
      console.log('Cleaning up WebSocket connection');
      clearInterval(pingInterval);
      if (socket) {
        socket.disconnect();
        window.socket = null;
      }
    };
  }, [token, user?._id]);

  // Effect to fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        if (!token) return;
        
        const response = await axios.get('/api/user/digital-prescriptions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.prescriptions) {
          setPrescriptions(response.data.prescriptions);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        // Don't show error toast as this is not critical functionality
      }
    };
    
    fetchPrescriptions();
  }, [token]);

  // Show toast notification
  const showNotificationToast = (notification) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 pt-0.5 rounded-full p-1 ${
              notification.type === 'warning' || notification.type === 'error' ? 'bg-amber-100' : 
              notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {notification.type === 'warning' || notification.type === 'error' ? 
                <FiAlertTriangle className="h-5 w-5 text-amber-500" /> : 
              notification.type === 'success' ? 
                <FiCheckCircle className="h-5 w-5 text-green-500" /> : 
                <FiBell className="h-5 w-5 text-blue-500" />
              }
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title || 'New Notification'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };
  
  // Helper functions
  const getAccountCompletionPercentage = () => {
    const fields = [
      'email', 'name', 'photoURL', 'verified', 'phone', 
      'address', 'umid', 'planType'
    ];
    
    const total = fields.length;
    const completed = fields.filter(field => user?.[field]).length;
    
    return Math.round((completed / total) * 100);
  };

  // Dedicated function for Notifications component
  const NotificationsPanel = () => {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
      >
        <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-violet-100 to-violet-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <FiBell className="mr-2 text-violet-600" /> Notifications
          </h3>
        </div>
        <div className="p-4">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification, idx) => (
                <motion.div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  whileHover={{ x: 3 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    notification.read 
                      ? 'bg-white hover:bg-gray-50 border border-gray-100' 
                      : 'bg-violet-50 hover:bg-violet-100 border border-violet-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'reminder' ? 'bg-amber-100 text-amber-600' :
                      notification.type === 'appointment' ? 'bg-green-100 text-green-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'reminder' && <FiClock size={14} />}
                      {notification.type === 'appointment' && <FiCalendar size={14} />}
                      {notification.type === 'report' && <FiFileText size={14} />}
                      {notification.type !== 'reminder' && notification.type !== 'appointment' && notification.type !== 'report' && <FiBell size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm font-medium">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-violet-600 rounded-full mt-2" />}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-3">
                <FiBell className="text-violet-400 text-lg" />
              </div>
              <p className="text-gray-600">No notifications</p>
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
            <motion.a 
              href="/notifications" 
              whileHover={{ x: 3 }}
              className="text-sm text-violet-600 hover:text-violet-800 flex items-center gap-1 font-medium"
            >
              View all notifications <FiChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            
            {notifications.length > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllNotificationsAsRead}
                className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              >
                Mark all as read
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const getUpcomingAppointment = () => {
    if (!appointments.length) return null;
    
    // Sort appointments by date and get the closest upcoming one
    return appointments
      .filter(apt => new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  };

  // Format dates for display
  const getFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeUntil = (dateString) => {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    const diffTime = appointmentDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  const accountCompletionPercentage = getAccountCompletionPercentage();
  const upcomingAppointment = getUpcomingAppointment();
  const recentReports = reports
    .filter(r => r.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      boxShadow: [
        "0 0 0 rgba(59, 130, 246, 0.4)",
        "0 0 20px rgba(59, 130, 246, 0.4)",
        "0 0 0 rgba(59, 130, 246, 0.4)"
      ],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: "easeInOut"
      }
    }
  };

  // Handler for notification click
  const handleNotificationClick = (id) => {
    markNotificationAsRead(id);
  };

  // Components
  const WelcomeHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8"
    >
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-4 sm:p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex h-16 w-16 rounded-full bg-blue-600 shadow-md items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="h-16 w-16 rounded-full object-cover border-4 border-white" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome'}
              </h1>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <FiCalendar className="mr-2 text-blue-600" size={16} />
                <p className="font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <Link 
              to="/notifications" 
              className="relative p-2 sm:p-2.5 rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer shadow-sm border border-gray-100"
            >
              <FiBell size={22} className="text-gray-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </Link>
            
            <a href="/settings" className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm border border-gray-100">
              <FiSettings size={22} className="text-gray-600" />
            </a>
            
            <div className="md:hidden flex items-center gap-2 ml-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsQRCodeModalOpen(true)}
              className="hidden md:flex items-center gap-2 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md"
            >
              <FiGrid size={14} />
              My Medicare ID
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const QuickActionsPanel = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
    >
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {quickActions.map((action) => (
          <motion.a
            key={action.id}
            href={action.path}
            whileHover={{ y: -5, backgroundColor: `rgba(var(--${action.color}-50), 1)` }}
            whileTap={{ y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`flex flex-col items-center justify-center p-6 hover:bg-${action.color}-50 border-r last:border-r-0 border-b md:border-b-0 hover:shadow-md transition-all duration-300`}
          >
            <div
              className={`w-14 h-14 rounded-full bg-${action.color}-100 flex items-center justify-center mb-3 shadow-sm transition-transform transform hover:scale-110`}
            >
              <span className={`text-${action.color}-600 text-xl`}>
                {action.icon}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {action.title}
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );

  // Reduced the hero section height and added professional Medicare elements
  const HealthOverviewPanel = () => (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-28 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <FiShield size={28} className="text-white drop-shadow-md" />
            <h2 className="text-xl font-bold drop-shadow-md">Your Medicare Dashboard</h2>
          </div>
        </div>
        <div className="px-8 pb-6 -mt-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-200 bg-white transform hover:scale-105 transition-transform duration-300">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {user?.name || "User"}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user?.umid && (
                  <div className="inline-flex items-center text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-blue-100">
                    <FiShield className="mr-1" size={14} />
                    Medicare ID: {user.umid}
                  </div>
                )}
                {user?.verified && (
                  <div className="inline-flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-green-100">
                    <FiCheckCircle className="mr-1" size={14} />
                    Verified
                  </div>
                )}
                {user?.planType && (
                  <div className="inline-flex items-center text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-purple-100">
                    <FiCreditCard className="mr-1" size={14} />
                    {user.planType}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

// Health content stats panel - to be added after HealthOverviewPanel
  const HealthStatsPanel = () => (
    <motion.div
      variants={itemVariants}
      className="mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Records Stats */}
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <FiFileText className="text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Health Records</h3>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{reports.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Total documents</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-sm">
                <FiFileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/reports" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group">
                View all records
                <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Digital Prescriptions Stats */}
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <FiClipboard className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Prescriptions</h3>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{prescriptions.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Active medications</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                <FiClipboard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/digital-prescriptions" className="text-sm text-blue-600 hover:text-blue-800 flex items-center group">
                Manage prescriptions
                <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Notifications Stats */}
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <FiBell className="text-amber-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Notifications</h3>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">{unreadNotificationsCount}</p>
                  <p className="text-sm text-gray-500 mt-1">Unread alerts</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm">
                <FiBell className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/notifications" className="text-sm text-amber-600 hover:text-amber-800 flex items-center group">
                View all notifications
                <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const ContentSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* Main content area (3/5 width) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Recent Reports Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <FiFileText className="mr-2 text-indigo-600" /> Recent Health
              Records
            </h3>
            <a
              href="/upload"
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiUpload size={14} /> Upload new
            </a>
          </div>

          <div className="p-6">
            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report, idx) => (
                  <motion.div
                    key={report._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-indigo-100 rounded-md mr-3">
                      <FiFileText className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {report.originalFilename || `Report ${idx + 1}`}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/reports/${report._id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600"
                      >
                        <FiEye size={18} />
                      </a>
                      <a
                        href={`/reports/${report._id}/download`}
                        className="p-2 text-gray-400 hover:text-indigo-600"
                      >
                        <FiDownload size={18} />
                      </a>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-3 mt-2 border-t border-gray-100 text-center">
                  <a
                    href="/reports"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    View all health records <FiArrowRight size={16} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <FiFileText className="text-indigo-400 text-xl" />
                </div>
                <h4 className="text-gray-800 font-medium mb-2">
                  No health records yet
                </h4>
                <p className="text-gray-500 text-sm text-center mb-4 max-w-sm">
                  Upload your medical documents to securely store and access
                  them anytime, anywhere.
                </p>
                <motion.a
                  href="/upload"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                >
                  <FiUpload size={14} /> Upload your first document
                </motion.a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Digital Prescriptions Section */}
        <motion.section
          variants={itemVariants}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FiClipboard className="text-blue-600" size={18} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Digital Prescriptions</h3>
              </div>
              <Link 
                to="/digital-prescriptions"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors bg-white/70 hover:bg-white px-3 py-1.5 rounded-full shadow-sm"
              >
                <FiEye size={14} /> View all
              </Link>
            </div>
            
            <div className="p-6">
              {prescriptions && prescriptions.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.slice(0, 2).map((prescription, index) => (
                      <motion.div
                        key={prescription._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="transform transition-all duration-300"
                      >
                        <PrescriptionCard prescription={prescription} onView={(prescription) => {
                          window.open(`/digital-prescriptions/${prescription._id}`, '_blank');
                        }} />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="mb-2 sm:mb-0">
                        <span className="text-sm text-gray-500">Recent medications</span>
                        <h4 className="font-medium text-gray-800">{prescriptions.length} active prescriptions</h4>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.a
                          href="/digital-prescriptions"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <FiClipboard size={14} /> Manage medications
                        </motion.a>
                        
                        <motion.a
                          href="/digital-prescriptions/reminders"
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-1 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <FiClock size={14} /> Set reminders
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FiClipboard className="text-blue-400 text-xl" />
                  </div>
                  <h4 className="text-gray-800 font-medium mb-2">No digital prescriptions</h4>
                  <p className="text-gray-500 text-sm max-w-md mb-4">
                    Your digital prescriptions from doctors' visits will appear here for easy access and reference.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <motion.a
                      href="/find-doctor"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <FiSearch size={14} /> Find a doctor
                    </motion.a>
                    <motion.a
                      href="/digital-prescriptions/request"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <FiClipboard size={14} /> Request prescription
                    </motion.a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Health Plan Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <FiShield className="mr-2 text-teal-600" /> Your Medicare Coverage
            </h3>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-teal-100 rounded-lg mr-4">
                <FiCreditCard className="text-teal-600 text-xl" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Medicare ID</span>
                <h4 className="font-semibold text-gray-800">{user.umid}</h4>
              </div>
              {user?.verified && (
                <span className="ml-auto bg-teal-100 text-teal-800 text-xs py-1 px-2 rounded-full font-medium">
                  Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Plan type</span>
                <p className="font-medium text-gray-800">
                  {user?.planType || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Renewal date</span>
                <p className="font-medium text-gray-800">
                  {user?.renewalDate
                    ? new Date(user.renewalDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.medicare.gov/what-medicare-covers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm py-1 px-3 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                >
                  Coverage Details
                </a>
                <a
                  href="https://www.medicare.gov/plan-compare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm py-1 px-3 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                >
                  Compare Plans
                </a>
                <a
                  href="/profile/plan"
                  className="text-sm py-1 px-3 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                >
                  Update Plan
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar (2/5 width) - increased from previous ratio */}
      <div className="lg:col-span-2 space-y-6">
        {/* Notifications Card */}
        <NotificationsPanel />

        {/* Health Resources Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <h3 className="font-semibold flex items-center">
              <FiHeart className="mr-2" /> Healthcare Resources
            </h3>
          </div>

          <div className="bg-gradient-to-b from-purple-50 to-white p-4">
            <div className="space-y-3">
              <a
                href="https://www.medicare.gov/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-lg bg-white hover:bg-purple-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                    <FiLayers className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      Medicare Blog
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Latest news and updates
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://www.medicare.gov/care-compare"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-lg bg-white hover:bg-purple-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                    <FiSearch className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      Find Care Providers
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Search for doctors and facilities
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://www.medicare.gov/coverage"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-lg bg-white hover:bg-purple-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                    <FiShield className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      Coverage Information
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Learn what's covered
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://www.medicare.gov/forms-help-resources"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-lg bg-white hover:bg-purple-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-1.5 bg-purple-100 rounded-md mr-3">
                    <FiHelpCircle className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      Help & Resources
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Get assistance with Medicare
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Wellness Tips Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <FiTarget className="mr-2 text-amber-600" /> Wellness Tips
            </h3>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-md mr-3 mt-0.5">
                  <FiHeart className="text-amber-600" size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Stay Active Daily
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Aim for at least 30 minutes of moderate physical
                    notifications daily to improve heart health and circulation.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-md mr-3 mt-0.5">
                  <FiClock className="text-amber-600" size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Medication Reminder
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Take your medications at the same time each day to maintain
                    consistent levels in your system.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-md mr-3 mt-0.5">
                  <FiFileText className="text-amber-600" size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Track Your Health
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Keep a journal of any symptoms or changes to discuss at your
                    next appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help & Support Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200 overflow-hidden"
        >
          <div className="p-5 text-center">
            <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
              <FiHelpCircle className="text-blue-600 text-xl" />
            </div>

            <h3 className="font-semibold text-gray-800 mb-2">
              Need Assistance?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our support team is here to help with any questions about your
              Medicare coverage.
            </p>

            <div className="space-y-2">
              <a
                href="tel:1-800-MEDICARE"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Call Support
              </a>
              <a
                href="/support"
                className="block w-full py-2 px-4 bg-white/50 hover:bg-white/80 text-blue-800 rounded-lg transition-colors text-sm"
              >
                Chat Online
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiRefreshCw className="mr-2 -ml-1 h-5 w-5" /> Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const userUmid = user?.umid || "Not available"; // Safely access user.umid

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <WelcomeHeader />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8"
        >
          <HealthOverviewPanel />
          <HealthStatsPanel />
          <ContentSection />
        </motion.div>

        {/* QR Code Floating Button with explanatory text */}
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            onClick={() => setIsQRCodeModalOpen(true)}
            className="flex flex-col items-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg transition-colors mb-2 group-hover:shadow-xl">
              <FiGrid size={24} />
            </div>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs font-medium text-white px-3 py-1.5 bg-gray-800 rounded-lg whitespace-nowrap shadow-lg"
            >
              Medicare QR ID
            </motion.span>
          </motion.button>
        </div>

        {/* QR Code Modal Component */}
        <QRCodeModal 
          isOpen={isQRCodeModalOpen}
          onClose={() => setIsQRCodeModalOpen(false)}
          userUmid={userUmid}
          logo={MedicareLogo}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
