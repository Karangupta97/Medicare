import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiKey, FiLock, FiMail, FiShield, FiAlertCircle } from "react-icons/fi";
import Logo from "../../assets/logo.png";
import { useFounderStore } from "../../store/founderStore";

const FounderLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP
  const navigate = useNavigate();
  
  // Use founder store hooks
  const { 
    initiateLogin, 
    verifyOtp, 
    resendOtp,
    isLoading,
    error,
    tempToken
  } = useFounderStore();

  // Handle first login step (email/password)
  const handleFirstStep = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const response = await initiateLogin(email, password);
      
      if (response.success) {
        toast.success("OTP sent to your email");
        setStep(2); // Move to OTP verification step
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(error || "Login failed. Please try again.");
    }
  };

  // Handle OTP verification step
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    try {
      const response = await verifyOtp(otp);
      
      if (response.success) {
        toast.success("Login successful");
        navigate("/founder/dashboard");
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(error || "Verification failed. Please try again.");
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await resendOtp();
      if (response.success) {
        toast.success("New OTP sent to your email");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(error || "Failed to resend OTP. Please try again.");
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
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Authenticating..." : "Continue with 2FA"}
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
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Go back to login
        </button>
        
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Resend code
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
          
          {/* Display error message if any */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          
          {step === 1 ? renderLoginForm() : renderOtpForm()}
        </div>
      </div>
    </div>
  );
};

export default FounderLogin; 