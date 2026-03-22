import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./store/Patient/authStore";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useFounderStore } from "./store/founderStore";
import { useStaffStore } from "./store/staffStore";
import { useDoctorStore } from "./store/doctorStore";
import RestoreButton from "./components/RestoreButton";

//Admin
//Patient
import Dashboard from "./pages/User/Dashboard";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import ForgotPassword from "./pages/User/ForgotPassword";
import VerifyEmail from "./pages/User/VerifyEmail";
import ResetPassword from "./pages/User/ResetPassword";
import Reports from "./pages/User/Reports";
import EmergencyFolder from "./pages/User/EmergencyFolder";
import EmergencyFolderPublic from "./pages/User/EmergencyFolderPublic";
import Upload from "./pages/User/Upload";
import Profile from "./pages/User/Profile";
import Notifications from "./pages/User/Notifications";
import AllDigitalPrescriptions from "./pages/User/AllDigitalPrescriptions";
import DigitalPrescriptionDetail from "./pages/User/DigitalPrescriptionDetail";
import PrescriptionReminders from "./pages/User/PrescriptionReminders";
import UserLookup from "./pages/User/UserLookup";
import PincodeLookup from "./pages/User/DashboardPincodeLookup";
import Settings from "./pages/User/Settings";
//Hospital
import FindPatient from "./pages/Hospital/FindPatient";
import HospitalDashboard from "./pages/Hospital/HospitalDashboard";
//Founder
import FounderLogin from "./pages/Founder/FounderLogin";
import FounderDashboard from "./pages/Founder/FounderDashboard";
import TeamManagement from "./pages/Admin/Team/TeamManagement";
// Staff Management
import StaffDirectoryPage from "./pages/Founder/StaffDirectory/StaffDirectoryPage";
import AddStaffPage from "./pages/Founder/StaffDirectory/AddStaffPage";
import EditStaffPage from "./pages/Founder/StaffDirectory/EditStaffPage";
// Staff Pages
import StaffLogin from "./pages/Admin/Staff/StaffLogin";
import StaffForgotPassword from "./pages/Admin/Staff/ForgotPassword";
import ChangePassword from "./pages/Admin/Staff/ChangePassword";
import StaffDashboard from "./pages/Admin/Staff/Dashboard/StaffDashboard";
import DoctorVerification from "./pages/Admin/Staff/DoctorVerification/DoctorVerification";
// Doctor Pages
import DoctorLogin from "./pages/Doctor/Login";
import DoctorSignup from "./pages/Doctor/Signup";
import DoctorDashboard from "./pages/Doctor/Dashboard";
//piblic
import Home from "./pages/Home";
import Services from "./pages/Services";
import Service2 from "./pages/Service2";
import NotFound from "./pages/NotFound";
import WorkingOnIt from "./pages/WorkingOnIt";
import UserDetails from "./pages/User/UserDetails";
import About from "./pages/About";
import About2 from "./pages/About2";
import Test from "./pages/Test";
import Test1 from "./pages/Test1";
import Team from "./pages/Team";
import DetailReview from "./pages/DetailReview";
import HealthRecords from "./pages/User/HealthRecords";

//components
import Loading from "./components/Loading";
import DashboardLayout from "./layouts/Patient/DashboardLayout";

// Simple stub component for pending verification
const PendingVerificationStub = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Account Pending Verification
        </h1>
        <p className="text-center text-gray-600">
          Your doctor account is awaiting verification. Please check your email
          for updates.
        </p>
      </div>
    </div>
  );
};

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
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="mb-6 text-gray-700">
            {error || "Failed to authenticate. Please try logging in again."}
          </p>
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

// Protected route for staff
const StaffRoute = ({ children }) => {
  const { isAuthenticated, staffData, isLoading, checkAuthStatus } =
    useStaffStore();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication status when the component mounts, but only once
    const verifyAuth = async () => {
      try {
        if (!authChecked) {
          await checkAuthStatus();
          setAuthChecked(true);
        }
      } catch (err) {
        console.error("Staff authentication check failed:", err);
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="mb-6 text-gray-700">
            {error || "Failed to authenticate. Please try logging in again."}
          </p>
          <button
            onClick={() => navigate("/staff/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  // If it's the staff's first login, they need to change their password
  if (staffData?.isFirstLogin) {
    if (window.location.pathname !== "/staff/change-password") {
      return <Navigate to="/staff/change-password" replace />;
    }
  }

  return children;
};

// Protected route for doctors
const DoctorRoute = ({ children }) => {
  const {
    isAuthenticated,
    doctor,
    isLoading,
    isCheckingAuth,
    checkAuthStatus,
  } = useDoctorStore();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication status when the component mounts, but only once
    const verifyAuth = async () => {
      try {
        if (!authChecked) {
          await checkAuthStatus();
          setAuthChecked(true);
        }
      } catch (err) {
        console.error("Doctor authentication check failed:", err);
        setError(err.message);
        // We'll still mark auth as checked, but with an error
        setAuthChecked(true);
      }
    };

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if ((isLoading || isCheckingAuth) && !authChecked) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="mb-6 text-gray-700">
            {error || "Failed to authenticate. Please try logging in again."}
          </p>
          <button
            onClick={() => navigate("/doctor/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/doctor/login" replace />;
  }

  return children;
};

// Redirect authenticated doctor to dashboard
const RedirectAuthenticatedDoctor = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useDoctorStore();

  // If we're still checking authentication, show loading state
  if (isCheckingAuth) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const {
    isAuthenticated: isFounderAuthenticated,
    checkAuth: checkFounderAuth,
  } = useFounderStore();
  const {
    isAuthenticated: isStaffAuthenticated,
    checkAuthStatus: checkStaffAuth,
  } = useStaffStore();
  const {
    isAuthenticated: isDoctorAuthenticated,
    checkAuthStatus: checkDoctorAuth,
  } = useDoctorStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAllAuth = async () => {
      setIsLoading(true);
      try {
        if (location.pathname.startsWith("/founder")) {
          await checkFounderAuth();
        } else if (location.pathname.startsWith("/staff")) {
          await checkStaffAuth();
        } else if (location.pathname.startsWith("/doctor")) {
          await checkDoctorAuth();
        } else {
          await checkAuth();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAllAuth();
  }, [
    location.pathname,
    checkAuth,
    checkFounderAuth,
    checkStaffAuth,
    checkDoctorAuth,
  ]);

  // Custom loading component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Suspense fallback={<Loading />}>
        <Toaster position="top-center" reverseOrder={false} />
        <RestoreButton />
        <Routes>
          {/* Admin */}
          {/* User */}
          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="emergency-folder" element={<EmergencyFolder />} />
            <Route path="upload" element={<Upload />} />
            <Route
              path="digital-prescriptions"
              element={<AllDigitalPrescriptions />}
            />
            <Route
              path="digital-prescriptions/reminders"
              element={<PrescriptionReminders />}
            />
            <Route
              path="digital-prescriptions/:id"
              element={<DigitalPrescriptionDetail />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="ResetPassword" element={<ResetPassword />} />

            <Route path="user/:umid" element={<UserDetails />} />
            <Route path="user-lookup" element={<UserLookup />} />
            <Route path="pincode-lookup" element={<PincodeLookup />} />
            <Route path="settings" element={<Settings />} />

          </Route>
          <Route
            path="/health-records"
            element={
              <ProtectedRoute>
                <HealthRecords />
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
          {/* Staff Routes */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/staff/forgot-password"
            element={<StaffForgotPassword />}
          />
          <Route
            path="/staff/change-password"
            element={
              <StaffRoute>
                <ChangePassword />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <StaffRoute>
                <StaffDashboard />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/patients"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Patient Management"
                  message="Patient management features are coming soon!"
                />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Appointment Management"
                  message="Appointment scheduling features are coming soon!"
                />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/reports"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Medical Reports"
                  message="Medical reporting features are coming soon!"
                />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/team"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Team Management"
                  message="Team collaboration features are coming soon!"
                />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/notifications"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Notifications"
                  message="Notification features are coming soon!"
                />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/settings"
            element={
              <StaffRoute>
                <WorkingOnIt
                  title="Account Settings"
                  message="Account settings features are coming soon!"
                />
              </StaffRoute>
            }
          />
          {/* Doctor Routes */}
          <Route
            path="/doctor/login"
            element={
              <RedirectAuthenticatedDoctor>
                <DoctorLogin />
              </RedirectAuthenticatedDoctor>
            }
          />
          <Route
            path="/doctor/signup"
            element={
              <RedirectAuthenticatedDoctor>
                <DoctorSignup />
              </RedirectAuthenticatedDoctor>
            }
          />
          <Route
            path="/doctor/pending-verification"
            element={<PendingVerificationStub />}
          />
          <Route
            path="/doctor/dashboard"
            element={
              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>
            }
          />
          {/* Staff Doctor Verification Routes */}
          <Route
            path="/staff/doctor-verification"
            element={
              <StaffRoute>
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600">
                        Loading doctor verification interface...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This may take a moment...
                      </p>
                    </div>
                  }
                >
                  <DoctorVerification />
                </Suspense>
              </StaffRoute>
            }
          />
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service2" element={<Service2 />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/aboutus2" element={<About2 />} />
          <Route path="/team" element={<Team />} />
          <Route path="/working-on-it" element={<WorkingOnIt />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/detail-review" element={<DetailReview />} />
          <Route path="/emergency/:umid" element={<EmergencyFolderPublic />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </HelmetProvider>
  );
};

export default App;
