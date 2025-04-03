import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateRequestId = () => {
  const date = new Date();
  return `CU${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

const NewRequest = () => {
  const [requestId, setRequestId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    contact: "",
    email: "",
    competitionName: "",
    startDate: "",
    endDate: "",
    prizeMoney: "",
  });
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRequestId(generateRequestId());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const uploadFile = async (file, fieldName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);
    formData.append('requestId', requestId);

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      // Upload files
      const uploadedDocuments = {};
      for (const [fieldName, file] of Object.entries(files)) {
        const path = await uploadFile(file, fieldName);
        if (path) uploadedDocuments[fieldName] = path;
      }

      // Prepare payload
      const payload = {
        requestId: requestId,
        name: formData.name,
        uid: formData.uid,
        contact: formData.contact,
        email: formData.email,
        competitionName: formData.competitionName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        prizeMoney: Number(formData.prizeMoney) || 0,
        status: "Pending",
        documents: uploadedDocuments,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Request submitted successfully! 🎉");

      // Reset form
      setFormData({
        name: "",
        uid: "",
        contact: "",
        email: "",
        competitionName: "",
        startDate: "",
        endDate: "",
        prizeMoney: "",
      });
      setFiles({});
      setRequestId(generateRequestId());
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 text-center mb-4">
          New Reimbursement Request
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Request ID: <span className="font-mono font-semibold">{requestId}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "uid", "contact", "email"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            ))}
          </div>

          {/* Competition Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competition Name
            </label>
            <input
              type="text"
              name="competitionName"
              value={formData.competitionName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Dates and Prize Money */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["startDate", "endDate", "prizeMoney"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "prizeMoney" ? "number" : "date"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required={field !== "prizeMoney"}
                  min={field === "prizeMoney" ? "0" : undefined}
                />
              </div>
            ))}
          </div>

          {/* File Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Documents
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["tickets", "invitationLetter", "certificates", "otherDocuments"].map((doc) => (
                <div key={doc} className="relative">
                  <input
                    type="file"
                    id={doc}
                    name={doc}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor={doc}
                    className="block w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                  >
                    <span className="text-gray-600">
                      {files[doc] ? files[doc].name : `Upload ${doc}`}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NewRequest;