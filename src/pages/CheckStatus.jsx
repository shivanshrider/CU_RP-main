import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Search, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
    const [caseNumber, setCaseNumber] = useState('');
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!caseNumber) {
            toast.error('Please enter a case number');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/student-requests/${caseNumber}`);
            const data = await response.json();

            if (response.ok) {
                setRequest(data);
            } else {
                toast.error(data.message || 'Request not found');
                setRequest(null);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch request details');
            setRequest(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        to="/student-portal"
                        className="inline-flex items-center text-red-600 hover:text-red-700"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back to Student Portal
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Check Request Status</h1>

                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Case Number
                                </label>
                                <input
                                    type="text"
                                    id="caseNumber"
                                    value={caseNumber}
                                    onChange={(e) => setCaseNumber(e.target.value)}
                                    placeholder="e.g., REQ25040001"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Searching...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Search className="w-5 h-5 mr-2" />
                                            Search
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {request && (
                        <div className="border-t pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Details</h2>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Case Number:</span> {request.caseNumber}</p>
                                        <p><span className="font-medium">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                                request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                request.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </p>
                                        <p><span className="font-medium">Submitted On:</span> {new Date(request.submittedAt).toLocaleDateString()}</p>
                                        <p><span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Comments</h2>
                                    {request.adminComments ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-700 whitespace-pre-wrap">{request.adminComments}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No comments yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(request.attachments || {}).map(([key, path]) => (
                                        <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <a
                                                href={`http://localhost:5000/${path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-red-600 hover:text-red-700"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckStatus; 