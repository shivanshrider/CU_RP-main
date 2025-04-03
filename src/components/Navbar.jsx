import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    files: {
      tickets: null,
      invitationLetter: null,
      certificates: null,
      undertaking: null,
      mandateForm: null,
      taForm: null,
      idCards: null,
      lastSemesterDmc: null,
      attendanceProof: null,
      idProof: null
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-red-600">CU</span>
              <span className="ml-2 text-xl font-bold text-red-600">Reimbursement</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === 'Admin' ? (
              <>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/student-portal"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50'
                    }`
                  }
                >
                  Student Portal
                </NavLink>
                <NavLink
                  to="/admin-login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50'
                    }`
                  }
                >
                  Admin Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;