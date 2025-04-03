import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CompleteRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const fetchCompletedRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/requests?status=Completed', {
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
      console.error("Error fetching completed requests:", error);
      toast.error("Failed to load completed requests");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Completed Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-gray-700 text-sm md:text-base">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 border">S.No.</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">UID</th>
                <th className="p-3 border">Contact</th>
                <th className="p-3 border">Competition</th>
                <th className="p-3 border">Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req, index) => (
                  <tr
                    key={req._id}
                    className="bg-gray-50 hover:bg-gray-100 transition text-center"
                  >
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{req.name}</td>
                    <td className="p-3 border">{req.uid}</td>
                    <td className="p-3 border">{req.contact}</td>
                    <td className="p-3 border">{req.competitionName}</td>
                    <td className="p-3 border">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No Completed Requests Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompleteRequest;