import React from 'react';
import { FaGithub, FaLinkedin, FaHeart, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">About the Portal</h3>
            <p className="text-sm text-gray-200">
              CU Reimbursement Portal streamlines the process of managing student reimbursements
              at Chandigarh University, making it efficient and transparent.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-200 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/student-portal" className="text-gray-200 hover:text-white transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="/admin-login" className="text-gray-200 hover:text-white transition-colors">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Connect With Developer</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <motion.a
                href="https://github.com/shivanshrider"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub size={24} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/shivanshhtiwari/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={24} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-red-400">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm">
                © {currentYear} CU Reimbursement Portal. All rights reserved.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span>Made with</span>
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <FaHeart className="text-red-400" />
              </motion.span>
              <span>by</span>
              <a
                href="https://www.linkedin.com/in/shivanshhtiwari/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-red-400 transition-colors"
              >
                Shivansh Tiwari
              </a>
              <FaCode className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
