import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import StudentRequest from './pages/StudentRequest';
import StudentPortal from './pages/StudentPortal';
import CheckStatus from './pages/CheckStatus';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PendingRequests from './pages/PendingRequests';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/student-request" element={<StudentRequest />} />
            <Route path="/check-status" element={<CheckStatus />} />
            <Route path="/pending-requests" element={<PendingRequests />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;