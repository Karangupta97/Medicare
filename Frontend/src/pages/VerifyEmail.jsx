import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import myVideo from "../assets/Email.mp4";
import { CheckCircleIcon } from "@heroicons/react/solid";

const VerifyEmail = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { error, verifyEmail, resendOtp } = useAuthStore();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async () => {
    setOtp(new Array(6).fill(""));
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    try {
      await resendOtp();
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await verifyEmail(otp.join(""));
      setIsVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] px-4">
      {/* Background Blur */}
      <div className="absolute w-[95%] md:w-[1700px] h-[80%] opacity-60 bg-[#f0f7ff] rounded-[50px] blur-[3px] backdrop-blur-[80px]" />

      <div className="relative flex flex-col md:flex-row items-center w-full max-w-6xl bg-transparent space-y-10 md:space-y-0">
        {/* Video */}
        <div className="w-full md:w-1/2 flex justify-center">
          <video className="w-full max-w-md rounded-[40px] opacity-80 shadow-2xl" autoPlay loop muted>
            <source src={myVideo} type="video/mp4" />
          </video>
        </div>

        {/* Verification Box */}
        <div className="w-full md:w-1/2 bg-white bg-opacity-60 p-8 rounded-[30px] shadow-lg flex flex-col items-center">
          {isVerified ? (
            <div className="flex flex-col items-center">
              <CheckCircleIcon className="w-20 h-20 text-green-500" />
              <h2 className="text-2xl text-green-600 font-bold mt-4">Verified Successfully!</h2>
              <p className="text-gray-600 mt-2">Redirecting to homepage...</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl text-[#252A61] font-bold mb-4 text-center">Verify Your Email</h2>
              <p className="text-center text-[#252A61] mb-4">Enter the 6-digit code sent to your email</p>

              <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 w-full">
                <div className="flex space-x-2">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-xl border-2 border-gray-400 rounded-lg focus:border-[#252A61] focus:outline-none"
                      value={otp[index]}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  ))}
                </div>

                <div>
                  {canResend ? (
                    <button type="button" className="text-blue-700 underline" onClick={handleResend}>
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-gray-600">Resend Code in {timer}s</p>
                  )}
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                  type="submit"
                  className="bg-[#252A61] w-full py-3 rounded-lg text-white font-semibold hover:bg-[#1c204f] transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
