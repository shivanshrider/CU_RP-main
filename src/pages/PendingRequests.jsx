import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const PendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/requests?status=Pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setRequests(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (request) => {
    setSelectedRequest(request);
    setUpdatedStatus(request.status);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/requests/${selectedRequest._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(`Status updated to ${updatedStatus}`);

      if (updatedStatus === "Completed") {
        setRequests(prevRequests => 
          prevRequests.filter(req => req._id !== selectedRequest._id)
        );
      } else {
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req._id === selectedRequest._id
              ? { ...req, status: updatedStatus }
              : req
          )
        );
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pending Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No pending requests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg border">
            <thead className="bg-red-600 text-white">
              <tr className="text-left">
                <th className="py-3 px-4">S.No.</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">UID</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Competition</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{req.name}</td>
                  <td className="py-3 px-4">{req.uid}</td>
                  <td className="py-3 px-4">{req.contact}</td>
                  <td className="py-3 px-4">{req.competitionName}</td>
                  <td className={`py-3 px-4 font-medium capitalize ${
                    req.status === "Pending" ? "text-yellow-600" :
                    req.status === "Verified" ? "text-blue-600" :
                    req.status === "In Process" ? "text-orange-600" :
                    "text-green-600"}`}
                  >
                    {req.status}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleOpen(req)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                    >
                      <FaEdit /> Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Request Details</h3>
              <button onClick={handleClose} className="text-gray-600 hover:text-red-600">
                <IoMdClose size={24} />
              </button>
            </div>

            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>UID:</strong> {selectedRequest.uid}</p>

            <label className="block text-gray-700 font-medium mb-1">Update Status:</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-red-500"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </select>

            <button onClick={handleUpdate} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4">
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequest;