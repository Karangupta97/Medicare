import axios from "axios";
import { create } from "zustand";

// const API_URL = "https://medicare-backend-pdci8.ondigitalocean.app";
// const API_URL = "http://localhost:4000";
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      console.log('Unauthorized request, clearing auth state');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initialize token and user from localStorage
const initialToken = localStorage.getItem('token');
const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  error: null,
  isLoading: false,
  isCheckingAuth: false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  setUser: (userData) => {
    // Save to localStorage for persistence across refreshes
    if (userData && !userData._tempPhotoURL) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    set({ user: userData });
  },
  
  // Add this function to initialize user from localStorage on app start
  initUser: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },

  signup: async (name, lastname, email, password, photoURL) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        lastname,
        email,
        password,
        photoURL,
      });
      const userData = response.data.user;
      const token = response.data.token;
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      set({
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        code,
      });
      const userData = response.data.user;
      const token = response.data.token;
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      set({
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  // ADD RESEND OTP METHOD HERE:
  resendOtp: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/resend-otp`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resending OTP",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    console.log('Starting checkAuth...');
    
    // If we're already checking auth, don't start another check
    if (get().isCheckingAuth) {
      console.log('Already checking auth, returning early');
      return;
    }
    
    // Set checking flag to true
    set({ isCheckingAuth: true });
    
    try {
      // Get token and user from localStorage
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      
      console.log('Auth state:', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasStoredUser: !!storedUser,
        storedUserData: storedUser
      });
      
      // If no token exists, we're not authenticated
      if (!token) {
        console.log('No token found in localStorage');
        set({ 
          user: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false
        });
        return;
      }
      
      console.log('Making check-auth request with token');
      // Make the API call to verify token validity
      const response = await axios.get(`${API_URL}/api/auth/check-auth`);
      
      console.log('Check-auth response:', response.data);
      
      // Update the state with the user data and token
      const userData = response.data.user;
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      console.log('Setting authenticated state with user data');
      set({
        user: userData,
        token: token,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      
      return response.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      console.error("Error details:", {
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      
      // If token is invalid or expired, clear auth state
      if (error.response?.status === 401) {
        console.log('Token invalid or expired, clearing auth state');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false,
          error: "Session expired. Please login again."
        });
      } else {
        set({ 
          isCheckingAuth: false,
          error: error.response?.data?.message || "Authentication check failed"
        });
      }
      return;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const userData = response.data.user;
      const token = response.data.token;
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      set({
        isAuthenticated: true,
        user: userData,
        token: token,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`,
        { password }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
