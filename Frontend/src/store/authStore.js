import axios from "axios";
import { create } from "zustand";

// const API_URL = "https://medicare-backend-pdci8.ondigitalocean.app";
// const API_URL = "http://localhost:4000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

axios.defaults.withCredentials = true;

// Add axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  signup: async (name, lastname, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        lastname,
        email,
        password,
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
    // If we're already checking auth, don't start another check
    if (get().isCheckingAuth) {
      return;
    }
    
    // Set checking flag to true
    set({ isCheckingAuth: true });
    
    // Get token and user from localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    // If no token exists, we're not authenticated
    if (!token) {
      set({ 
        user: null,
        token: null,
        isAuthenticated: false,
        isCheckingAuth: false
      });
      return;
    }
    
    // If we have a token but no user data, try to restore from localStorage
    if (token && !storedUser) {
      try {
        // Make the API call to check authentication
        const response = await axios.get(`${API_URL}/api/auth/check-auth`);
        
        // Update the state with the user data and token
        const userData = response.data.user;
        
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        
        return response.data;
      } catch (error) {
        // If there's an error but we have a token, keep the authentication state
        // This prevents redirects during page reloads
        set({ 
          isCheckingAuth: false,
          error: error.response?.data?.message || "Authentication check failed"
        });
        return;
      }
    }
    
    // If we have both token and user data, we're authenticated
    if (token && storedUser) {
      set({
        user: storedUser,
        token: token,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      
      // Silently verify token validity in the background
      try {
        await axios.get(`${API_URL}/api/auth/check-auth`);
      } catch (error) {
        console.error("Token validation failed:", error);
        // Don't update state, just log the error
      }
      
      return { user: storedUser, token };
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
