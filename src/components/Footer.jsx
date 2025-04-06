import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">CU Reimbursement</h3>
            <p className="text-gray-400">
              Streamlining the reimbursement process for Chandigarh University students participating in competitions and events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student-portal" className="text-gray-400 hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <a href="https://www.cuchd.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Chandigarh University
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-gray-400">Chandigarh University</p>
              <p className="text-gray-400">NH-95 Chandigarh-Ludhiana Highway</p>
              <p className="text-gray-400">Mohali, Punjab 140413</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://github.com/shivanshrider"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/shivanshhtiwari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="mailto:shivanshtiwari98958@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} CU Reimbursement Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
