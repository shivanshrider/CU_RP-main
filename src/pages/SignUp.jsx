import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { NavLink } from 'react-router-dom';
import { signupUser } from '../services/api';

const SignupBox = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await signupUser(formData);
            localStorage.setItem('token', response.token);
            toast.success("Signup successful! Redirecting...");
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-[88vh] flex justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <Toaster />
            <div className="flex justify-between max-w-[88rem]">
                {/* Left Section - Form */}
                <div className="w-[40%] flex items-center justify-center">
                    <form
                        onSubmit={handleSignup}
                        className="bg-white shadow-lg rounded-xl p-6 lg:p-10 w-4/5 space-y-6"
                    >
                        <div className="flex flex-col items-center mb-4">
                            <h2 className="text-3xl font-bold text-red-600">Sign Up</h2>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-black">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-black"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-black"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-black"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-black">
                                Role
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-black"
                            >
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
                        >
                            Sign Up
                        </button>
                        <p className="text-sm text-black text-center">
                            Already have an account?{' '}
                            <NavLink to="/login" className="text-red-600 hover:underline">
                                Login here
                            </NavLink>.
                        </p>
                    </form>
                </div>

                {/* Right Section - Image/Text */}
                <div className="w-1/2 flex flex-col justify-center items-center text-black p-6 lg:p-10">
                    <h1 className="bg-gradient-to-r from-red-600 to-black text-transparent bg-clip-text text-6xl font-bold mb-4">
                        Join Us!
                    </h1>
                    <p className="text-lg text-center">
                        Create your account to start managing reimbursement requests for Chandigarh University students.
                    </p>
                    <DotLottieReact
                        src="https://lottie.host/9cbd0330-b006-4f0a-b84a-06d901092ef7/VJ6BFUjJdt.lottie"
                        loop
                        autoplay
                        className="h-[28rem]"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignupBox;
