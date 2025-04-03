import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Test from "./pages/Test";
import Test1 from "./pages/Test1";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Upload from "./pages/Upload";

import Loading from "./components/Loading";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";

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

const App = () => {
  const { isCheckingAuth, isAuthenticated, checkAuth, user } = useAuthStore();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Store the current path when it changes
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  
  useEffect(() => {
    // Check auth once on mount
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    verifyAuth();
  }, []); // Empty dependency array to run only once on mount

  // Show loading state while checking authentication
  if (isCheckingAuth || !isInitialized) return <Loading />;
  
  // Remove console logs to prevent spam
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("user", user);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <VerifyEmail />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test1" element={<Test1 />} />
        <Route path="/loading" element={<Loading />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
};

export default App;
