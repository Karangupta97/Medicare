import React from 'react';
import { Link } from 'react-router-dom';

const PendingVerification = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verification Pending
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your doctor account is awaiting verification
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h3 className="mt-4 text-lg font-medium text-gray-900">Account Under Review</h3>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for registering as a medical professional on Medicare. Our team is reviewing your credentials and documentation.
            </p>
            
            <div className="mt-6">
              <Link to="/doctor/login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification; 