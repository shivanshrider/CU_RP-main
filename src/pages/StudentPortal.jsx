import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';

const StudentPortal = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Portal</h1>
                    <p className="text-lg text-gray-600">Manage your reimbursement requests</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* New Request Card */}
                    <Link
                        to="/student-request"
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-100 rounded-full p-4 mb-4">
                                <FileText className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">New Request</h2>
                            <p className="text-gray-600">
                                Submit a new reimbursement request for your competition participation
                            </p>
                        </div>
                    </Link>

                    {/* Check Status Card */}
                    <Link
                        to="/check-status"
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-100 rounded-full p-4 mb-4">
                                <Search className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check Status</h2>
                            <p className="text-gray-600">
                                Track the status of your existing reimbursement requests
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal; 