import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useFounderStore } from "./store/founderStore";

//Admin
//User
import Dashboard from "./pages/User/Dashboard";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import ForgotPassword from "./pages/User/ForgotPassword";
import VerifyEmail from "./pages/User/VerifyEmail";
import ResetPassword from "./pages/User/ResetPassword";
import Reports from "./pages/User/Reports";
import Upload from "./pages/User/Upload";
import Profile from "./pages/User/Profile";
import Notifications from "./pages/User/Notifications";
import AllDigitalPrescriptions from "./pages/User/AllDigitalPrescriptions";
import DigitalPrescriptionDetail from "./pages/User/DigitalPrescriptionDetail";
import PrescriptionReminders from "./pages/User/PrescriptionReminders";
//Hospital
import FindPatient from "./pages/Hospital/FindPatient";
import HospitalDashboard from "./pages/Hospital/HospitalDashboard";
//Founder
import FounderLogin from "./pages/Founder/FounderLogin";
import FounderDashboard from "./pages/Founder/FounderDashboard";
import TeamManagement from "./pages/Admin/Team/TeamManagement";
// Staff Management
import StaffDirectoryPage from "./pages/FounderDashboard/StaffDirectory/StaffDirectoryPage";
import AddStaffPage from "./pages/FounderDashboard/StaffDirectory/AddStaffPage";
import EditStaffPage from "./pages/FounderDashboard/StaffDirectory/EditStaffPage";
//piblic
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import WorkingOnIt from "./pages/WorkingOnIt";
import UserDetails from "./pages/User/UserDetails";
import About from "./pages/About";
import About2 from "./pages/About2";
import Test from "./pages/Test";
import Test1 from "./pages/Test1";
import Team from "./pages/Team";
//components
import Loading from "./components/Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // If we're still checking authentication, show loading state
  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isverified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // If we're still checking authentication, show loading state
  if (isCheckingAuth) {
    return <Loading />;
  }

  if (isAuthenticated && user?.isverified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected route specifically for founder
const FounderRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useFounderStore();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check authentication status when the component mounts, but only once
    const verifyAuth = async () => {
      try {
        if (!authChecked) {
          await checkAuth();
          setAuthChecked(true);
        }
      } catch (err) {
        console.error("Founder authentication check failed:", err);
        setError(err.message);
        // We'll still mark auth as checked, but with an error
        setAuthChecked(true);
      }
    };
    
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !authChecked) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="mb-6 text-gray-700">{error || "Failed to authenticate. Please try logging in again."}</p>
          <button 
            onClick={() => navigate("/founder/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/founder/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Admin */}
        {/* User */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <AllDigitalPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription/:id"
          element={
            <ProtectedRoute>
              <DigitalPrescriptionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-reminders"
          element={
            <ProtectedRoute>
              <PrescriptionReminders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        {/* Hospital */}
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/find-patient"
          element={
            <ProtectedRoute>
              <FindPatient />
            </ProtectedRoute>
          }
        />
        
        {/* Founder Routes */}
        <Route path="/founder/login" element={<FounderLogin />} />
        <Route
          path="/founder/dashboard"
          element={
            <FounderRoute>
              <FounderDashboard />
            </FounderRoute>
          }
        />
        <Route
          path="/founder/team-management"
          element={
            <FounderRoute>
              <TeamManagement />
            </FounderRoute>
          }
        />
        
        {/* Staff Directory Routes */}
        <Route
          path="/founder/staff"
          element={
            <FounderRoute>
              <StaffDirectoryPage />
            </FounderRoute>
          }
        />
        <Route
          path="/founder/staff/add"
          element={
            <FounderRoute>
              <AddStaffPage />
            </FounderRoute>
          }
        />
        <Route
          path="/founder/staff/edit/:staffId"
          element={
            <FounderRoute>
              <EditStaffPage />
            </FounderRoute>
          }
        />
        
        {/* Auth */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about2" element={<About2 />} />
        <Route path="/team" element={<Team />} />
        <Route path="/working-on-it" element={<WorkingOnIt />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test1" element={<Test1 />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />

      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
