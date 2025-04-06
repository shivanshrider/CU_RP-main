import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Download, Eye, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiConfig, getAuthHeader } from '../config/api';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const statusOptions = [
        { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'Under Review', label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
        { value: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
        { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!token || userRole !== 'Admin') {
            toast.error('Please login as admin');
            navigate('/admin-login');
            return;
        }

        fetchRequests();
    }, [filter, navigate]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            let url = `${apiConfig.baseURL}/student-requests/all`;
            if (filter !== 'all') {
                url = `${apiConfig.baseURL}/student-requests/status/${filter}`;
            }

            const response = await fetch(url, {
                headers: {
                    ...apiConfig.headers,
                    ...getAuthHeader()
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/admin-login');
                    return;
                }
                throw new Error('Failed to fetch requests');
            }

            const data = await response.json();
            console.log('Fetched requests:', data);
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error(error.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/admin-login');
    };

    // Filter requests based on search term
    const filteredRequests = requests.filter(request => {
        const searchString = searchTerm.toLowerCase();
        return (
            request.caseNumber?.toLowerCase().includes(searchString) ||
            request.studentDetails?.name?.toLowerCase().includes(searchString) ||
            request.studentDetails?.rollNumber?.toLowerCase().includes(searchString) ||
            request.studentDetails?.department?.toLowerCase().includes(searchString)
        );
    });

    // Update request status
    const updateStatus = async (caseNumber, newStatus, comments) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            console.log('Updating status with:', {
                caseNumber,
                newStatus,
                comments
            });

            const response = await fetch(`${apiConfig.baseURL}/student-requests/${caseNumber}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...apiConfig.headers,
                    ...getAuthHeader()
                },
                body: JSON.stringify({
                    status: newStatus,
                    adminComments: comments || ''  // Ensure comments is not undefined
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Server response:', errorData);
                
                if (response.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/admin-login');
                    return;
                }
                
                throw new Error(errorData?.message || 'Failed to update status');
            }

            const data = await response.json();
            console.log('Update successful:', data);
            
            toast.success('Status updated successfully');
            await fetchRequests(); // Refresh the requests list
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.message || 'Failed to update status. Please try again.');
        }
    };

    // Request Details Modal
    const RequestDetailsModal = ({ request, onClose, onUpdateStatus, statusOptions }) => {
        const [status, setStatus] = useState(request.status);
        const [comments, setComments] = useState(request.adminComments || '');

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Request Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">Student Details</h4>
                            <p><span className="font-medium">Case Number:</span> {request.caseNumber}</p>
                            <p><span className="font-medium">UID:</span> {request.studentDetails.rollNumber}</p>
                            <p><span className="font-medium">Team Name:</span> {request.teamDetails.teamName}</p>
                            <p><span className="font-medium">Leader Name:</span> {request.teamDetails.leaderName}</p>
                            <p><span className="font-medium">Section:</span> {request.teamDetails.section}</p>
                            <p><span className="font-medium">Program:</span> {request.teamDetails.program}</p>
                            <p><span className="font-medium">Contact:</span> {request.teamDetails.contactNo}</p>
                            <p><span className="font-medium">Semester:</span> {request.teamDetails.semester}</p>
                            <p><span className="font-medium">Team Size:</span> {request.teamDetails.teamSize}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Competition Details</h4>
                            <p><span className="font-medium">Name:</span> {request.competitionDetails.competitionName}</p>
                            <p><span className="font-medium">Location:</span> {request.competitionDetails.location}</p>
                            <p><span className="font-medium">Start Date:</span> {new Date(request.competitionDetails.startDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">End Date:</span> {new Date(request.competitionDetails.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Position:</span> {request.competitionDetails.position}</p>
                            <p><span className="font-medium">Prize Amount:</span> ₹{request.competitionDetails.prizeAmount}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Attachments</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(request.documents || {}).map(([key, path]) => (
                                <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <a
                                        href={`${apiConfig.baseURL}/files/${path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Update Status</h4>
                        <div className="flex flex-col gap-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add comments..."
                                rows="4"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
                            />
                            <button
                                onClick={() => {
                                    if (status !== request.status || comments !== request.adminComments) {
                                        onUpdateStatus(request.caseNumber, status, comments);
                                    }
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                        Admin Dashboard
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="all">All Requests</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRequests.map((request) => (
                            <div
                                key={request._id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Case #{request.caseNumber}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        statusOptions.find(s => s.value === request.status)?.color || 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {statusOptions.find(s => s.value === request.status)?.label || request.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Student Details</h4>
                                        <p className="text-sm text-gray-900">{request.studentDetails.name}</p>
                                        <p className="text-sm text-gray-600">{request.studentDetails.rollNumber}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Competition</h4>
                                        <p className="text-sm text-gray-900">{request.competitionDetails.competitionName}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(request.competitionDetails.startDate).toLocaleDateString()} - 
                                            {new Date(request.competitionDetails.endDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(request.documents || {}).map(([key, path]) => (
                                            <a
                                                key={key}
                                                href={`${apiConfig.baseURL}/files/${path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {key}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setSelectedRequest(request)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedRequest && (
                    <RequestDetailsModal
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onUpdateStatus={updateStatus}
                        statusOptions={statusOptions}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
