import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { apiConfig } from '../config/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');
            
            if (token && userRole === 'Admin') {
                navigate('/admin-dashboard', { replace: true });
            }
        };

        checkAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${apiConfig.baseURL}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    ...apiConfig.headers
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth data
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.name);

                toast.success('Login successful');
                navigate('/admin-dashboard', { replace: true });
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <Toaster />
            
            {/* Left Section - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
                        CU Reimbursement
                    </h1>
                    <h2 className="mt-3 text-center text-2xl font-semibold text-gray-900">
                        Admin Login
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <span className="mr-2">Signing in...</span>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        </div>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Section - Info */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-red-500 to-red-700">
                <div className="flex flex-col justify-center items-center px-8 text-white">
                    <h1 className="text-5xl font-bold mb-6">Admin Portal</h1>
                    <p className="text-xl text-center max-w-lg">
                        Access the administrative dashboard to manage reimbursement requests for Chandigarh University.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
