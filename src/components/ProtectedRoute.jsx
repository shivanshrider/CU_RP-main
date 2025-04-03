import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'Admin') {
        // Redirect to login if not authenticated or not admin
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default ProtectedRoute;