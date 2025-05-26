import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDoctorStore } from '../../store/doctorStore';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhone, FaIdCard, FaBuilding, FaMapMarkerAlt, FaStethoscope, FaFileUpload } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const { signupDoctor, isLoading, error, clearErrors } = useDoctorStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    medicalRegistrationNumber: '',
    councilName: '',
    state: '',
    specialization: '',
    experience: ''
  });
  
  const [licenseFile, setLicenseFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const validateForm = () => {
    const errors = {};
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      medicalRegistrationNumber,
      councilName,
      state
    } = formData;
    
    if (!fullName) errors.fullName = 'Full name is required';
    
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters long';
    
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!phone) errors.phone = 'Phone number is required';
    
    if (!medicalRegistrationNumber) errors.medicalRegistrationNumber = 'Medical registration number is required';
    
    if (!councilName) errors.councilName = 'Medical council name is required';
    
    if (!state) errors.state = 'State is required';
    
    if (!licenseFile) errors.licenseFile = 'Please upload your medical license document';
    else if (licenseFile.size > 5 * 1024 * 1024) errors.licenseFile = 'File size must be less than 5MB';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setLicenseFile(file);
      
      // Clear file error when selecting a new file
      if (formErrors.licenseFile) {
        setFormErrors(prev => ({ ...prev, licenseFile: '' }));
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setSuccessMessage('');
    
    if (validateForm()) {
      try {
        // Create FormData for file upload
        const formDataObj = new FormData();
        
        // Add text fields
        Object.keys(formData).forEach(key => {
          if (key !== 'confirmPassword') {
            formDataObj.append(key, formData[key]);
          }
        });
        
        // Add file
        formDataObj.append('licenseDocument', licenseFile);
        
        // Submit the form
        const response = await signupDoctor(formDataObj);
        
        if (response && response.success) {
          setSuccessMessage('Registration successful! Your account is pending verification.');
          // Reset form after successful submission
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            medicalRegistrationNumber: '',
            councilName: '',
            state: '',
            specialization: '',
            experience: ''
          });
          setLicenseFile(null);
          
          // Redirect to pending verification page after a delay
          setTimeout(() => {
            navigate('/doctor/pending-verification');
          }, 3000);
        }
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Doctor Registration | Medicare</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
                <FaStethoscope className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Doctor Registration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join Medicare as a verified medical professional
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {successMessage && (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <p className="text-sm text-green-700 mt-2">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="doctor@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="col-span-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="col-span-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Medical Registration Number */}
                <div className="col-span-1">
                  <label htmlFor="medicalRegistrationNumber" className="block text-sm font-medium text-gray-700">
                    Medical Registration Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="medicalRegistrationNumber"
                      name="medicalRegistrationNumber"
                      type="text"
                      value={formData.medicalRegistrationNumber}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.medicalRegistrationNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="MCI-123456"
                    />
                  </div>
                  {formErrors.medicalRegistrationNumber && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.medicalRegistrationNumber}</p>
                  )}
                </div>

                {/* Council Name */}
                <div className="col-span-1">
                  <label htmlFor="councilName" className="block text-sm font-medium text-gray-700">
                    Medical Council Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="councilName"
                      name="councilName"
                      type="text"
                      value={formData.councilName}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.councilName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Medical Council of India"
                    />
                  </div>
                  {formErrors.councilName && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.councilName}</p>
                  )}
                </div>

                {/* State */}
                <div className="col-span-1">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Maharashtra"
                    />
                  </div>
                  {formErrors.state && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.state}</p>
                  )}
                </div>

                {/* Specialization (Optional) */}
                <div className="col-span-1">
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStethoscope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      placeholder="Cardiology"
                    />
                  </div>
                </div>

                {/* Experience (Optional) */}
                <div className="col-span-1">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleChange}
                      className="py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* License Document Upload */}
                <div className="sm:col-span-2">
                  <label htmlFor="licenseDocument" className="block text-sm font-medium text-gray-700">
                    Medical License Document (PDF or Image, max 5MB)
                  </label>
                  <div className="mt-1">
                    <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                      formErrors.licenseFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500'
                    }`}>
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="licenseDocument" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input 
                              id="licenseDocument" 
                              name="licenseDocument" 
                              type="file" 
                              className="sr-only"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, PNG, JPG, JPEG up to 5MB
                        </p>
                        {licenseFile && (
                          <p className="text-sm text-indigo-600 font-medium">
                            Selected: {licenseFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {formErrors.licenseFile && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.licenseFile}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                      <p className="text-sm text-red-700 mt-2">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">
                  By submitting this form, you agree to our verification process. Your credentials will be
                  reviewed by our administrators before account activation.
                </p>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Register as a Doctor'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/doctor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorSignup; 