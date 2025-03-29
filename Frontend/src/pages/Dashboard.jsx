import React from "react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#B8C5FD] to-[#E8C3D5] px-4">
      <div className="bg-white w-full max-w-lg p-6 md:p-10 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Dashboard</h2>

        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">
            Profile Information
          </h3>
          <p className="text-gray-600 mb-1 break-words">Name: {user.name}</p>
          <p className="text-gray-600 break-words">Email: {user.email}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">
            Account Activity
          </h3>
          <p className="text-gray-600 mb-1">
            <span className="font-bold">Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-600">
            <span className="font-bold">Last Login:</span>{" "}
            {formatDate(user.lastLogin)}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition w-full md:w-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
