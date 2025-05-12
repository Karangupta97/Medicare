import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  FiUsers, FiShield, FiActivity, FiClock, 
  FiAlertTriangle, FiInfo, FiCheckCircle 
} from "react-icons/fi";
import FounderDashboardLayout from "../../components/Founder/FounderDashboardLayout";
import { useFounderStore } from "../../store/founderStore";

const FounderDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  
  // Use founder store hooks
  const { 
    getDashboardData,
    founder,
    isLoading, 
    error: storeError 
  } = useFounderStore();
  
  const [error, setError] = useState(null);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(storeError || err.message || "An error occurred while fetching dashboard data");
        toast.error("Failed to load dashboard data");
      }
    };
    
    fetchDashboardData();
  }, [getDashboardData, storeError]);
  
  // Render loading state
  if (isLoading) {
    return (
      <FounderDashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </FounderDashboardLayout>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <FounderDashboardLayout>
        <div className="text-center py-12">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </FounderDashboardLayout>
    );
  }
  
  // Mock data if API isn't implemented yet
  const data = dashboardData || {
    stats: {
      totalUsers: 1,
      totalAdmins: 3,
      systemHealth: {
        healthScore: "98.7%",
        uptime: "99.99%"
      }
    },
    recentUsers: [
      {
        _id: "1",
        name: "Karan",
        email: "karangupta050705@gmail.com",
        createdAt: "2023-06-05T00:00:00.000Z"
      }
    ],
    systemAlerts: [
      {
        type: "security",
        severity: "high",
        message: "3 failed login attempts detected from IP 192.168.1.45",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        type: "update",
        severity: "info",
        message: "New version 2.4.1 available for deployment",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get alert icon based on type and severity
  const getAlertIcon = (type, severity) => {
    if (type === "security" && severity === "high") {
      return <FiAlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (type === "update") {
      return <FiInfo className="h-5 w-5 text-blue-500" />;
    } else {
      return <FiInfo className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <FounderDashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Founder Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Welcome, {founder?.name || 'Founder'}
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h2>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
          
          {/* Super Admins */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <FiShield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Super Admins</h2>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.stats.totalAdmins}
                </p>
              </div>
            </div>
          </div>
          
          {/* System Health */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30">
                <FiActivity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</h2>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.stats.systemHealth.healthScore}
                </p>
              </div>
            </div>
          </div>
          
          {/* Uptime */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</h2>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.stats.systemHealth.uptime}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Alerts
          </h2>
          
          <div className="space-y-4">
            {data.systemAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-md ${
                  alert.type === "security" && alert.severity === "high"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <div className="flex items-start">
                  {getAlertIcon(alert.type, alert.severity)}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      alert.type === "security" && alert.severity === "high"
                        ? "text-red-800 dark:text-red-300"
                        : "text-blue-800 dark:text-blue-300"
                    }`}>
                      {alert.type === "security" ? "Security Alert" : "System Update"}
                    </p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent User Registrations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent User Registrations
          </h2>
          
          {data.recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {data.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <FiCheckCircle className="h-4 w-4 mr-1" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No recent user registrations</p>
            </div>
          )}
        </div>
      </div>
    </FounderDashboardLayout>
  );
};

export default FounderDashboard; 