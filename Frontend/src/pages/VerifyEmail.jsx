import React, { useState, useRef, useEffect } from "react";
import myVideo from "../assets/Email.mp4";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail, resendOtp } = useAuthStore();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
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
      toast.error("Failed to send OTP. Please try again.");
      console.error("resend OTP");
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

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      pastedData.split("").forEach((digit, idx) => {
        inputRefs.current[idx].value = digit;
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const verificationCode = otp.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto submit when all fields filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [otp]);

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] px-4">
      {/* Background Blur */}
      <div className="absolute w-[95%] md:w-[1700px] h-[80%] md:h-[900px] opacity-60 bg-[#f0f7ff] rounded-[50px] blur-[3px] backdrop-blur-[80px]" />

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center w-full max-w-6xl bg-transparent md:space-x-10 space-y-10 md:space-y-0">
        {/* Video */}
        <div className="w-full md:w-1/2 flex justify-center">
          <video
            className="w-full max-w-md rounded-[40px] opacity-80 shadow-2xl"
            autoPlay
            loop
            muted
          >
            <source src={myVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Verification Box */}
        <div className="w-full md:w-1/2 bg-white bg-opacity-60 p-8 rounded-[30px] shadow-lg flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl text-[#252A61] font-bold mb-4 text-center">
            Verify Your Email
          </h2>
          <p className="text-center text-[#252A61] mb-4 text-sm md:text-base">
            Enter the 6-digit code sent to your email address
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 w-full">
            <div className="flex space-x-2" onPaste={handlePaste}>
              {otp.map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 md:w-14 md:h-14 text-center text-xl border-2 border-gray-400 rounded-full focus:border-[#252A61] focus:outline-none text-[#252A61]"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            <div>
              {canResend ? (
                <button
                  type="button"
                  className="text-blue-700 underline"
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-gray-600">Resend Code in {timer}s</p>
              )}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="bg-[#252A61] w-full py-3 rounded-full text-white font-semibold hover:bg-[#1c204f] transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
