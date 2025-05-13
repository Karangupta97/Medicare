import axios from "axios";
import { create } from "zustand";
import { safeStorageAccess } from "../utils/errorHandling";

// API URL for backend communication
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useStaffStore = create((set, get) => ({
  staffList: [],
  selectedStaff: null,
  totalStaff: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,

  // Add a new staff member
  addStaff: async (staffData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/staff`, staffData, {
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      // Add the new staff member to the list if successful
      if (response.data.success) {
        set((state) => ({
          staffList: [response.data.staff, ...state.staffList],
          isLoading: false,
        }));
      }

      return response.data;
    } catch (error) {
      console.error("Error adding staff member:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to add staff member";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Get all staff members with pagination and optional search
  getStaffList: async (page = 1, limit = 10, search = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/staff`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      if (response.data.success) {
        set({
          staffList: response.data.staff,
          totalStaff: response.data.totalCount,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          isLoading: false,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching staff list:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to fetch staff list";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Get a specific staff member by ID
  getStaffById: async (staffId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      if (response.data.success) {
        set({
          selectedStaff: response.data.staff,
          isLoading: false,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching staff member:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to fetch staff member";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Update a staff member
  updateStaff: async (staffId, staffData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/api/staff/${staffId}`, staffData, {
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      if (response.data.success) {
        // Update the staff list with the updated staff member
        set((state) => ({
          staffList: state.staffList.map((staff) =>
            staff._id === staffId ? response.data.staff : staff
          ),
          selectedStaff: response.data.staff,
          isLoading: false,
        }));
      }

      return response.data;
    } catch (error) {
      console.error("Error updating staff member:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to update staff member";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Reset a staff member's password
  resetStaffPassword: async (staffId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/staff/${staffId}/reset-password`, {}, {
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error resetting staff password:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to reset staff password";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Delete a staff member
  deleteStaff: async (staffId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/api/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${safeStorageAccess.getItem("founder_token")}`,
        },
      });

      if (response.data.success) {
        // Remove the deleted staff member from the list
        set((state) => ({
          staffList: state.staffList.filter((staff) => staff._id !== staffId),
          isLoading: false,
        }));
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting staff member:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to delete staff member";
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  // Clear selected staff
  clearSelectedStaff: () => {
    set({ selectedStaff: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
})); 