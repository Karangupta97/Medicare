import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUserShield, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaUsers, 
  FaHospital,
  FaChartLine,
  FaCog,
  FaMoneyBillWave,
  FaBell,
  FaDatabase
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const FounderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [founderData, setFounderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFounderData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/founder/profile`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setFounderData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching founder data:', error);
        if (error.response?.status === 401) {
          toast.error('Please login to access the dashboard');
          navigate('/founder/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFounderData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/founder/logout`,
        {},
        { withCredentials: true }
      );
      toast.success('Logged out successfully');
      navigate('/founder/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewPanel />;
      case 'users':
        return <UsersPanel />;
      case 'hospitals':
        return <HospitalsPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'settings':
        return <SettingsPanel founderData={founderData} />;
      case 'billing':
        return <BillingPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'database':
        return <DatabasePanel />;
      default:
        return <OverviewPanel />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white">
        <div className="p-4">
          <div className="flex items-center justify-center p-2 mb-8">
            <FaUserShield className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">Founder Panel</h1>
          </div>
          
          <nav>
            <SidebarItem 
              icon={<FaTachometerAlt />} 
              text="Overview" 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <SidebarItem 
              icon={<FaUsers />} 
              text="Users" 
              isActive={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
            />
            <SidebarItem 
              icon={<FaHospital />} 
              text="Hospitals" 
              isActive={activeTab === 'hospitals'} 
              onClick={() => setActiveTab('hospitals')} 
            />
            <SidebarItem 
              icon={<FaChartLine />} 
              text="Analytics" 
              isActive={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
            />
            <SidebarItem 
              icon={<FaMoneyBillWave />} 
              text="Billing" 
              isActive={activeTab === 'billing'} 
              onClick={() => setActiveTab('billing')} 
            />
            <SidebarItem 
              icon={<FaBell />} 
              text="Notifications" 
              isActive={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
            />
            <SidebarItem 
              icon={<FaDatabase />} 
              text="Database" 
              isActive={activeTab === 'database'} 
              onClick={() => setActiveTab('database')} 
            />
            <SidebarItem 
              icon={<FaCog />} 
              text="Settings" 
              isActive={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            
            <div className="border-t border-indigo-600 my-4"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center text-white opacity-75 hover:opacity-100 py-2 px-4 w-full"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, isActive, onClick }) => {
  return (
    <button
      className={`flex items-center py-2 px-4 w-full ${
        isActive
          ? 'bg-indigo-800 text-white'
          : 'text-white opacity-75 hover:opacity-100 hover:bg-indigo-600'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

// Dashboard Panels
const OverviewPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard 
        title="Total Users" 
        value="1,234" 
        icon={<FaUsers className="h-8 w-8 text-blue-500" />} 
      />
      <DashboardCard 
        title="Total Hospitals" 
        value="56" 
        icon={<FaHospital className="h-8 w-8 text-green-500" />} 
      />
      <DashboardCard 
        title="Active Sessions" 
        value="298" 
        icon={<FaChartLine className="h-8 w-8 text-purple-500" />} 
      />
      
      <div className="md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Check
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <StatusRow service="API Server" status="Operational" uptime="99.9%" lastCheck="2 minutes ago" />
              <StatusRow service="Database" status="Operational" uptime="99.8%" lastCheck="5 minutes ago" />
              <StatusRow service="Storage" status="Operational" uptime="100%" lastCheck="10 minutes ago" />
              <StatusRow service="Email Service" status="Operational" uptime="99.7%" lastCheck="15 minutes ago" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ service, status, uptime, lastCheck }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{service}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {uptime}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lastCheck}
      </td>
    </tr>
  );
};

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty panel templates - would be filled with actual data in a real application
const UsersPanel = () => <div className="bg-white p-6 rounded-lg shadow">Users management panel</div>;
const HospitalsPanel = () => <div className="bg-white p-6 rounded-lg shadow">Hospitals management panel</div>;
const AnalyticsPanel = () => <div className="bg-white p-6 rounded-lg shadow">Analytics panel</div>;
const BillingPanel = () => <div className="bg-white p-6 rounded-lg shadow">Billing and payments panel</div>;
const NotificationsPanel = () => <div className="bg-white p-6 rounded-lg shadow">Notifications panel</div>;
const DatabasePanel = () => <div className="bg-white p-6 rounded-lg shadow">Database management panel</div>;

// Settings Panel with Email/Password Management
const SettingsPanel = ({ founderData }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changeType, setChangeType] = useState(''); // 'password' or 'email'

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/founder/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('OTP sent to your email');
        setShowOtpField(true);
        setChangeType('password');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error during password change request';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error('New email is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/founder/request-email-change`,
        { newEmail, password: currentPassword },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('OTP sent to your current email');
        setShowOtpField(true);
        setChangeType('email');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error during email change request';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('OTP is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let response;
      
      if (changeType === 'password') {
        response = await axios.post(
          `${API_URL}/api/founder/verify-password-change`,
          { otp, newPassword },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${API_URL}/api/founder/verify-email-change`,
          { otp },
          { withCredentials: true }
        );
      }
      
      if (response.data.success) {
        toast.success(`${changeType === 'password' ? 'Password' : 'Email'} changed successfully`);
        setShowOtpField(false);
        setOtp('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewEmail('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error during ${changeType} change verification`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
      
      {showOtpField ? (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-4">Verify OTP</h3>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP from Email
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowOtpField(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Processing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-md font-medium mb-4">Change Email</h3>
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div>
                <label htmlFor="current-email" className="block text-sm font-medium text-gray-700">
                  Current Email
                </label>
                <input
                  type="email"
                  id="current-email"
                  value={founderData?.email || ''}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">
                  New Email
                </label>
                <input
                  type="email"
                  id="new-email"
                  name="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="password-for-email" className="block text-sm font-medium text-gray-700">
                  Current Password (for verification)
                </label>
                <input
                  type="password"
                  id="password-for-email"
                  name="passwordForEmail"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Processing...' : 'Change Email'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default FounderDashboard; 