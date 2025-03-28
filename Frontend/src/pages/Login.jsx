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
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5]">
      <div className="w-[1700px] h-[900px] left-[110px] top-[10px] absolute opacity-60 bg-[#f0f7ff] rounded-[72px] blur-[3px] backdrop-blur-[100px]" />
      <div className="w-[1600px] h-[800px] absolute  rounded-[72px]  ">
        {/*blur-[3px]*/}
        <img
          className="w-[686px] h-[800px]  left-5 top-5 absolute rounded-[75px]"
          src={LoginImage}
          alt="Login Image"
        />
      </div>
      <div className="w-[511.03px] h-[521px] absolute left-[57%] top-50 ">
        {/*change top left  */}
        <form onSubmit={handleLogin}>
          <div className="w-44 h-[67px] left-[166.94px] top-0 absolute text-[#252a61] text-4xl font-semibold font-['Montserrat']">
            Login
          </div>
          {/* -----------Email--------------- */}
          <div className="w-[511.03px] h-[106px] left-0 top-[125px] absolute">
            <div className="w-[511px] h-[42px] px-4 py-2.5 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                Email
              </div>
            </div>
            <div className="w-[511.03px] h-[64.06px] left-0 top-[41.94px] absolute">
              <input
                type="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[511.03px] h-[64.06px]  left-0 top-[0.06] absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5 "
                placeholder="Enter Email"
              />
            </div>
          </div>
          {/* --------------------------------****************---------------------------- */}

          {/* -----------Password--------------- */}
          <div className="w-[511.03px] h-[139px] left-0 top-[248px] absolute">
            <div className="w-[511px] h-10 px-4 py-2.5 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                Password
              </div>
            </div>
            <div className="w-[511.03px] h-[63.60px] left-0 top-[41.59px] absolute">
              <input
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[511.03px] h-[64.06px]  left-0 top-[0.41px] 0.41px absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5 "
                min={8}
              />
            </div>
            <div className="w-[511px] h-[35px] px-4 py-2.5 left-0 top-[104px] absolute justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#31303c] text-xs font-bold font-['Montserrat']">
                <Link
                  to="/forgot-password"
                  className="text-[#31303c] text-sm font-bold font-['Montserrat'] hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}

          {/* -----------Login Button--------------- */}
          <div className="w-[200px] h-[60px] left-[156px] top-[405px] absolute">
            <button
              type="submit"
              className="gap-2.5 w-[200px] h-[60px] bg-[#252A61] text-white text-2xl font-semibold font-['Montserrat Alternates'] py-2 px-6 rounded-[50px]  hover:bg-[#252A81] transition"
            >
              Log In
            </button>
          </div>
          {/* --------------------------------****************---------------------------- */}
          <div className="w-[511px] h-14 p-2.5 left-0 top-[465px] absolute justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#31303c] text-lg font-semibold font-['Montserrat']">
              Don’t have an account?
            </div>
            <a
              href="/signup"
              className="text-[#31303c] text-lg font-semibold font-['Montserrat'] hover:underline transition"
            >
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
