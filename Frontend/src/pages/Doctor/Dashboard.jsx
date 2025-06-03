import React, { useEffect } from 'react';
import { useDoctorStore } from '../../store/doctorStore';
import { FaStethoscope, FaUserMd, FaHospital, FaCalendarAlt, FaClipboardList, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const DoctorDashboard = () => {
  const { isAuthenticated, doctor, getDoctorProfile, logoutDoctor, isLoading } = useDoctorStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getDoctorProfile();
    }
  }, [isAuthenticated, getDoctorProfile]);

  const handleLogout = async () => {
    await logoutDoctor();
    navigate('/doctor/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/doctor/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard | Medicare</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <FaStethoscope className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Medicare Doctor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none">
                  <span>{doctor?.fullName}</span>
                  <img
                    className="h-10 w-10 rounded-full bg-gray-200"
                    src={doctor?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.fullName || 'Doctor')}&background=indigo&color=fff`}
                    alt="Doctor profile"
                  />
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaSignOutAlt className="mr-2 -ml-0.5 h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Verification Status Banner */}
        {doctor?.isVerified !== "approved" && (
          <div className={`w-full ${doctor?.isVerified === "rejected" ? "bg-red-600" : "bg-yellow-500"} text-white px-4 py-2`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-sm font-medium">
                {doctor?.isVerified === "pending" ? (
                  "Your account is pending verification. You will have limited access until approved."
                ) : (
                  "Your account verification was rejected. Please contact support for more information."
                )}
              </p>
              {doctor?.isVerified === "rejected" && doctor?.rejectionReason && (
                <div className="ml-4 text-sm">
                  Reason: {doctor?.rejectionReason}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="bg-indigo-800 text-white w-64 shrink-0 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center h-16 border-b border-indigo-700">
                <span className="text-xl font-semibold">Dr. {doctor?.fullName?.split(' ')[0]}</span>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link to="/doctor/dashboard" className="bg-indigo-900 text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <FaUserMd className="mr-3 h-5 w-5 text-indigo-300" />
                  Dashboard
                </Link>
                <Link to="/doctor/patients" className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <FaUsers className="mr-3 h-5 w-5 text-indigo-300" />
                  Patients
                </Link>
                <Link to="/doctor/appointments" className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <FaCalendarAlt className="mr-3 h-5 w-5 text-indigo-300" />
                  Appointments
                </Link>
                <Link to="/doctor/medical-records" className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <FaClipboardList className="mr-3 h-5 w-5 text-indigo-300" />
                  Medical Records
                </Link>
                <Link to="/doctor/hospitals" className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <FaHospital className="mr-3 h-5 w-5 text-indigo-300" />
                  Affiliated Hospitals
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
              
              {/* Account Status Section */}
              <div className={`mb-8 p-6 rounded-lg shadow bg-white border-l-4 ${
                doctor?.isVerified === "approved" 
                  ? "border-green-500" 
                  : doctor?.isVerified === "pending"
                    ? "border-yellow-500"
                    : "border-red-500"
              }`}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Status</h3>
                <div className="flex items-center mb-4">
                  <div className={`h-3 w-3 rounded-full mr-2 ${
                    doctor?.isVerified === "approved" 
                      ? "bg-green-500" 
                      : doctor?.isVerified === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}></div>
                  <span className="font-medium">
                    {doctor?.isVerified === "approved" 
                      ? "Verified" 
                      : doctor?.isVerified === "pending"
                        ? "Pending Verification"
                        : "Verification Rejected"
                    }
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {doctor?.isVerified === "approved" 
                    ? "Your account is fully verified. You have access to all Medicare doctor features." 
                    : doctor?.isVerified === "pending"
                      ? "Your account is currently under review. Once approved, you'll have full access to the platform. This usually takes 1-3 business days."
                      : "Your account verification was rejected. Please contact support for assistance or submit a new application."
                  }
                </p>
                {doctor?.isVerified === "rejected" && doctor?.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    <strong>Reason for rejection:</strong> {doctor.rejectionReason}
                  </div>
                )}
              </div>
              
              {/* Dashboard Content - Coming Soon */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-8">
                  <FaStethoscope className="mx-auto h-12 w-12 text-indigo-600" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Welcome to your Doctor Dashboard</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We're still building doctor-specific features. Please check back soon for updates.
                  </p>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Your Account Information</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Doctor ID</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.doctorId || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Full Name</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.fullName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Phone</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Medical Registration</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.medicalRegistrationNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Medical Council</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.councilName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">State</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.state || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Specialization</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.specialization || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard; 