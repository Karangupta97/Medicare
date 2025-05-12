import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/User/DashboardLayout';
import { 
  FiFileText, FiCheckCircle, FiClock, FiBell, 
  FiCalendar, FiArrowLeft, FiEdit, FiEye, FiFilter, 
  FiAlertTriangle, FiRefreshCw, FiSearch, FiMessageSquare,
  FiPlusCircle, FiShield, FiHeart, FiActivity, FiTrendingUp,
  FiDollarSign, FiUser, FiClipboard, FiThumbsUp, FiStar
} from 'react-icons/fi';
import { FaPills, FaHeartbeat, FaHospital, FaStethoscope, FaNotesMedical } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { user, token } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalItems: 0
  });

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!token) {
        setError('No authentication token found');
        toast.error('Please login to view your notifications');
        return;
      }

      // Set up query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      if (filter !== 'all') {
        params.append('type', filter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Fetch notifications with filter/search if applied
      const response = await axios.get(`/api/notifications?${params.toString()}`, {
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
        
        // Update pagination info if provided by the API
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.currentPage || 1,
            limit: response.data.pagination.limit || 20,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Could not load your notifications. Please try again later.');
      toast.error('Error loading notifications');
      
      // If in development environment and there's an error, use sample data
      if (import.meta.env.DEV) {
        const sampleNotifications = generateSampleNotifications();
        setNotifications(sampleNotifications);
        
        // Set sample pagination
        setPagination({
          page: 1,
          limit: 20,
          totalPages: Math.ceil(sampleNotifications.length / 20),
          totalItems: sampleNotifications.length
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate sample notifications for development
  const generateSampleNotifications = () => {
    const sampleTypes = ['report', 'appointment', 'reminder'];
    const sampleMessages = [
      'You uploaded a new health record',
      'Appointment scheduled with Dr. Sarah Johnson',
      'Your prescription refill is due tomorrow',
      'Lab results are now available',
      'You updated your profile information',
      'Your annual check-up is due next week',
      'Health record was viewed by Dr. Michael Chen',
      'Completed your health assessment questionnaire',
      'Medicare claim processed successfully',
      'New message from your healthcare provider'
    ];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `sample_${i}`,
      type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
      message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      title: 'Notification',
      time: formatDistanceToNow(
        new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        { addSuffix: true }
      ),
      read: Math.random() > 0.3,
      link: '#',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }));
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
      
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Could not mark as read');
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
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Could not mark all as read');
    }
  };

  // Load notifications on component mount and when filter/search/pagination changes
  useEffect(() => {
    fetchNotifications();
  }, [token, filter, searchTerm, pagination.page]);

  // Enhanced function to get appropriate icon based on notification type and content
  const getNotificationIcon = (notification) => {
    // First check for specific health-related keywords
    if (notification.message.toLowerCase().includes('prescription') || notification.message.toLowerCase().includes('medication')) {
      return <FaPills size={18} className="text-purple-600" />;
    } else if (notification.message.toLowerCase().includes('heart') || notification.message.toLowerCase().includes('cardiac')) {
      return <FaHeartbeat size={18} className="text-red-600" />;
    } else if (notification.message.toLowerCase().includes('hospital') || notification.message.toLowerCase().includes('admitted')) {
      return <FaHospital size={18} className="text-blue-700" />;
    } else if (notification.message.toLowerCase().includes('doctor') || notification.message.toLowerCase().includes('physician')) {
      return <FaStethoscope size={18} className="text-teal-600" />;
    } else if (notification.message.toLowerCase().includes('lab') || notification.message.toLowerCase().includes('test results')) {
      return <FaNotesMedical size={18} className="text-green-700" />;
    }
    
    // Then check notification type
    switch (notification.type) {
      case 'report':
        return <FiFileText size={18} className="text-blue-600" />;
      case 'appointment':
        return <FiCalendar size={18} className="text-green-600" />;
      case 'reminder':
        return <FiClock size={18} className="text-amber-600" />;
      case 'payment':
        return <FiDollarSign size={18} className="text-emerald-600" />;
      case 'message':
        return <FiMessageSquare size={18} className="text-indigo-600" />;
      case 'success':
        return <FiCheckCircle size={18} className="text-green-600" />;
      case 'warning':
        return <FiAlertTriangle size={18} className="text-orange-600" />;
      case 'error':
        return <FiAlertTriangle size={18} className="text-red-600" />;
      default:
        break;
    }
    
    // Fallback to context-based icons by analyzing message content
    if (notification.message.includes('viewed') || notification.message.includes('opened')) {
      return <FiEye size={18} className="text-indigo-600" />;
    } else if (notification.message.includes('updated') || notification.message.includes('changed') || notification.message.includes('edited')) {
      return <FiEdit size={18} className="text-amber-600" />;
    } else if (notification.message.includes('completed') || notification.message.includes('finished')) {
      return <FiCheckCircle size={18} className="text-green-600" />;
    } else if (notification.message.includes('new') || notification.message.includes('added') || notification.message.includes('created')) {
      return <FiPlusCircle size={18} className="text-blue-600" />;
    } else if (notification.message.includes('profile') || notification.message.includes('account')) {
      return <FiUser size={18} className="text-gray-600" />;
    } else if (notification.message.includes('security') || notification.message.includes('password')) {
      return <FiShield size={18} className="text-purple-600" />;
    } else if (notification.message.includes('health') || notification.message.includes('wellness')) {
      return <FiHeart size={18} className="text-red-600" />;
    } else if (notification.message.includes('progress') || notification.message.includes('improvement')) {
      return <FiTrendingUp size={18} className="text-green-600" />;
    } else if (notification.message.includes('feedback') || notification.message.includes('rating')) {
      return <FiThumbsUp size={18} className="text-blue-600" />;
    } else if (notification.message.includes('review') || notification.message.includes('assessment')) {
      return <FiClipboard size={18} className="text-teal-600" />;
    } else if (notification.message.includes('congratulations') || notification.message.includes('achievement')) {
      return <FiStar size={18} className="text-amber-500" />;
    }

    // Default icon
    return <FiBell size={18} className="text-violet-600" />;
  };

  // Enhanced function to get background and text colors based on notification type
  const getNotificationStyles = (notification) => {
    let bgColor = 'bg-violet-100';
    let iconBgColor = 'bg-violet-100';
    let hoverBgColor = 'hover:bg-violet-50';
    let borderColor = '';
    let iconAnimation = '';

    // First determine style by notification type
    switch (notification.type) {
      case 'report':
        bgColor = 'bg-blue-50';
        iconBgColor = 'bg-blue-100';
        hoverBgColor = 'hover:bg-blue-50';
        break;
      case 'appointment':
        bgColor = 'bg-green-50';
        iconBgColor = 'bg-green-100';
        hoverBgColor = 'hover:bg-green-50';
        break;
      case 'reminder':
        bgColor = 'bg-amber-50';
        iconBgColor = 'bg-amber-100';
        hoverBgColor = 'hover:bg-amber-50';
        // Add pulsing effect for reminders
        iconAnimation = 'animate-pulse';
        break;
      case 'payment':
        bgColor = 'bg-emerald-50';
        iconBgColor = 'bg-emerald-100';
        hoverBgColor = 'hover:bg-emerald-50';
        break;
      case 'message':
        bgColor = 'bg-indigo-50';
        iconBgColor = 'bg-indigo-100';
        hoverBgColor = 'hover:bg-indigo-50';
        break;
      case 'success':
        bgColor = 'bg-green-50';
        iconBgColor = 'bg-green-100';
        hoverBgColor = 'hover:bg-green-50';
        break;
      case 'warning':
        bgColor = 'bg-orange-50';
        iconBgColor = 'bg-orange-100';
        hoverBgColor = 'hover:bg-orange-50';
        break;
      case 'error':
        bgColor = 'bg-red-50';
        iconBgColor = 'bg-red-100';
        hoverBgColor = 'hover:bg-red-50';
        borderColor = 'border-l-4 border-red-500';
        break;
      default:
        // Check message content for fallback styling
        if (notification.message.toLowerCase().includes('prescription') || notification.message.toLowerCase().includes('medication')) {
          bgColor = 'bg-purple-50';
          iconBgColor = 'bg-purple-100';
          hoverBgColor = 'hover:bg-purple-50';
        } else if (notification.message.toLowerCase().includes('lab') || notification.message.toLowerCase().includes('test results')) {
          bgColor = 'bg-teal-50';
          iconBgColor = 'bg-teal-100';
          hoverBgColor = 'hover:bg-teal-50';
        }
        break;
    }

    // Add special styling for unread notifications
    if (!notification.read) {
      bgColor = bgColor.replace('50', '100');
    }

    return {
      bgColor,
      iconBgColor,
      hoverBgColor,
      borderColor,
      iconAnimation
    };
  };

  // Function to format the notification time in a user-friendly way
  const formatNotificationTime = (timestamp) => {
    const notificationDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // If it's today, show the time
    if (notificationDate >= today) {
      return `Today at ${notificationDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } 
    // If it's yesterday, show "Yesterday"
    else if (notificationDate >= yesterday) {
      return `Yesterday at ${notificationDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } 
    // If it's within the last week, show the day name
    else if (notificationDate >= lastWeek) {
      return notificationDate.toLocaleDateString('en-US', { weekday: 'long' });
    } 
    // Otherwise show the date
    else {
      return notificationDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };

  // For grouping notifications by date
  const groupNotificationsByDate = () => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };
    
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      
      if (notificationDate >= today) {
        groups.today.push(notification);
      } else if (notificationDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notificationDate >= lastWeek) {
        groups.thisWeek.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });
    
    return groups;
  };
  
  // Handler for pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };
  
  // Handler for filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filter changes
  };
  
  // Handler for search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when search changes
  };

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
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

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mb-4"></div>
            <p className="text-gray-500">Loading your notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
              onClick={fetchNotifications}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
            >
              <FiRefreshCw className="mr-2 -ml-1 h-5 w-5" /> Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiArrowLeft size={20} className="text-gray-600" />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Notifications
                </h1>
                <p className="text-gray-500">
                  View your notifications and updates
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-md hover:bg-violet-100 transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  filter === 'all' 
                    ? 'bg-violet-100 text-violet-800 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('report')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                  filter === 'report' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiFileText className="mr-1" size={12} /> Documents
              </button>
              <button
                onClick={() => handleFilterChange('appointment')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                  filter === 'appointment' 
                    ? 'bg-green-100 text-green-800 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiCalendar className="mr-1" size={12} /> Appointments
              </button>
              <button
                onClick={() => handleFilterChange('reminder')}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                  filter === 'reminder' 
                    ? 'bg-amber-100 text-amber-800 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiClock className="mr-1" size={12} /> Reminders
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="w-full md:w-64 relative">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-violet-600"
              >
                <FiFilter size={16} />
              </button>
            </form>
          </div>
        </div>
        
        {/* Notification List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
        >
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {/* Today's Notifications */}
              {groupedNotifications.today.length > 0 && (
                <div className="py-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-2">
                    Today
                  </h3>
                  {groupedNotifications.today.map((notification) => {
                    const styles = getNotificationStyles(notification);
                    return (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        className={`px-6 py-3 ${styles.hoverBgColor} transition-colors ${
                          !notification.read ? styles.bgColor : ''
                        } ${styles.borderColor}`}
                        onClick={() => {
                          if (notification.link) window.location.href = notification.link;
                          if (!notification.read) markNotificationAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${styles.iconBgColor} ${styles.iconAnimation} transition-all duration-200 transform hover:scale-110`} title={notification.type}>
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1">
                            <p className={`${!notification.read ? 'text-gray-900 font-semibold' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-3 w-3 rounded-full bg-violet-600 mt-2"></span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Yesterday's Notifications */}
              {groupedNotifications.yesterday.length > 0 && (
                <div className="py-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-2">
                    Yesterday
                  </h3>
                  {groupedNotifications.yesterday.map((notification) => {
                    const styles = getNotificationStyles(notification);
                    return (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        className={`px-6 py-3 ${styles.hoverBgColor} transition-colors ${
                          !notification.read ? styles.bgColor : ''
                        } ${styles.borderColor}`}
                        onClick={() => {
                          if (notification.link) window.location.href = notification.link;
                          if (!notification.read) markNotificationAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${styles.iconBgColor} ${styles.iconAnimation} transition-all duration-200 transform hover:scale-110`} title={notification.type}>
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1">
                            <p className={`${!notification.read ? 'text-gray-900 font-semibold' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-3 w-3 rounded-full bg-violet-600 mt-2"></span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* This Week's Notifications */}
              {groupedNotifications.thisWeek.length > 0 && (
                <div className="py-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-2">
                    This Week
                  </h3>
                  {groupedNotifications.thisWeek.map((notification) => {
                    const styles = getNotificationStyles(notification);
                    return (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        className={`px-6 py-3 ${styles.hoverBgColor} transition-colors ${
                          !notification.read ? styles.bgColor : ''
                        } ${styles.borderColor}`}
                        onClick={() => {
                          if (notification.link) window.location.href = notification.link;
                          if (!notification.read) markNotificationAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${styles.iconBgColor} ${styles.iconAnimation} transition-all duration-200 transform hover:scale-110`} title={notification.type}>
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1">
                            <p className={`${!notification.read ? 'text-gray-900 font-semibold' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-3 w-3 rounded-full bg-violet-600 mt-2"></span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Earlier Notifications */}
              {groupedNotifications.earlier.length > 0 && (
                <div className="py-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-2">
                    Earlier
                  </h3>
                  {groupedNotifications.earlier.map((notification) => {
                    const styles = getNotificationStyles(notification);
                    return (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        className={`px-6 py-3 ${styles.hoverBgColor} transition-colors ${
                          !notification.read ? styles.bgColor : ''
                        } ${styles.borderColor}`}
                        onClick={() => {
                          if (notification.link) window.location.href = notification.link;
                          if (!notification.read) markNotificationAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${styles.iconBgColor} ${styles.iconAnimation} transition-all duration-200 transform hover:scale-110`} title={notification.type}>
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1">
                            <p className={`${!notification.read ? 'text-gray-900 font-semibold' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-3 w-3 rounded-full bg-violet-600 mt-2"></span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                <FiBell className="text-violet-400 text-xl" />
              </div>
              <h4 className="text-gray-800 font-medium mb-2">No notifications found</h4>
              <p className="text-gray-500 text-sm mb-6 max-w-md">
                {searchTerm || filter !== 'all' ? 
                  "Try adjusting your filters or search criteria." : 
                  "System notifications and updates about your health records will appear here."}
              </p>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Pagination */}
        {notifications.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  pagination.page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  pagination.page === pagination.totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{notifications.length > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                      pagination.page === 1 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-violet-600 text-white focus:z-20'
                            : 'bg-white text-gray-500 hover:bg-gray-50 focus:z-20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                      pagination.page === pagination.totalPages 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;