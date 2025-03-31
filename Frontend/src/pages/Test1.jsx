import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FaPhone, FaLock } from "react-icons/fa";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(mobile, password);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#252A61] mb-2">MeFy</h1>
          <p className="text-[#718CFB] text-lg">Doctor Web App</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Mobile Input */}
          <div>
            <label className="block text-sm font-medium text-[#252A61] mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#252A61] focus:ring-2 focus:ring-[#B8C5FD]/30"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#252A61] mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718CFB]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#B8C5FD] focus:border-[#252A61] focus:ring-2 focus:ring-[#B8C5FD]/30"
                placeholder="Enter password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#252A61] hover:bg-[#718CFB] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 flex justify-center space-x-4 text-sm">
          <Link
            to="/signup"
            className="text-[#718CFB] hover:text-[#252A61] hover:underline"
          >
            Signup
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            to="/reset-password"
            className="text-[#718CFB] hover:text-[#252A61] hover:underline"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;