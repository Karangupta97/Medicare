import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Access the global request throttling mechanism or create it
const requestTimestamps = window.requestTimestamps || {
  profile: 0,
  founderProfile: 0,
  doctorProfile: 0
};

// Make it globally available to share between stores
window.requestTimestamps = requestTimestamps;

// Minimum time between identical requests (in milliseconds)
const REQUEST_THROTTLE_MS = 5000; // 5 seconds

// Check if a request should be throttled
const shouldThrottleRequest = (key) => {
  const now = Date.now();
  if (now - requestTimestamps[key] < REQUEST_THROTTLE_MS) {
    console.log(`Throttled request to ${key} - too soon after previous request`);
    return true;
  }
  requestTimestamps[key] = now;
  return false;
};

// Global cache for doctor profile
let doctorProfileCache = null;
let doctorProfileCacheTimestamp = 0;
const PROFILE_CACHE_TTL = 30000; // 30 seconds

export const useDoctorStore = create((set, get) => ({
  isAuthenticated: false,
  doctor: null,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  // Check if doctor is already authenticated
  checkAuthStatus: async () => {
    console.log("doctorStore: checkAuthStatus called");
    try {
      set({ isCheckingAuth: true, error: null });
      console.log("doctorStore: state before API call", {
        isAuthenticated: get().isAuthenticated,
        isCheckingAuth: get().isCheckingAuth,
        doctor: get().doctor ? "exists" : "null",
      });
      
      try {
        console.log("doctorStore: making API call to check-auth");
        const response = await axios.get(`${API_URL}/api/doctor/check-auth`, {
          withCredentials: true
        });
        
        console.log("doctorStore: check-auth response:", response.data);
        if (response.data.success) {
          console.log("doctorStore: doctor is authenticated");
          set({ 
            isAuthenticated: true, 
            doctor: response.data.doctor,
            isCheckingAuth: false
          });
          return true;
        } else {
          console.log("doctorStore: doctor is NOT authenticated");
          set({ 
            isAuthenticated: false, 
            doctor: null,
            isCheckingAuth: false
          });
          return false;
        }
      } catch (error) {
        console.error('doctorStore: Authentication check API call failed:', error);
        console.log("doctorStore: error response details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        
        set({ 
          isAuthenticated: false, 
          doctor: null, 
          error: error.response?.data?.message || 'Authentication failed',
          isCheckingAuth: false
        });
        return false;
      }
    } catch (error) {
      console.error('doctorStore: Authentication check outer try-catch failed:', error);
      set({ 
        isAuthenticated: false, 
        doctor: null, 
        error: 'Critical error in authentication flow',
        isCheckingAuth: false
      });
      return false;
    } finally {
      console.log("doctorStore: checkAuthStatus completed, final state:", {
        isAuthenticated: get().isAuthenticated,
        isCheckingAuth: get().isCheckingAuth,
        hasDoctor: !!get().doctor,
        hasError: !!get().error
      });
    }
  },

  // Doctor signup
  signupDoctor: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/doctor/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      set({ isLoading: false });
      
      if (response.data.success) {
        toast.success('Registration successful! Your account is pending verification.');
        return response.data;
      }
    } catch (error) {
      console.error('Doctor signup error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      });
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    }
  },

  // Doctor login
  loginDoctor: async (credentials) => {
    console.log("doctorStore: loginDoctor called with credentials:", credentials.email);
    try {
      set({ isLoading: true, error: null });
      
      console.log("doctorStore: making API call to login");
      const response = await axios.post(`${API_URL}/api/doctor/login`, credentials, {
        withCredentials: true
      });
      
      console.log("doctorStore: login response:", response.data);
      if (response.data.success) {
        // Update the cache when logging in
        doctorProfileCache = response.data.doctor;
        doctorProfileCacheTimestamp = Date.now();
        
        console.log("doctorStore: login successful, setting authenticated state");
        set({
          isAuthenticated: true,
          doctor: response.data.doctor,
          isLoading: false
        });
        
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      console.error('doctorStore: Doctor login error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.'
      });
      
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    }
  },

  // Doctor logout
  logoutDoctor: async () => {
    try {
      set({ isLoading: true });
      
      await axios.post(`${API_URL}/api/doctor/logout`, {}, {
        withCredentials: true
      });
      
      // Clear the cache on logout
      doctorProfileCache = null;
      doctorProfileCacheTimestamp = 0;
      
      set({
        isAuthenticated: false,
        doctor: null,
        isLoading: false
      });
      
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Doctor logout error:', error);
      set({ isLoading: false });
      toast.error('Logout failed');
      return false;
    }
  },

  // Get doctor profile
  getDoctorProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if we have a recent enough cache
      const now = Date.now();
      if (doctorProfileCache && (now - doctorProfileCacheTimestamp < PROFILE_CACHE_TTL)) {
        console.log('Using cached doctor profile data');
        set({
          doctor: doctorProfileCache,
          isLoading: false
        });
        return doctorProfileCache;
      }
      
      // Prevent duplicate requests in quick succession
      if (shouldThrottleRequest('doctorProfile')) {
        console.log('Throttled doctor profile request - using existing data');
        set({ isLoading: false });
        return get().doctor;
      }
      
      const response = await axios.get(`${API_URL}/api/doctor/profile`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update the cache
        doctorProfileCache = response.data.doctor;
        doctorProfileCacheTimestamp = now;
        
        set({
          doctor: response.data.doctor,
          isLoading: false
        });
        
        return response.data.doctor;
      }
    } catch (error) {
      console.error('Get doctor profile error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      });
      
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
      return null;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/doctor/reset-password`, { email });
      
      set({ isLoading: false });
      
      if (response.data.success) {
        toast.success('If your email is registered, a password reset link will be sent');
        return true;
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to request password reset'
      });
      
      toast.error(error.response?.data?.message || 'Failed to request password reset');
      return false;
    }
  },

  // Clear errors
  clearErrors: () => set({ error: null })
})); 