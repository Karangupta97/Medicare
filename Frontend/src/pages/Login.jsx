import React, { useState } from "react";
import MedicalLoginImage from "../assets/Login.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FaUserShield, FaLock, FaStethoscope, FaClinicMedical } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[32px] shadow-2xl overflow-hidden border border-[#B8C5FD]/20">
        {/* Medical Branding Section */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#252A61] to-[#5267D3]">
          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="p-4 bg-[#B8C5FD]/10 rounded-2xl mb-6">
                <FaClinicMedical className="w-16 h-16 text-[#B8C5FD]" />
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#B8C5FD] to-white bg-clip-text text-transparent">
                MedSecure+
              </h1>
              <p className="text-lg text-[#B8C5FD] font-medium">
                Next-Gen Healthcare Platform
              </p>
            </div>
            
            <div className="space-y-6 mt-8">
              {[
                { icon: FaUserShield, text: "HIPAA-Compliant Access" },
                { icon: FaLock, text: "Bank-Level Encryption" },
                { icon: FaStethoscope, text: "Real-Time Analytics" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 px-6 py-3.5 bg-white/5 rounded-xl backdrop-blur-sm">
                  <item.icon className="w-7 h-7 text-[#B8C5FD] flex-shrink-0" />
                  <span className="text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <img
            src={MedicalLoginImage}
            alt="Medical professionals collaborating"
            className="w-full h-full object-cover mix-blend-lighten opacity-90"
          />
        </div>

        {/* Auth Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-14 lg:p-16">
          <form onSubmit={handleLogin} className="w-full max-w-[440px] space-y-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="p-2.5 bg-[#718CFB]/10 rounded-xl">
                  <FaClinicMedical className="w-10 h-10 text-[#718CFB]" />
                </div>
                <span className="text-[32px] font-bold text-[#252A61] tracking-tight">
                  MEDSECURE+
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-[#252A61] mb-2">
                Secure Provider Portal
              </h1>
              <p className="text-[#718CFB] text-lg font-medium">
                Authorized Access Only
              </p>
            </div>

            {/* Credential Inputs */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#252A61] uppercase tracking-wide">
                  Institutional Email
                </label>
                <div className="relative">
                  <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB] text-lg" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-3.5 text-base rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-[3px] focus:ring-[#B8C5FD]/20 placeholder-[#718CFB]/80 bg-white/50"
                    placeholder="provider@healthcare.org"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#252A61] uppercase tracking-wide">
                  Access Credentials
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB] text-lg" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={12}
                    className="w-full pl-12 pr-5 py-3.5 text-base rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-[3px] focus:ring-[#B8C5FD]/20 placeholder-[#718CFB]/80 bg-white/50"
                    placeholder="Enter 12-character passphrase"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#718CFB] hover:text-[#252A61] hover:underline transition-colors"
                  >
                    Credential Assistance
                  </Link>
                </div>
              </div>
            </div>

            {/* Error Handling */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <FaLock className="flex-shrink-0 text-red-600" />
                <span><strong>Access Denied:</strong> {error}</span>
              </div>
            )}

            {/* Auth Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#718CFB] to-[#5267D3] hover:from-[#5267D3] hover:to-[#718CFB] text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:shadow-[#B8C5FD]/30 group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <FaStethoscope className="w-5 h-5 text-white/90 group-hover:animate-pulse" />
                  <span>Secure Authentication</span>
                </>
              )}
            </button>

            {/* Security Assurance */}
            <div className="pt-8 border-t border-[#B8C5FD]/20">
              <div className="flex flex-col items-center gap-3 text-sm text-[#718CFB]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#252A61]/10 rounded-lg">
                    <FaLock className="w-4 h-4 text-[#252A61]" />
                  </div>
                  <span>256-bit AES Encrypted Connection</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#252A61]/10 rounded-lg">
                    <FaClinicMedical className="w-4 h-4 text-[#252A61]" />
                  </div>
                  <span>HIPAA Certified Infrastructure</span>
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            <div className="text-center text-[#718CFB] text-sm font-medium">
              New institution?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#252A61] hover:text-[#718CFB] underline hover:no-underline transition-colors"
              >
                Request System Access
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;