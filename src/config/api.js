const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/api/auth/login`,
        REGISTER: `${API_URL}/api/auth/register`,
        VERIFY_TOKEN: `${API_URL}/api/auth/verify-token`
    },
    REQUESTS: {
        CREATE: `${API_URL}/api/student-requests`,
        GET_ALL: `${API_URL}/api/student-requests/all`,
        GET_BY_STATUS: (status) => `${API_URL}/api/student-requests/status/${status}`,
        GET_BY_CASE: (caseNumber) => `${API_URL}/api/student-requests/${caseNumber}`,
        UPDATE_STATUS: (caseNumber) => `${API_URL}/api/student-requests/${caseNumber}/status`
    }
}; 