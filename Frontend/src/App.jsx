import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';


import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Test from "./pages/Test";
import Test1 from "./pages/Test1";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import WorkingOnIt from "./pages/WorkingOnIt";

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

const App = () => {
  const { isCheckingAuth, isAuthenticated, checkAuth, user, refreshUserData } = useAuthStore();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize user data from the server when app loads
    refreshUserData();
  }, [refreshUserData]);

  useEffect(() => {
    // Store the current path when it changes
    setCurrentPath(location.pathname);
    console.log("Path changed to:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Check auth on mount and when path changes
    const verifyAuth = async () => {
      console.log("Starting verifyAuth...", {
        currentPath,
        isCheckingAuth,
        isAuthenticated,
        hasUser: !!user,
      });

      try {
        setIsInitialized(false);
        await checkAuth();
        console.log("Auth check completed successfully");
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsInitialized(true);
        console.log("Auth initialization completed", {
          isInitialized: true,
          isCheckingAuth,
          isAuthenticated,
          hasUser: !!user,
        });
      }
    };

    verifyAuth();
  }, [currentPath]); // Add currentPath as dependency to recheck auth on route changes

  // Show loading state while checking authentication
  if (isCheckingAuth || !isInitialized) {
    console.log("Showing loading state:", { isCheckingAuth, isInitialized });
    return <Loading />;
  }

  console.log("Current auth state:", {
    isAuthenticated,
    hasUser: !!user,
    currentPath,
    isVerified: user?.isverified,
  });

  // If not authenticated and not on login/signup pages, redirect to login
  if (
    !isAuthenticated &&
    !["/login", "/signup", "/forgot-password", "/reset-password", "/"].includes(
      currentPath
    )
  ) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login/signup pages, redirect to dashboard
  if (
    isAuthenticated &&
    ["/login", "/signup", "/forgot-password", "/reset-password"].includes(
      currentPath
    )
  ) {
    console.log("Authenticated on auth page, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not verified and not on verify-email page, redirect to verify-email
  if (user && !user.isverified && currentPath !== "/verify-email") {
    console.log("User not verified, redirecting to verify-email");
    return <Navigate to="/verify-email" replace />;
  }

  console.log("Rendering main app content");
  return (
    <>
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
          path="*"
          element={
            <ProtectedRoute>
              <WorkingOnIt />
            </ProtectedRoute>
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
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/loading" element={<Loading />} />
      </Routes>
      <Toaster position="top-center" />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
