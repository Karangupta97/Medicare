import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nurse from "../assets/nurse.png";
import Logo from "../assets/Medicare logo.jpg";
import HealthRecordsimage from "../assets/HealthRecords.png";
import FindHospitalimage from "../assets/FindHospital.png";
import UserIcon from "../assets/user.png";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-Background overflow-hidden">
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
        <header className="w-full max-w-[1700px] h-[100px] flex justify-between items-center py-4 px-4 md:px-8">
          <img className="w-40 h-auto" src={Logo} alt="Logo" />
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 lg:space-x-12 text-base lg:text-lg font-[Montserrat Alternates] font-semibold">
            <Link to="/" className="text-black hover:text-[#252A61] transition-colors duration-300">
              Home
            </Link>
            <Link to="/health-records" className="text-black hover:text-[#252A61] transition-colors duration-300">
              Health Records
            </Link>
            <Link to="/upload-reports" className="text-black hover:text-[#252A61] transition-colors duration-300">
              Upload Reports
            </Link>
            <Link to="/about-us" className="text-black hover:text-[#252A61] transition-colors duration-300">
              About Us
            </Link>
            <Link to="/dashboard" className="text-black hover:text-[#252A61] transition-colors duration-300">
              Dashboard
            </Link>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-[100px] left-0 right-0 bg-white shadow-lg md:hidden z-50">
              <nav className="flex flex-col space-y-4 p-4">
                <Link to="/" className="text-black hover:text-[#252A61] transition-colors duration-300">Home</Link>
                <Link to="/health-records" className="text-black hover:text-[#252A61] transition-colors duration-300">Health Records</Link>
                <Link to="/upload-reports" className="text-black hover:text-[#252A61] transition-colors duration-300">Upload Reports</Link>
                <Link to="/about-us" className="text-black hover:text-[#252A61] transition-colors duration-300">About Us</Link>
                <Link to="/dashboard" className="text-black hover:text-[#252A61] transition-colors duration-300">Dashboard</Link>
              </nav>
            </div>
          )}

          {/* Login/User Icon */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] focus:outline-none"
              >
                <img
                  src={UserIcon}
                  alt="User Icon"
                  className="w-full h-full rounded-full object-cover hover:ring-2 hover:ring-[#252A61] transition-all duration-300"
                />
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="w-[120px] md:w-[200px] h-[45px] md:h-[60px] flex items-center justify-center px-3 py-3 bg-[#252A61] text-white rounded-full text-base md:text-xl hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </header>

        {/* Hero Section */}
        <div className="w-full max-w-[1703px] h-[500px] md:h-[725px] relative">
          <div className="w-full h-full bg-[#252a61] rounded-[30px] md:rounded-[50px] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-[200px] md:text-[350px] font-bold font-['Montserrat Alternate'] leading-none text-[#d9e7ff] text-center">
                Medicare
              </h1>
            </div>
            <img
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[429px] h-auto"
              src={nurse}
              alt="nurse"
            />
          </div>
        </div>

        {/* Services Section */}
        <section className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 py-8 px-4">
          <Link
            to="/find-hospital"
            className="w-full flex items-center justify-center bg-[#CDEBF1] rounded-[30px] p-6 hover:shadow-xl transition-all duration-300"
          >
            <img
              className="w-12 h-12 md:w-16 md:h-16 mr-4"
              src={FindHospitalimage}
              alt="Find Hospital"
            />
            <span className="text-xl md:text-2xl font-bold text-[#252a61]">
              Find Hospital
            </span>
          </Link>
          <Link
            to="/upload-reports"
            className="w-full flex items-center justify-center bg-[#DEF1D0] rounded-[30px] p-6 hover:shadow-xl transition-all duration-300"
          >
            <span className="text-xl md:text-2xl font-bold text-[#252a61]">
              Upload Reports
            </span>
          </Link>
          <Link
            to="/health-records"
            className="w-full flex items-center justify-center bg-[#f8e5e5] rounded-[30px] p-6 hover:shadow-xl transition-all duration-300"
          >
            <img
              className="w-12 h-12 md:w-16 md:h-16 mr-4"
              src={HealthRecordsimage}
              alt="Health Records"
            />
            <span className="text-xl md:text-2xl font-bold text-[#252a61]">
              Health Records
            </span>
          </Link>
        </section>

        {/* What We Do */}
        <section className="w-full text-center py-8">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-normal text-Text">
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
