import { useState } from "react";
import { NavLink } from "react-router-dom";


const Student = () => {
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your Ticket ID: ${ticketId} is submitted!`);
    setTicketId("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Student Reimbursement Status
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700 text-lg font-medium">
            Enter Your Ticket ID
          </label>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            required
          />

          {/* Submit Button with NavLink */}
          <NavLink to="/studentreimburse-status">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-red-700 transition"
            >
              Submit
            </button>
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Student;
