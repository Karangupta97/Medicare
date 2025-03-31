import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        
        {/* Space Background Section */}
        <div className="w-full lg:w-1/2 h-[600px] rounded-[40px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Astro</h1>
            <p className="text-xl text-cyan-400 mb-8">
              Exploring new frontiers, one step at a time.
            </p>
            <button className="self-start px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors">
              Browse Earth's View
            </button>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="w-full lg:w-1/2 bg-gray-800/80 backdrop-blur-lg rounded-[40px] p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Sign up to continue your space journey</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
                placeholder="astronaut@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-cyan-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors font-semibold"
            >
              Create Account
            </button>

            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-cyan-500 hover:underline">
                Login
              </a>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                <FaGoogle className="text-xl text-red-500" />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                <FaApple className="text-xl text-white" />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                <FaFacebook className="text-xl text-blue-500" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;