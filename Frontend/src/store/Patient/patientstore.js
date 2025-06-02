import axios from "axios";
import { create } from "zustand";
// API URL for backend communication
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const usePatientStore = create((set, get) => ({
  // State
  reports: [],
  prescriptions: [],
  notifications: [],
  unreadNotificationsCount: 0,
  isLoading: false,
  error: null,
  prescriptionCount: 0,
  userProfile: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all medical data
  fetchAllMedicalData: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // Set auth token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch all data in parallel
      const [reportsRes, prescriptionsRes, notificationsRes, prescriptionCountRes] = await Promise.all([
        axios.get('/api/reports'),
        axios.get('/api/user/digital-prescriptions'),
        axios.get('/api/notifications'),
        axios.get('/api/user/digital-prescriptions/count')
      ]);

      // Update state with fetched data
      set({
        reports: reportsRes.data.reports || [],
        prescriptions: prescriptionsRes.data.prescriptions || [],
        notifications: notificationsRes.data.notifications || [],
        unreadNotificationsCount: notificationsRes.data.unreadCount || 0,
        prescriptionCount: prescriptionCountRes.data.count || 0,
        isLoading: false
      });

      return {
        reports: reportsRes.data.reports,
        prescriptions: prescriptionsRes.data.prescriptions,
        notifications: notificationsRes.data.notifications,
        prescriptionCount: prescriptionCountRes.data.count
      };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch medical data',
        isLoading: false 
      });
      throw error;
    }
  },

  // Fetch medical reports
  fetchReports: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/api/reports');
      set({ reports: response.data.reports || [], isLoading: false });
      return response.data.reports;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch reports',
        isLoading: false 
      });
      throw error;
    }
  },

  // Get specific report by ID
  getReportById: async (token, reportId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`/api/reports/${reportId}`);
      set({ isLoading: false });
      return response.data.report;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Refresh report URL
  refreshReportUrl: async (token, reportId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`/api/reports/${reportId}/refresh-url`);
      set({ isLoading: false });
      return response.data.url;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to refresh report URL',
        isLoading: false 
      });
      throw error;
    }
  },

  // Move report to different category
  moveReport: async (token, reportId, newCategory) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.patch(`/api/reports/${reportId}/move`, { category: newCategory });
      
      // Update report in state
      set(state => ({
        reports: state.reports.map(report =>
          report._id === reportId
            ? { ...report, category: newCategory }
            : report
        ),
        isLoading: false
      }));
      
      return response.data.report;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to move report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Update report details
  updateReport: async (token, reportId, updates) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.patch(`/api/reports/${reportId}`, updates);
      
      // Update report in state
      set(state => ({
        reports: state.reports.map(report =>
          report._id === reportId
            ? { ...report, ...updates }
            : report
        ),
        isLoading: false
      }));
      
      return response.data.report;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Fetch prescriptions
  fetchPrescriptions: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/api/user/digital-prescriptions');
      set({ prescriptions: response.data.prescriptions || [], isLoading: false });
      return response.data.prescriptions;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch prescriptions',
        isLoading: false 
      });
      throw error;
    }
  },

  // Get prescription count
  getPrescriptionCount: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/api/user/digital-prescriptions/count');
      set({ prescriptionCount: response.data.count || 0, isLoading: false });
      return response.data.count;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch prescription count',
        isLoading: false 
      });
      throw error;
    }
  },

  // Get specific prescription by ID
  getPrescriptionById: async (token, prescriptionId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`/api/user/digital-prescriptions/${prescriptionId}`);
      set({ isLoading: false });
      return response.data.prescription;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch prescription',
        isLoading: false 
      });
      throw error;
    }
  },

  // Fetch notifications
  fetchNotifications: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/api/notifications');
      set({ 
        notifications: response.data.notifications || [],
        unreadNotificationsCount: response.data.unreadCount || 0,
        isLoading: false 
      });
      return response.data.notifications;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch notifications',
        isLoading: false 
      });
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadNotificationsCount: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/api/notifications/unread-count');
      set({ unreadNotificationsCount: response.data.count || 0, isLoading: false });
      return response.data.count;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch unread count',
        isLoading: false 
      });
      throw error;
    }
  },

  // Upload medical report
  uploadReport: async (token, formData) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.post('/api/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update reports list with new report
      set(state => ({
        reports: [response.data.report, ...state.reports],
        isLoading: false
      }));
      
      return response.data.report;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Download medical report
  downloadReport: async (token, reportId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`/api/reports/${reportId}`, {
        responseType: 'blob'
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to download report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Delete medical report
  deleteReport: async (token, reportId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await axios.delete(`/api/reports/${reportId}`);
      
      // Remove deleted report from state
      set(state => ({
        reports: state.reports.filter(report => report._id !== reportId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete report',
        isLoading: false 
      });
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (token, notificationId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await axios.delete(`/api/notifications/${notificationId}`);
      
      // Remove deleted notification from state
      set(state => ({
        notifications: state.notifications.filter(notification => notification.id !== notificationId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete notification',
        isLoading: false 
      });
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (token, notificationId) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await axios.patch(`/api/notifications/${notificationId}/read`);
      
      // Update notification status in state
      set(state => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark notification as read',
        isLoading: false 
      });
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (token) => {
    try {
      set({ isLoading: true, error: null });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await axios.patch('/api/notifications/mark-all-read');
      
      // Update all notifications status in state
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadNotificationsCount: 0,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark all notifications as read',
        isLoading: false 
      });
      throw error;
    }
  },

  // Get user profile by UMID
  getUserProfileByUmid: async (umid) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get(`/api/user/profile/${umid}`);
      set({ userProfile: response.data.profile, isLoading: false });
      return response.data.profile;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user profile',
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear store data
  clearStore: () => {
    set({
      reports: [],
      prescriptions: [],
      notifications: [],
      unreadNotificationsCount: 0,
      prescriptionCount: 0,
      userProfile: null,
      error: null
    });
  }
}));

export default usePatientStore;