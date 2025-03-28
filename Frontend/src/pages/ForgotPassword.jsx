import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  const { forgotPassword } = useAuthStore(); // Call specific action from store

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await forgotPassword(email); // Call store action

      toast.success("Password reset link sent successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] px-4">
      {/* Background Blur */}
      <div className="absolute w-[90%] md:w-[1700px] h-[80%] md:h-[900px] opacity-60 bg-[#f0f7ff] rounded-[72px] blur-[3px] backdrop-blur-[80px]" />

      {/* Main Content */}
      <div className="z-10 max-w-lg w-full bg-white/30 p-10 rounded-[40px] shadow-lg backdrop-blur-md flex flex-col items-center text-center space-y-6">
        <h2 className="text-5xl font-bold text-[#252a61]">Forgot Password</h2>

        <p className="text-[#717171] text-base font-semibold">
          Enter your email address and we’ll send you <br /> a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-[#252a61] mb-2 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full p-4 rounded-full bg-white/50 text-[#252a61] focus:outline-none focus:ring-2 focus:ring-[#252a61]"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-[200px] bg-[#252a61] text-white py-3 rounded-full text-xl font-semibold hover:bg-[#3b3b98] transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div>
          <Link
            to="/login"
            className="text-[#31303c] text-lg font-semibold hover:underline"
          >
            <ArrowLeft className="h-6 w-6 mr-2 inline-block" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
