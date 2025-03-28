import React, { use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SignupImage from "../assets/Sing.png";
import { useAuthStore } from "../store/authStore";

const Singup = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoding } = useAuthStore();

  const handleSingup = async (e) => {
    e.preventDefault();

    try {
      await signup(name, lastname, email, password);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative flex h-screen items-center  justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5]">
      <div className="w-[1700px] h-[900px] left-[110px] top-[10px] absolute opacity-60 bg-[#f0f7ff] rounded-[72px] blur-[3px] backdrop-blur-[100px]" />
      <div className="w-[1431px] h-[800px] relative">
        <img
          className="w-[685px] h-[800px] left-[746px] top-0 absolute rounded-[50px]"
          src={SignupImage}
          alt="Login Image"
        />
        <form onSubmit={handleSingup}>
          <div className="w-[511.03px] h-[643px] left-0 top-[83px] absolute">
            <div className="w-[511.03px] h-[643px] left-0 top-0 absolute">
              <h2 className="w-[385px] h-[67px] left-[63px] top-0 absolute text-[#252a61] text-5xl font-semibold font-['Montserrat']">
                Create Account
              </h2>

              {/* -----------Name--------------- */}
              <div className="w-[251px] h-[105.40px] left-0 top-[125px] absolute">
                <div className="w-[251px] h-[42px] px-4 py-2.5 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                    Firstname
                  </div>
                </div>
                <input
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-[250.50px] h-[63px]  left-0 top-[42.40px] absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5"
                  placeholder="Enter Firstname"
                />
              </div>
              {/* -----------Lastname--------------- */}
              <div className="w-[251px] h-[105.40px] left-[260px] top-[123px] absolute">
                <div className="w-[251px] h-11 px-4 py-2.5 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                    Lastname
                  </div>
                </div>
                <input
                  type="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-[250.50px] h-[63px]  left-0 top-[42.40px] absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5"
                  placeholder="Enter Lastname"
                />
              </div>

              {/* -----------Email--------------- */}
              <div className="w-[511.03px] h-[123px] left-0 top-[230px] absolute">
                <div className="w-[511px] h-[59px] px-4 pt-6 pb-2 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                    Email
                  </div>
                </div>
                <div className="w-[511.03px] h-16 left-0 top-[59px] absolute">
                  <input
                    type="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-[511.03px] h-[64.06px]  left-0 top-[0.06] absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5"
                    placeholder="Enter Email"
                  />
                </div>
              </div>

              {/* -----------Password--------------- */}
              <div className="w-[511.03px] h-[123px] left-0 top-[353px] absolute">
                <div className="w-[511px] h-[59px] px-4 pt-6 pb-2 left-0 top-0 absolute justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#252a61] text-base font-normal font-['Montserrat']">
                    Password
                  </div>
                </div>
                <div className="w-[511.03px] h-16 left-0 top-[58.99px] absolute">
                  <input
                    type="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-[511.03px] h-[63.60px]  left-0 top-[0] absolute rounded-[50px] border-2 border-[#252a61] gap-2.5 text-[#717171] text-base items-center font-semibold font-['Montserrat'] bg-[#f0f7ff] inline-flex px-4 py-2.5"
                    placeholder="Enter Password"
                  />
                </div>
              </div>
            {error && <p className=" top-[380px] text-red-500 font-semibold ">{error}</p>}
              {/* -----------Sing Up Button--------------- */}

              <div className="w-[200px] h-[60.40px] left-[156px] top-[527px] absolute">
                <button
                  type="submit"
                  className="gap-2.5 w-[200px] h-[61px] bg-[#252A61] text-white text-2xl font-semibold font-['Montserrat Alternates'] py-2 px-6 rounded-[50px]  hover:bg-[#252A81] transition"
                >
                  Sing Up
                </button>
              </div>

              {/* -----------Already have an account? Login--------------- */}
              <div className="w-[511px] h-14 p-2.5 left-0 top-[587px] absolute justify-center items-center gap-2.5 inline-flex">
                <p className="text-[#31303c] text-lg font-semibold font-['Montserrat']">
                  Already have an account?
                </p>
                <Link
                  to="/login"
                  className="text-[#31303c] text-lg font-semibold font-['Montserrat'] hover:text-[#252A81] hover:underline transition"
                >
                  {" "}
                  Login
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Singup;
