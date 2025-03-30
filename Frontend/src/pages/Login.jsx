import React from "react";
import LoginImage from "../assets/Login.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] px-6 md:px-12 lg:px-20">
      <div className="absolute w-[95%] md:w-[1700px] h-[85%] md:h-[900px] opacity-60 bg-[#f0f7ff] rounded-[50px] blur-[3px] backdrop-blur-[80px]" />

      <div className="relative flex flex-col md:flex-row items-center w-full max-w-[1400px] space-y-10 md:space-y-0 md:space-x-16">
        {/* Image Section - Hidden on Mobile */}
        <div className="hidden md:flex w-[60%] lg:w-[55%] justify-center">
          <img
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-[50px] shadow-2xl"
            src={LoginImage}
            alt="Login"
          />
        </div>

        {/* Form Section - Responsive */}
        <div className="w-full md:w-[40%] lg:w-[45%] bg-white bg-opacity-60 p-8 md:p-12 rounded-[30px] shadow-lg flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl text-[#252A61] font-bold mb-2 text-center">Welcome Back!</h2>
          <p className="text-md md:text-lg text-[#555] mb-6 text-center">Please log in to access your account.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col space-y-6 w-full">
            {/* Email Input */}
            <div className="w-full">
              <label className="text-[#252A61] text-base font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-4 mt-2 rounded-[50px] border-2 border-[#252A61] bg-[#f0f7ff] text-[#717171] text-base font-semibold focus:ring-2 focus:ring-[#252A61] focus:outline-none"
                placeholder="Enter Email"
              />
            </div>

            {/* Password Input */}
            <div className="w-full">
              <label className="text-[#252A61] text-base font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 px-4 mt-2 rounded-[50px] border-2 border-[#252A61] bg-[#f0f7ff] text-[#717171] text-base font-semibold focus:ring-2 focus:ring-[#252A61] focus:outline-none"
                placeholder="Enter Password"
              />
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm font-semibold text-[#252A61] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#252A61] text-white text-xl font-semibold rounded-[50px] hover:bg-[#1c204f] transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-lg font-semibold text-[#31303c]">
            Don’t have an account?&nbsp;
            <Link to="/signup" className="text-[#252A61] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
