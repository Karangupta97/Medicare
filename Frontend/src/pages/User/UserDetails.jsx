import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCalendar, FiCreditCard, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Navbar from "../../components/Navbar";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Removed Navbar */}
      <div>
        {children}
      </div>
    </div>
  );
};

// New clean layout for authenticated users without sidebar
const CleanLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Removed Navbar */}
      <div>
        {children}
      </div>
    </div>
  );
};

const UserDetails = () => {
  const { umid } = useParams();
  const navigate = useNavigate();
  const { token, user: currentUser, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!umid) {
          setError("User ID not provided");
          setLoading(false);
          return;
        }
        
        // Check if we're looking at our own profile
        if (currentUser?.umid === umid) {
          setUser(currentUser);
          setLoading(false);
          return;
        }
        
        // Fetch user details from API
        const response = await axios.get(`/api/users/${umid}`, {
          headers: isAuthenticated ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.message || "Error fetching user details");
        toast.error("Could not load user information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [umid, token, currentUser, isAuthenticated]);

  // Content component will be the same regardless of layout
  const UserDetailsContent = () => (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <FiUser size={28} className="text-white" />
            <h2 className="text-xl font-bold">User Details</h2>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-blue-100 bg-white flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {user?.name || "User"}
              </h2>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {user?.umid && (
                  <div className="inline-flex items-center text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">
                    <FiShield className="mr-1" size={14} />
                    Medicare ID: {user.umid}
                  </div>
                )}
                {user?.verified && (
                  <div className="inline-flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                    <FiCheckCircle className="mr-1" size={14} />
                    Verified
                  </div>
                )}
                {user?.planType && (
                  <div className="inline-flex items-center text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-sm">
                    <FiCreditCard className="mr-1" size={14} />
                    {user.planType}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiMail className="mr-2 text-blue-500" /> Email
                </h3>
                <p className="font-medium text-gray-800">{user?.email || "Not provided"}</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiPhone className="mr-2 text-blue-500" /> Phone
                </h3>
                <p className="font-medium text-gray-800">{user?.phone || "Not provided"}</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" /> Address
                </h3>
                <p className="font-medium text-gray-800">{user?.address || "Not provided"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiShield className="mr-2 text-blue-500" /> Medicare ID
                </h3>
                <p className="font-medium text-gray-800">{user?.umid || "Not provided"}</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiCreditCard className="mr-2 text-blue-500" /> Plan Type
                </h3>
                <p className="font-medium text-gray-800">{user?.planType || "Not provided"}</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-1 flex items-center">
                  <FiCalendar className="mr-2 text-blue-500" /> Member Since
                </h3>
                <p className="font-medium text-gray-800">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Additional Information
          </h3>
          <p className="text-gray-600 mb-4">
            For additional medical information or plan details, please consult with your healthcare provider
            or Medicare representative.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://www.medicare.gov/care-compare"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              Find Providers
            </a>
            <a
              href="https://www.medicare.gov/plan-compare"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              Compare Plans
            </a>
            <a
              href="https://www.medicare.gov/forms-help-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              Help Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Loading and error states
  if (loading) {
    return (
      isAuthenticated ? (
        <CleanLayout>
          <div className="flex justify-center items-center h-full py-20">
            <Loading />
          </div>
        </CleanLayout>
      ) : (
        <PublicLayout>
          <div className="flex justify-center items-center h-full py-20">
            <Loading />
          </div>
        </PublicLayout>
      )
    );
  }
  
  if (error) {
    const ErrorContent = () => (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <FiAlertTriangle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
    
    return (
      isAuthenticated ? (
        <CleanLayout>
          <ErrorContent />
        </CleanLayout>
      ) : (
        <PublicLayout>
          <ErrorContent />
        </PublicLayout>
      )
    );
  }
  
  // Render the appropriate layout based on authentication status
  return isAuthenticated ? (
    <CleanLayout>
      <UserDetailsContent />
    </CleanLayout>
  ) : (
    <PublicLayout>
      <UserDetailsContent />
    </PublicLayout>
  );
};

export default UserDetails;