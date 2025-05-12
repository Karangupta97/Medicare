import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiKey, FiLock, FiMail, FiShield, FiAlertCircle } from "react-icons/fi";
import Logo from "../../assets/Logo.png";

const FounderLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP
  const [tempToken, setTempToken] = useState("");
  const navigate = useNavigate();

  // Handle first login step (email/password)
  const handleFirstStep = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/founder/login`,
        { email, password },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setTempToken(response.data.tempToken);
        setStep(2); // Move to OTP verification step
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification step
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/founder/verify-otp`,
        { otp },
        { 
          headers: { Authorization: `Bearer ${tempToken}` },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success("Login successful");
        localStorage.setItem("founder_token", response.data.token);
        localStorage.setItem("founder_data", JSON.stringify(response.data.founder));
        navigate("/founder/dashboard");
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the first step (email/password form)
  const renderLoginForm = () => (
    <form onSubmit={handleFirstStep} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="founder@medicare.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Authenticating..." : "Continue with 2FA"}
        </button>
      </div>
    </form>
  );

  // Render the OTP verification form
  const renderOtpForm = () => (
    <form onSubmit={handleOtpVerification} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter 6-digit Security Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiKey className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg tracking-widest text-center font-bold sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="123456"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          A 6-digit code has been sent to your email
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Go back to login
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-center">
            <img className="h-16 w-auto" src={Logo} alt="Medicare Logo" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            Founder Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Secure access to the Medicare Founder Dashboard
          </p>
        </div>
        
        {/* Security Warning */}
        <div className="px-8 py-3 bg-red-50 dark:bg-red-900/20 border-y border-red-100 dark:border-red-900/30">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
            <p className="ml-2 text-xs text-red-600 dark:text-red-500">
              This area is restricted. Unauthorized access attempts are logged and may result in legal action.
            </p>
          </div>
        </div>
        
        <div className="px-8 pt-6 pb-8">
          {/* Security Shield Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiShield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {step === 1 ? renderLoginForm() : renderOtpForm()}
        </div>
      </div>
    </div>
  );
};

export default FounderLogin; 