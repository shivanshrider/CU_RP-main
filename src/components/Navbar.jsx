import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import cuLogo from '../assets/cu_logo.png';
import { toast } from 'react-hot-toast';

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
    // Clear all auth-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login page
    navigate('/admin-login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          <div className="flex">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={cuLogo} 
                alt="Department of Academic Affairs" 
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transition-all duration-200"
              />
            </NavLink>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user?.role === 'Admin' ? (
              <>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg transition-colors duration-300 ${
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
                  className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg text-gray-700 hover:bg-red-50 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/student-portal"
                  className={({ isActive }) =>
                    `px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg transition-colors duration-300 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50'
                    }`
                  }
                >
                  Student Portal
                </NavLink>
                {localStorage.getItem('token') ? (
                  <button
                    onClick={handleLogout}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg text-gray-700 hover:bg-red-50 transition-colors duration-300"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink
                    to="/admin-login"
                    className={({ isActive }) =>
                      `px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg transition-colors duration-300 ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      }`
                    }
                  >
                    Admin Login
                  </NavLink>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
