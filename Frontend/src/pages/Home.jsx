import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nurse from "../assets/nurse.png";
import Logo from "../assets/Medicare logo.jpg";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import UserIcon from "../assets/user.png"; // Add a default user icon image

const Home = () => {
  const [user, setUser] = useState(null);

  // On component mount, check if user exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="relative bg-Background overflow-hidden">
      {/* Background gradients and blurs */}
      <div className="absolute inset-0">
        <div className="w-[80%] h-[80%] max-w-[800px] max-h-[800px] absolute top-[50%] left-[90%] transform -translate-x-1/2 -translate-y-1/2 rotate-[51.71deg] opacity-60 bg-gradient-to-br from-[#b8c5fd] to-[#e8c3d5] blur-[100px]" />
        <div className="w-[70%] h-[70%] max-w-[700px] max-h-[700px] absolute top-[-15%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-3 rounded-full blur-[75px]" />
        <div className="w-[50%] h-[50%] max-w-[500px] max-h-[500px] absolute top-[40%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-1 rounded-full blur-[75px]" />
        <div className="w-[70%] h-[70%] max-w-[700px] max-h-[700px] absolute top-[65%] left-[-5%] transform -translate-x-1/2 -translate-y-1/2 opacity-60 bg-b-3 rounded-full blur-[75px]" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 space-y-8">
        {/* Header */}
        <header className="w-[1700px] h-[100px] flex justify-between items-center py-4">
          <img className="w-50 h-auto" src={Logo} alt="Logo" />
          <nav className="hidden md:flex space-x-20 text-lg font-[Montserrat Alternates] font-semibold">
            <Link to="/" className="text-black hover:scale-110">
              Home
            </Link>
            <Link to="/health-records" className="text-black hover:scale-110">
              Health Records
            </Link>
            <Link to="/upload-reports" className="text-black hover:scale-110">
              Upload Reports
            </Link>
            <Link to="/about-us" className="text-black hover:scale-110">
              About Us
            </Link>
            <Link to="/dashbord" className="text-black hover:scale-110">
              Dashbord
            </Link>
          </nav>

          {/* CONDITIONAL Login / User Icon */}
          {user ? (
            <div className="w-[60px] h-[60px]">
              <img
                src={UserIcon}
                alt="User Icon"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="w-[200px] h-[60px] flex items-center justify-center px-3 py-3 bg-[#252A61] text-white rounded-full text-lg md:text-xl hover:bg-[#3b3b98] transition"
            >
              Login
            </Link>
          )}
        </header>

        {/* Hero Section */}
        <div className="w-[1703px] h-[725px] relative">
          <div className="w-[1700px] h-[700px] left-0 top-[25px] absolute bg-[#252a61] rounded-[50px]" />
          <div className="w-[1700px] h-[725px] left-[3px] top-0 absolute inline-flex justify-center items-start gap-2.5">
            <div className="justify-start text-[#d9e7ff] text-[350px] font-bold font-['Montserrat Alternate'] leading-none">
              Medicare
            </div>
          </div>
          <img
            className="w-[429px] h-[628px] left-[618px] top-[97px] absolute"
            src={nurse}
            alt="nurse"
          />
        </div>

        {/* Services Section */}
        <section className="w-[1700px] grid grid-cols-1 md:grid-cols-3 gap-10 py-8 justify-items-center">
          <Link
            to="/find-hospital"
            className="w-[473px] flex items-center justify-center bg-[#CDEBF1] rounded-[50px] p-4"
          >
            <img
              className="w-16 h-16"
              src={FindHospitalimage}
              alt="Find Hospital"
            />
            <span className="text-2xl font-bold text-[#252a61]">
              Find Hospital
            </span>
          </Link>
          <Link
            to="/upload-reports"
            className="w-[473px] flex items-center justify-center bg-[#DEF1D0] rounded-[50px] p-4"
          >
            <span className="text-2xl font-bold text-[#252a61]">
              Upload Reports
            </span>
          </Link>
          <Link
            to="/health-records"
            className="w-[473px] flex items-center justify-center bg-[#f8e5e5] rounded-[50px] p-4"
          >
            <img
              className="w-16 h-16"
              src={HealthRecordsimage}
              alt="Health Records"
            />
            <span className="text-2xl font-bold text-[#252a61]">
              Health Records
            </span>
          </Link>
        </section>

        {/* What We Do */}
        <section className="w-full text-center py-8">
          <h2 className="text-3xl md:text-5xl font-normal text-Text">
            What We Do
          </h2>
        </section>

        {/* Footer */}
        <footer className="w-full bg-Primary rounded-tl-[20px] rounded-tr-[20px] py-8">
          {/* Footer content */}
        </footer>
      </div>
    </div>
  );
};

export default Home;
