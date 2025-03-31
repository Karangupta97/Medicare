import React, { useState, useRef, useEffect } from "react";
import myVideo from "../assets/Email.mp4";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError("");
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setOtp(new Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      setSuccess(true);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setError("");
    } else if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setError("");
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
      setError("");
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setSuccess(true);
      // Handle successful verification (e.g., redirect to dashboard)
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5]">
      <div className="w-[1700px] h-[900px] left-[110px] top-[10px] absolute opacity-60 bg-[#f0f7ff] rounded-[72px] blur-[3px] backdrop-blur-[100px]" />
      <div className="w-[1600px] h-[800px] opacity-60 absolute rounded-[72px]">
        <video
          className="w-[686px] h-[800px] left-5 top-5 absolute rounded-[75px] shadow-2xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={myVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[511.03px] h-[521px] absolute left-[55%] top-80"
      >
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-4xl text-[#252A61] font-bold font-['Montserrat Alternates'] mb-2">
            Verify Your Email
          </h2>
          <p className="text-xl font-['Montserrat Alternates'] text-[#252A61] text-center">
            Enter the 6-digit code sent to your email address
          </p>

          <div className="flex space-x-3" onPaste={handlePaste}>
            {otp.map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                className="w-[63px] h-[63px] text-center text-2xl font-['Montserrat Alternates'] border rounded-[50px] text-[#252A61] bg-[#f0f7ff] border-2 mt-2 mb-1 focus:outline-none focus:border-[#252A61] transition-all duration-200"
                value={otp[index]}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-['Montserrat Alternates']"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-sm font-['Montserrat Alternates']"
            >
              Code sent successfully!
            </motion.p>
          )}

          <div className="mt-4 mb-8">
            {canResend ? (
              <button 
                className="text-[#252A61] hover:text-[#252A80] transition-colors duration-200 font-['Montserrat Alternates']"
                onClick={handleResend}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Code"}
              </button>
            ) : (
              <p className="text-gray-600 font-['Montserrat Alternates']">
                Resend Code in {timer}s
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-[250px] h-[60.4px] bg-[#252A61] text-white text-2xl font-semibold font-['Montserrat Alternates'] px-6 py-2 rounded-[50px] mt-4 hover:bg-[#252A80] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
