import axios from "axios";
import { create } from "zustand";
import { safeStorageAccess } from "../utils/errorHandling";

// API URL for backend communication
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add axios interceptor to add token to all requests
const addTokenInterceptor = axios.interceptors.request.use(
  (config) => {
    const token = safeStorageAccess.getItem('founder_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure withCredentials is set for all requests
    config.withCredentials = true;
    
    // Log request details in development
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`, {
        headers: config.headers,
        data: config.data,
        withCredentials: config.withCredentials
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => {
    // Log response details in development
    if (import.meta.env.DEV) {
      console.log(`Response from ${response.config.url}:`, {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  (error) => {
    console.error('Axios error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    if (error.response?.status === 401) {
      console.log('Unauthorized request, clearing founder auth state');
      safeStorageAccess.removeItem('founder_token');
      safeStorageAccess.removeItem('founder_data');
      window.location.href = '/founder/login';
    }
    
    return Promise.reject(error);
  }
);

// Initialize founder data from localStorage
const initialToken = safeStorageAccess.getItem('founder_token');
const initialFounderData = safeStorageAccess.getItem('founder_data');
let parsedFounderData = null;

try {
  if (initialFounderData) {
    parsedFounderData = JSON.parse(initialFounderData);
  }
} catch (error) {
  console.error('Error parsing founder data from localStorage:', error);
  safeStorageAccess.removeItem('founder_data');
}

export const useFounderStore = create((set, get) => ({
  founder: parsedFounderData,
  token: initialToken,
  isAuthenticated: !!initialToken,
  error: null,
  isLoading: false,
  isCheckingAuth: false,
  tempToken: null,
  refreshInterval: null,

  setToken: (token) => {
    if (token) {
      safeStorageAccess.setItem('founder_token', token);
    } else {
      safeStorageAccess.removeItem('founder_token');
    }
    set({ token });
  },

  setFounder: (founderData) => {
    if (founderData) {
      // Store founder data in localStorage for persistence
      safeStorageAccess.setItem('founder_data', JSON.stringify(founderData));
      
      // Start the refresh interval when setting founder
      if (!get().refreshInterval) {
        const interval = setInterval(() => {
          get().refreshFounderData();
        }, 300000); // Refresh every 5 minutes (more secure for founders)
        set({ refreshInterval: interval });
      }
      
      set({ founder: founderData });
    } else {
      safeStorageAccess.removeItem('founder_data');
      
      // Clear the refresh interval when removing founder
      if (get().refreshInterval) {
        clearInterval(get().refreshInterval);
      }
      
      set({ founder: null, refreshInterval: null });
    }
  },
  
  // Fetch fresh founder data from the server
  refreshFounderData: async () => {
    try {
      const token = safeStorageAccess.getItem('founder_token');
      
      if (!token) {
        console.log('Cannot refresh founder data: missing token');
        return null;
      }
      
      const response = await axios.get(`${API_URL}/api/founder/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      if (response.data.success && response.data.founder) {
        // Cache timestamp to track when founder data was last refreshed
        const founderData = {
          ...response.data.founder,
          _lastRefreshed: new Date().getTime()
        };

        safeStorageAccess.setItem('founder_data', JSON.stringify(founderData));
        set({ founder: founderData });
        return founderData;
      } else {
        console.warn('Founder data missing in response', response.data);
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh founder data:", error);
      
      // If we get a 401 Unauthorized error, clear the auth state
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized (401) during founder refresh. Logging out.');
        get().logout();
      }
      
      throw error;
    }
  },

  // First step of founder login - sends email/password and gets temp token
  initiateLogin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/founder/login`, {
        email,
        password,
      });
      
      if (response.data.success) {
        set({
          tempToken: response.data.tempToken,
          isLoading: false
        });
        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // Second step of founder login - verify OTP
  verifyOtp: async (otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/founder/verify-otp`, 
        { otp },
        { 
          headers: { Authorization: `Bearer ${get().tempToken}` },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        const founderData = response.data.founder;
        const token = response.data.token;
        
        // Save token and founder data to localStorage
        safeStorageAccess.setItem('founder_token', token);
        safeStorageAccess.setItem('founder_data', JSON.stringify(founderData));
        
        // Start the periodic founder data refresh
        const interval = setInterval(() => {
          get().refreshFounderData();
        }, 300000); // Refresh every 5 minutes
        
        set({
          founder: founderData,
          token: token,
          isAuthenticated: true,
          tempToken: null,
          isLoading: false,
          refreshInterval: interval
        });
        
        return response.data;
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "OTP verification failed",
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Resend OTP during login process
  resendOtp: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/founder/resend-otp`,
        {},
        { 
          headers: { Authorization: `Bearer ${get().tempToken}` },
          withCredentials: true
        }
      );
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to resend OTP",
        isLoading: false,
      });
      throw error;
    }
  },

  // Check if founder is authenticated
  checkAuth: async () => {
    if (get().isCheckingAuth) {
      return;
    }
    
    set({ isCheckingAuth: true });
    
    try {
      const token = safeStorageAccess.getItem('founder_token');
      
      if (!token) {
        set({ 
          founder: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false
        });
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/founder/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      if (response.data.success && response.data.founder) {
        safeStorageAccess.setItem('founder_data', JSON.stringify(response.data.founder));
        
        set({
          founder: response.data.founder,
          token: token,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        
        return response.data;
      } else {
        throw new Error(response.data.message || "Authentication check failed");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        safeStorageAccess.removeItem('founder_token');
        safeStorageAccess.removeItem('founder_data');
        
        set({ 
          founder: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false,
          error: "Session expired. Please login again."
        });
      } else {
        set({ 
          isCheckingAuth: false,
          error: error.message || "Authentication check failed"
        });
      }
      return;
    }
  },

  // Logout founder
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/api/founder/logout`, {}, {
        headers: { Authorization: `Bearer ${get().token}` },
        withCredentials: true
      });
      
      // Clear localStorage
      safeStorageAccess.removeItem('founder_token');
      safeStorageAccess.removeItem('founder_data');
      
      // Clear the refresh interval
      if (get().refreshInterval) {
        clearInterval(get().refreshInterval);
      }
      
      set({
        founder: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        refreshInterval: null
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if the API call fails, we should still clean up local state
      safeStorageAccess.removeItem('founder_token');
      safeStorageAccess.removeItem('founder_data');
      
      if (get().refreshInterval) {
        clearInterval(get().refreshInterval);
      }
      
      set({
        founder: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        refreshInterval: null,
        error: error.response?.data?.message || "Error during logout"
      });
    }
  },
  
  // Get dashboard data for founder
  getDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/founder/dashboard`, {
        headers: { Authorization: `Bearer ${get().token}` },
        withCredentials: true
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch dashboard data",
        isLoading: false,
      });
      throw error;
    }
  }
})); 