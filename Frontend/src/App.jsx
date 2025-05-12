import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("founder_token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // Token exists, consider authenticated
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate.pathname]);

  if (isLoading) {
    return <Loading />;
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
