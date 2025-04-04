import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { apiConfig } from '../config/api';

const StudentRequest = () => {
    const navigate = useNavigate();

    // Student Details State
    const [studentDetails, setStudentDetails] = useState({
        name: '',
        rollNumber: '',
        department: '',
        year: '',
        contact: '',
        email: '',
        officialEmail: ''
    });

    // Team Details State
    const [teamDetails, setTeamDetails] = useState({
        teamName: '',
        leaderName: '',
        section: '',
        program: '',
        contactNo: '',
        semester: '',
        teamSize: ''
    });

    // Competition Details State
    const [competitionDetails, setCompetitionDetails] = useState({
        competitionName: '',
        location: '',
        startDate: '',
        endDate: '',
        position: '',
        prizeAmount: ''
    });

    // Files State
    const [files, setFiles] = useState({
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
    });

    // Form Status State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [caseNumber, setCaseNumber] = useState(null);

    // Add declaration state
    const [declaration, setDeclaration] = useState({
        compliance: false,
        rulesAwareness: false,
        attendance: false,
        feePayment: false
    });

    // Handle student details change
    const handleStudentDetailsChange = (e) => {
        const { name, value } = e.target;
        setStudentDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle team details change
    const handleTeamDetailsChange = (e) => {
        const { name, value } = e.target;
        setTeamDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle competition details change
    const handleCompetitionDetailsChange = (e) => {
        const { name, value } = e.target;
        setCompetitionDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file change
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFiles(prev => ({
            ...prev,
            [fieldName]: file
        }));
    };

    // Handle declaration change
    const handleDeclarationChange = (e) => {
        const { name, checked } = e.target;
        setDeclaration(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Validate form
    const validateForm = () => {
        // Check only essential student details
        if (!studentDetails.name || !studentDetails.rollNumber || !studentDetails.department) {
            toast.error('Please fill in required student details (Name, Roll Number, and Department)');
            return false;
        }

        // Check if at least one file is uploaded
        const hasAnyFile = Object.values(files).some(file => file !== null);
        if (!hasAnyFile) {
            toast.error('Please upload at least one supporting document');
            return false;
        }

        // Check declarations
        if (!declaration.compliance) {
            toast.error('Please accept the compliance declaration');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            // Append student details
            formDataToSend.append('studentDetails', JSON.stringify(studentDetails));

            // Append team details
            formDataToSend.append('teamDetails', JSON.stringify(teamDetails));

            // Append competition details
            formDataToSend.append('competitionDetails', JSON.stringify(competitionDetails));

            // Append declaration
            formDataToSend.append('declaration', JSON.stringify(declaration));

            // Append files
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    formDataToSend.append(key, files[key]);
                }
            });

            // Make the API call
            const response = await axios.post(`${apiConfig.baseURL}/student-requests`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSuccess(true);
                setCaseNumber(response.data.caseNumber);
                toast.success('Request submitted successfully!');
                // Clear form
                setStudentDetails({
                    name: '',
                    rollNumber: '',
                    department: '',
                    year: '',
                    contact: '',
                    email: '',
                    officialEmail: ''
                });
                setTeamDetails({
                    teamName: '',
                    leaderName: '',
                    section: '',
                    program: '',
                    contactNo: '',
                    semester: '',
                    teamSize: ''
                });
                setCompetitionDetails({
                    competitionName: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    position: '',
                    prizeAmount: ''
                });
                setFiles({
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
                });
                setDeclaration({
                    compliance: false,
                    rulesAwareness: false,
                    attendance: false,
                    feePayment: false
                });
            } else {
                setError(response.data.message || 'Failed to submit request');
                toast.error(response.data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.response?.data?.message || 'Failed to submit request');
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const requiredFiles = [
        { name: 'tickets', label: 'Tickets' },
        { name: 'invitationLetter', label: 'Competition Invitation/Selection Letter' },
        { name: 'certificates', label: 'Photos/Certificates' },
        { name: 'undertaking', label: 'Self-Undertaking' },
        { name: 'mandateForm', label: 'Mandate Form' },
        { name: 'taForm', label: 'TA/DA Form' },
        { name: 'idCards', label: 'ID Cards' },
        { name: 'lastSemesterDmc', label: 'Last Semester DMC' },
        { name: 'attendanceProof', label: 'Current Semester Attendance Proof' },
        { name: 'idProof', label: 'Aadhar Card/PAN Card' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="mb-8">
                        <Link to="/student-portal" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Portal
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Reimbursement Request</h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Fill in the details below to submit your reimbursement request.
                        </p>
                    </div>

                    {error && (
                        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            Request submitted successfully! Your case number is: {caseNumber}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student Details Section */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Student Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={studentDetails.name}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                    <input
                                        type="text"
                                        value={studentDetails.rollNumber}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, rollNumber: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <input
                                        type="text"
                                        value={studentDetails.department}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, department: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year</label>
                                    <input
                                        type="text"
                                        value={studentDetails.year}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, year: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input
                                        type="tel"
                                        value={studentDetails.contact}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, contact: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Personal Email</label>
                                    <input
                                        type="email"
                                        value={studentDetails.email}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Official Email (CU Email)</label>
                                    <input
                                        type="email"
                                        value={studentDetails.officialEmail}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, officialEmail: e.target.value })}
                                        placeholder="example@cu.ac.in"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Please enter your official CU email address
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Details Section */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Team Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Team Name</label>
                                    <input
                                        type="text"
                                        value={teamDetails.teamName}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, teamName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Leader Name</label>
                                    <input
                                        type="text"
                                        value={teamDetails.leaderName}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, leaderName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Section</label>
                                    <input
                                        type="text"
                                        value={teamDetails.section}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, section: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Program</label>
                                    <input
                                        type="text"
                                        value={teamDetails.program}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, program: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                    <input
                                        type="tel"
                                        value={teamDetails.contactNo}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, contactNo: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                                    <input
                                        type="text"
                                        value={teamDetails.semester}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, semester: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Team Size</label>
                                    <input
                                        type="text"
                                        value={teamDetails.teamSize}
                                        onChange={(e) => setTeamDetails({ ...teamDetails, teamSize: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Competition Details Section */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Competition Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Competition Name</label>
                                    <input
                                        type="text"
                                        value={competitionDetails.competitionName}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, competitionName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        value={competitionDetails.location}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, location: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        value={competitionDetails.startDate}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, startDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        value={competitionDetails.endDate}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, endDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input
                                        type="text"
                                        value={competitionDetails.position}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, position: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prize Amount</label>
                                    <input
                                        type="text"
                                        value={competitionDetails.prizeAmount}
                                        onChange={(e) => setCompetitionDetails({ ...competitionDetails, prizeAmount: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Required Documents</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {requiredFiles.map((file) => (
                                    <div key={file.name}>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {file.label}
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <label 
                                                htmlFor={`file-${file.name}`} 
                                                className="w-full flex justify-center px-6 py-3 border-2 border-gray-300 border-dashed rounded-md hover:border-red-500 cursor-pointer"
                                            >
                                                <div className="space-y-1 text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="text-sm text-gray-600">
                                                        <span className="text-red-500 font-medium">
                                                            Upload a file
                                                        </span>
                                                        {' or drag and drop'}
                                                    </div>
                                                    {files[file.name] && (
                                                        <p className="text-sm text-gray-500">
                                                            {files[file.name].name}
                                                        </p>
                                                    )}
                                                </div>
                                                <input
                                                    id={`file-${file.name}`}
                                                    name={file.name}
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, file.name)}
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    className="sr-only"
                                                    aria-label={`Upload ${file.label}`}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Declaration Section */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Declaration</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="compliance"
                                        checked={declaration.compliance}
                                        onChange={handleDeclarationChange}
                                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded sm:text-sm"
                                        required
                                    />
                                    <label className="ml-3 text-sm text-gray-700">
                                        I confirm that I will comply with all university norms/policies.
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="rulesAwareness"
                                        checked={declaration.rulesAwareness}
                                        onChange={handleDeclarationChange}
                                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded sm:text-sm"
                                        required
                                    />
                                    <label className="ml-3 text-sm text-gray-700">
                                        I am aware of the rules & benefits for academic competitions.
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="attendance"
                                        checked={declaration.attendance}
                                        onChange={handleDeclarationChange}
                                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded sm:text-sm"
                                        required
                                    />
                                    <label className="ml-3 text-sm text-gray-700">
                                        I will maintain 75% attendance.
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="feePayment"
                                        checked={declaration.feePayment}
                                        onChange={handleDeclarationChange}
                                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded sm:text-sm"
                                        required
                                    />
                                    <label className="ml-3 text-sm text-gray-700">
                                        I have paid the full semester fee without any backlog.
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <span className="mr-2">Submitting...</span>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    </div>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentRequest; 