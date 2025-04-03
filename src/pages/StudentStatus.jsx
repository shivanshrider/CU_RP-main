import { useState } from "react";

const StudentStatus = () => {
  const [currentStatus, setCurrentStatus] = useState("Pending");

  // Student Details (Replace with actual data)
  const studentDetails = {
    name: "John Doe",
    rollNumber: "22BCS12345",
    department: "Computer Science",
    course: "B.Tech CSE",
  };

  // Status Steps
  const statusSteps = ["Pending", "Verified", "In Process", "Completed"];

  // Status Colors
  const statusColors = {
    Pending: "bg-yellow-500",
    Verified: "bg-blue-500",
    "In Process": "bg-purple-500",
    Completed: "bg-green-500",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Student Reimbursement Status
      </h1>

      {/* Student Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Details</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Name:</strong> {studentDetails.name}</p>
          <p><strong>Roll No:</strong> {studentDetails.rollNumber}</p>
          <p><strong>Department:</strong> {studentDetails.department}</p>
          <p><strong>Course:</strong> {studentDetails.course}</p>
        </div>
      </div>

      {/* Status Progress Tracker */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-between relative">
          {statusSteps.map((status, index) => (
            <div key={status} className="flex flex-col items-center w-1/4">
              {/* Status Circles */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                  currentStatus === status || statusSteps.indexOf(currentStatus) >= index
                    ? statusColors[status]
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                currentStatus === status || statusSteps.indexOf(currentStatus) >= index
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}>
                {status}
              </span>
            </div>
          ))}

          {/* Connecting Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 z-0"></div>
          <div
            className="absolute top-5 left-0 h-1 bg-red-500 z-10 transition-all"
            style={{ width: `${(statusSteps.indexOf(currentStatus) / (statusSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Button to Simulate Status Change */}
      <button
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-red-700 transition"
        onClick={() => {
          const nextIndex = statusSteps.indexOf(currentStatus) + 1;
          if (nextIndex < statusSteps.length) {
            setCurrentStatus(statusSteps[nextIndex]);
          }
        }}
      >
        Update Status
      </button>
    </div>
  );
};

export default StudentStatus;
