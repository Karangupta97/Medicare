import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nurse from "../assets/nurse.png";
import Logo from "../assets/Medicare logo.jpg";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import UserIcon from "../assets/user.png";
import { FiMenu } from "react-icons/fi"; // Import Hamburger Icon

const Home = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Track mobile menu state

  // Check localStorage for user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="relative bg-Background overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="w-[80%] h-[80%] max-w-[800px] max-h-[800px] absolute top-[50%] left-[90%] transform -translate-x-1/2 -translate-y-1/2 rotate-[51.71deg] opacity-60 bg-gradient-to-br from-[#b8c5fd] to-[#e8c3d5] blur-[100px]" />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 space-y-8">
        {/* Header */}
        <header className="w-full max-w-[1700px] flex justify-between items-center py-4 px-6 md:px-12">
          <img className="w-40 h-auto" src={Logo} alt="Logo" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10 text-lg font-semibold">
            <Link to="/" className="text-black hover:scale-110 transition">Home</Link>
            <Link to="/health-records" className="text-black hover:scale-110 transition">Health Records</Link>
            <Link to="/upload-reports" className="text-black hover:scale-110 transition">Upload Reports</Link>
            <Link to="/about-us" className="text-black hover:scale-110 transition">About Us</Link>
            <Link to="/dashboard" className="text-black hover:scale-110 transition">Dashboard</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
            <FiMenu />
          </button>

          {/* Conditional Login/User Icon */}
          {user ? (
            <div className="w-[50px] h-[50px]">
              <img src={UserIcon} alt="User Icon" className="w-full h-full rounded-full object-cover" />
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex px-6 py-2 bg-[#252A61] text-white rounded-full text-lg hover:bg-[#3b3b98] transition">
              Login
            </Link>
          )}
        </header>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col items-center space-y-4 text-lg bg-white p-4 rounded-md shadow-md">
            <Link to="/" className="text-black" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/health-records" className="text-black" onClick={() => setMenuOpen(false)}>Health Records</Link>
            <Link to="/upload-reports" className="text-black" onClick={() => setMenuOpen(false)}>Upload Reports</Link>
            <Link to="/about-us" className="text-black" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/dashboard" className="text-black" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </nav>
        )}

        {/* Hero Section */}
        <div className="w-full max-w-[1700px] relative flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-bold text-[#252a61]">Medicare</h1>
          </div>
          <img className="w-[60%] max-w-[429px] md:max-w-[500px] mt-6 md:mt-0" src={nurse} alt="nurse" />
        </div>

        {/* Services Section */}
        <section className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
          <Link to="/find-hospital" className="flex items-center justify-center bg-[#CDEBF1] rounded-[50px] p-4">
            <img className="w-12 h-12 md:w-16 md:h-16" src={FindHospitalimage} alt="Find Hospital" />
            <span className="ml-2 text-xl md:text-2xl font-bold text-[#252a61]">Find Hospital</span>
          </Link>
          <Link to="/upload-reports" className="flex items-center justify-center bg-[#DEF1D0] rounded-[50px] p-4">
            <span className="text-xl md:text-2xl font-bold text-[#252a61]">Upload Reports</span>
          </Link>
          <Link to="/health-records" className="flex items-center justify-center bg-[#f8e5e5] rounded-[50px] p-4">
            <img className="w-12 h-12 md:w-16 md:h-16" src={HealthRecordsimage} alt="Health Records" />
            <span className="ml-2 text-xl md:text-2xl font-bold text-[#252a61]">Health Records</span>
          </Link>
        </section>

        {/* What We Do */}
        <section className="w-full text-center py-8">
          <h2 className="text-3xl md:text-5xl font-normal text-Text">What We Do</h2>
        </section>

        {/* Footer */}
        <footer className="w-full bg-Primary rounded-t-lg py-8 text-center text-white">
          <p className="text-lg">© 2025 Medicare. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
