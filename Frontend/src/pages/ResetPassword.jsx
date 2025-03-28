import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, error, isSubmitting, message } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);

      toast.success("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error resetting password");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5]">
      {/* Background Blur Div */}
      <div className="w-[1700px] h-[900px] absolute opacity-60 bg-[#f0f7ff] rounded-[72px] blur-[3px] backdrop-blur-[100px]" />

      {/* Password Reset Card */}
      <div className="w-[511.03px] h-auto bg-white p-10 rounded-[72px] shadow-xl relative z-10">
        <h2 className="text-[#252a61] text-5xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-[#717171] text-base font-semibold mb-6 text-center">
          Enter your new password to reset your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#252a61] mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-[#252a61] rounded-[50px] opacity-60"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#252a61] mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border-2 border-[#252a61] rounded-[50px] opacity-60"
              placeholder="Confirm password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#252a61] text-white py-4 rounded-[40px] text-xl font-semibold"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-[#31303c] font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
