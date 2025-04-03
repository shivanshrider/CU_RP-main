const API_URL = 'http://localhost:5000/api';

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API calls
export const loginUser = (credentials) => 
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const signupUser = (userData) =>
  apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const verifyToken = () =>
  apiCall('/auth/verify-token');

// Requests API calls
export const createRequest = (requestData) =>
  apiCall('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });

export const getRequests = (status) =>
  apiCall(`/requests${status ? `?status=${status}` : ''}`);

export const updateRequest = (requestId, updateData) =>
  apiCall(`/requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });

// File upload
export const uploadFile = async (file, fieldName, requestId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fieldName', fieldName);
  formData.append('requestId', requestId);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
}; 