import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eid: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { name, email, phone, eid, password, confirmPassword } = formData;

    if (!recaptchaValue) {
      toast.error('Please complete the reCAPTCHA.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          eid,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Sign up successful! Redirecting to login page...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error(error.message || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
      <Toaster />
      
      <div className="grid lg:grid-cols-2 grid-cols-1 bg-white shadow-xl rounded-2xl w-full max-w-6xl overflow-hidden">
        
        {/* Left Section - Form */}
        <div className="flex flex-col justify-center p-10 w-full">
          <h2 className="text-3xl font-bold text-red-600 text-center mb-6">Sign Up</h2>

          <form onSubmit={handleSignUp} className="space-y-5">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="eid" className="block text-sm font-medium text-gray-700">Enter Your EID</label>
              <input
                type="text"
                id="eid"
                value={formData.eid}
                onChange={handleChange}
                placeholder="Enter your EID"
                required
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
                </div>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={handleRecaptchaChange} />
            </div>

            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-500 transition">
              Sign Up
            </button>

            <p className="text-sm text-gray-700 text-center">
              Already have an account? <a href="/login" className="text-red-600 hover:underline">Log in here</a>.
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center p-10 bg-gray-100">
          <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">Welcome to CU Reimbursement System</h1>
          <DotLottieReact src="https://lottie.host/2cf086ab-daac-4fa9-b586-52738cb89a9d/1hYr1QxIOR.lottie" loop autoplay className="h-80" />
        </div>

      </div>
    </div>
  );
};

export default Signup;
