import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupImage from "../assets/Sing.png";
import { useAuthStore } from "../store/authStore";
import { FaUser, FaEnvelope, FaLock, FaStethoscope } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(name, lastname, email, password);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#252A61] to-[#718CFB]">
          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="p-4 bg-[#B8C5FD]/10 rounded-2xl mb-6">
                <FaStethoscope className="w-16 h-16 text-[#B8C5FD]" />
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#B8C5FD] to-white bg-clip-text text-transparent">
                Join MedSecure+
              </h1>
              <p className="text-lg text-[#B8C5FD] font-medium">
                Start Your Secure Medical Journey
              </p>
            </div>
            
            <div className="space-y-6 mt-8">
              {[
                { icon: FaUser, text: "HIPAA-Compliant Profiles" },
                { icon: FaLock, text: "Military-Grade Encryption" },
                { icon: FaEnvelope, text: "Secure Communications" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 px-6 py-3.5 bg-white/5 rounded-xl backdrop-blur-sm">
                  <item.icon className="w-7 h-7 text-[#B8C5FD]" />
                  <span className="text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <img
            src={SignupImage}
            alt="Medical professionals collaborating"
            className="w-full h-full object-cover mix-blend-lighten opacity-90"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-14 lg:p-16">
          <form onSubmit={handleSignup} className="w-full max-w-[440px] space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#252A61]">Create Account</h1>
              <p className="text-[#718CFB] text-lg mt-2">Register for secure access</p>
            </div>

            {/* Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#252A61] mb-2">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-2 focus:ring-[#B8C5FD]/30 placeholder-[#718CFB]/80"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#252A61] mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-2 focus:ring-[#B8C5FD]/30 placeholder-[#718CFB]/80"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-[#252A61] mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-2 focus:ring-[#B8C5FD]/30 placeholder-[#718CFB]/80"
                  placeholder="john.doe@healthcare.org"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-[#252A61] mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={12}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#718CFB] focus:ring-2 focus:ring-[#B8C5FD]/30 placeholder-[#718CFB]/80"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                <strong>Registration Error:</strong> {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#718CFB] to-[#252A61] hover:from-[#252A61] hover:to-[#718CFB] text-white font-semibold py-4 rounded-xl transition-all duration-300"
            >
              {isLoading ? "Creating Account..." : "Sign Up Now"}
            </button>

            {/* Login Link */}
            <div className="text-center text-[#718CFB] text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#252A61] hover:text-[#718CFB] underline hover:no-underline"
              >
                Login here
              </Link>
            </div>

            {/* Security Assurance */}
            <div className="pt-6 border-t border-[#B8C5FD]/20">
              <div className="flex flex-col items-center gap-2 text-sm text-[#718CFB]">
                <div className="flex items-center gap-2">
                  <FaLock className="w-4 h-4 text-[#252A61]" />
                  <span>256-bit AES Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-[#252A61]" />
                  <span>HIPAA Compliant Registration</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;