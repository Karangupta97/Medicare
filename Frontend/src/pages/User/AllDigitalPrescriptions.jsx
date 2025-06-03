import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/Patient/authStore";
import usePatientStore from "../../store/Patient/patientstore";
import DashboardLayout from "../../components/User/DashboardLayout";
import PrescriptionCard from "../../components/User/DigitalPrescriptionCard";
import { 
  FiFileText, FiSearch, FiFilter, FiCalendar, FiDownload, 
  FiPrinter, FiGrid, FiList, FiPlus, FiArrowLeft, FiAlertTriangle,
  FiChevronDown, FiCheck, FiX, FiRefreshCw
} from "react-icons/fi";

const AllDigitalPrescriptions = () => {
  const { user, token } = useAuthStore();
  const { 
    prescriptions,
    isLoading,
    error,
    fetchPrescriptions
  } = usePatientStore();

  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "doctor", "hospital"
  const [showFilters, setShowFilters] = useState(false);

  // Fetch prescriptions from store
  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        await fetchPrescriptions(token);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        toast.error("An error occurred while fetching prescriptions");
      }
    };

    if (token) {
      loadPrescriptions();
    }
  }, [token, fetchPrescriptions]);

  // Filter prescriptions when search term or filter changes
  useEffect(() => {
    if (!prescriptions.length) return;
    
    let results = [...prescriptions];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(prescription => 
        (prescription.doctor && prescription.doctor.toLowerCase().includes(lowercasedSearch)) ||
        (prescription.hospitalName && prescription.hospitalName.toLowerCase().includes(lowercasedSearch)) ||
        (prescription.diagnosis && prescription.diagnosis.toLowerCase().includes(lowercasedSearch)) ||
        (prescription.medications && prescription.medications.some(med => 
          med.name.toLowerCase().includes(lowercasedSearch)
        ))
      );
    }
    
    // Apply category filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "active") {
        results = results.filter(prescription => prescription.status === "Active");
      } else if (selectedFilter === "completed") {
        results = results.filter(prescription => prescription.status === "Completed");
      } else if (selectedFilter === "recent") {
        // Get prescriptions from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        results = results.filter(prescription => 
          new Date(prescription.createdAt) >= thirtyDaysAgo
        );
      }
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "doctor") {
      results.sort((a, b) => (a.doctor || "").localeCompare(b.doctor || ""));
    } else if (sortBy === "hospital") {
      results.sort((a, b) => (a.hospitalName || "").localeCompare(b.hospitalName || ""));
    }
    
    setFilteredPrescriptions(results);
  }, [prescriptions, searchTerm, selectedFilter, sortBy]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter selection
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // Handle sort selection
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setSortBy('newest');
  };

  // List view prescription item component
  const PrescriptionListItem = ({ prescription }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <Link to={`/digital-prescriptions/${prescription._id}`} className="block">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-50 shrink-0">
                  <FiFileText className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">
                    Prescription #{prescription._id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(prescription.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="sm:text-right">
                <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                  ${prescription.status === "Active" ? "bg-green-100 text-green-800" : 
                    prescription.status === "Completed" ? "bg-blue-100 text-blue-800" : 
                    "bg-gray-100 text-gray-800"}`}
                >
                  {prescription.status || "Active"}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2">
              <div>
                <p className="text-xs text-gray-500">Doctor</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  Dr. {prescription.doctor || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hospital</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {prescription.hospitalName || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Medications</p>
                <p className="text-sm font-medium text-gray-800">
                  {prescription.medications ? prescription.medications.length : 0} prescribed
                </p>
              </div>
            </div>
            
            {prescription.diagnosis && (
              <div className="mt-3">
                <p className="text-xs text-gray-500">Diagnosis</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {prescription.diagnosis}
                </p>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Digital Prescriptions</h1>
              <p className="text-gray-600 mt-1">View and manage all your medical prescriptions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mb-6">
                <FiAlertTriangle className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Unable to Load Prescriptions
              </h2>
              <p className="text-gray-600 max-w-md mb-6">
                {error || "We encountered an error while loading your prescriptions. Please try again later."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="inline mr-2" />
                  Back to Dashboard
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiRefreshCw className="inline mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Digital Prescriptions</h1>
            <p className="text-gray-600 mt-1">View and manage all your medical prescriptions</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 text-sm"
            >
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            {/* Search field */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by doctor, hospital, or medication..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            {/* Filters toggle for mobile */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span><FiFilter className="inline mr-2" /> Filters</span>
                <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Filter Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-gray-600 text-sm whitespace-nowrap">
                <FiFilter className="inline mr-1" /> Filter:
              </span>
              
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                  ${selectedFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                  ${selectedFilter === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Active
              </button>
              
              <button
                onClick={() => handleFilterChange('completed')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                  ${selectedFilter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Completed
              </button>
              
              <button
                onClick={() => handleFilterChange('recent')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                  ${selectedFilter === 'recent' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Recent
              </button>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden p-4 pt-0 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium
                    ${selectedFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700'}`}
                >
                  All
                </button>
                
                <button
                  onClick={() => handleFilterChange('active')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium
                    ${selectedFilter === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700'}`}
                >
                  Active
                </button>
                
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium
                    ${selectedFilter === 'completed' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700'}`}
                >
                  Completed
                </button>
                
                <button
                  onClick={() => handleFilterChange('recent')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium
                    ${selectedFilter === 'recent' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700'}`}
                >
                  Recent
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="mobileSortBy" className="text-sm text-gray-600 whitespace-nowrap">
                  <FiCalendar className="inline mr-1" /> Sort by:
                </label>
                <select
                  id="mobileSortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="doctor">Doctor Name</option>
                  <option value="hospital">Hospital Name</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Advanced Options - Desktop */}
          <div className="hidden sm:flex sm:flex-row items-center justify-between p-4 pt-0 mt-4 border-t border-gray-100">
            {/* Sort options */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600 whitespace-nowrap">
                <FiCalendar className="inline mr-1" /> Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="doctor">Doctor Name</option>
                <option value="hospital">Hospital Name</option>
              </select>
            </div>
            
            {/* View mode and result count */}
            <div className="flex items-center">
              <div className="text-sm text-gray-600 mr-4">
                {filteredPrescriptions.length} {filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'} found
              </div>
              
              {/* Reset filters */}
              {(searchTerm || selectedFilter !== 'all' || sortBy !== 'newest') && (
                <button
                  onClick={resetFilters}
                  className="mr-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiX className="mr-1" /> Reset filters
                </button>
              )}
              
              {/* View mode toggle */}
              <button
                onClick={toggleViewMode}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                {viewMode === 'grid' ? (
                  <FiList className="text-gray-600" />
                ) : (
                  <FiGrid className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile result count and view toggle */}
          <div className="sm:hidden flex items-center justify-between p-4 pt-0 mt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              {filteredPrescriptions.length} {filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Reset filters button */}
              {(searchTerm || selectedFilter !== 'all' || sortBy !== 'newest') && (
                <button
                  onClick={resetFilters}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <FiX className="mr-1" /> Reset
                </button>
              )}
              
                <button
                  onClick={toggleViewMode}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                >
                  {viewMode === 'grid' ? (
                    <FiList className="text-gray-600" />
                  ) : (
                    <FiGrid className="text-gray-600" />
                  )}
                </button>
            </div>
          </div>
        </div>
        
        {/* No results state */}
        {filteredPrescriptions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mb-4">
                <FiFileText className="text-gray-400 text-2xl" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">No prescriptions found</h2>
              <p className="text-gray-600 max-w-md mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? "No prescriptions match your current filters. Try adjusting your search or filters."
                  : "You don't have any prescriptions yet. They will appear here once a healthcare provider issues them."}
              </p>
              
              {(searchTerm || selectedFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Prescription list/grid */}
        {filteredPrescriptions.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            : "space-y-4"
          }>
            {filteredPrescriptions.map(prescription => (
              viewMode === 'grid' ? (
                <PrescriptionCard 
                  key={prescription._id} 
                  prescription={prescription} 
                />
              ) : (
                <PrescriptionListItem 
                  key={prescription._id} 
                  prescription={prescription} 
                />
              )
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllDigitalPrescriptions;