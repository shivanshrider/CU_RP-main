import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Download, Eye, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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

            let url = 'http://localhost:5000/api/student-requests/all';
            if (filter !== 'all') {
                url = `http://localhost:5000/api/student-requests/status/${filter}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
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

            const response = await fetch(`http://localhost:5000/api/student-requests/${caseNumber}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    adminComments: comments
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/admin-login');
                    return;
                }
                throw new Error('Failed to update status');
            }

            const data = await response.json();
            toast.success('Status updated successfully');
            fetchRequests();
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.message || 'Failed to update status');
        }
    };

    // Request Details Modal
    const RequestDetailsModal = ({ request, onClose, onUpdateStatus }) => {
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
                            <p><span className="font-medium">UID:</span> {request.uid}</p>
                            <p><span className="font-medium">Team Name:</span> {request.teamName}</p>
                            <p><span className="font-medium">Leader Name:</span> {request.leaderName}</p>
                            <p><span className="font-medium">Section:</span> {request.section}</p>
                            <p><span className="font-medium">Program:</span> {request.program}</p>
                            <p><span className="font-medium">Contact:</span> {request.contactNo}</p>
                            <p><span className="font-medium">Semester:</span> {request.semester}</p>
                            <p><span className="font-medium">Team Size:</span> {request.teamSize}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Competition Details</h4>
                            <p><span className="font-medium">Name:</span> {request.competitionName}</p>
                            <p><span className="font-medium">Location:</span> {request.location}</p>
                            <p><span className="font-medium">Start Date:</span> {new Date(request.startDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">End Date:</span> {new Date(request.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Position:</span> {request.position}</p>
                            <p><span className="font-medium">Prize Amount:</span> ₹{request.prizeAmount}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Attachments</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(request.attachments || {}).map(([key, path]) => (
                                <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
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

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Update Status</h4>
                        <div className="flex gap-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add comments..."
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                            <button
                                onClick={() => onUpdateStatus(request.caseNumber, status, comments)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Student Requests</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                Welcome, {localStorage.getItem('userName')}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            >
                                <option value="all">All Requests</option>
                                <option value="Pending">Pending</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Case Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Roll Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRequests.map((request) => (
                                        <tr key={request._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {request.caseNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.studentDetails.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.studentDetails.rollNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.studentDetails.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    request.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="text-red-600 hover:text-red-900 mr-4"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedRequest && (
                <RequestDetailsModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
