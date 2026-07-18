import { Routes, Route, Navigate } from "react-router-dom";
import Pages from "./index";
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Pages.Login />} />
        <Route path="/signup" element={<Pages.Signup />} />
        <Route path="/select-role" element={<ProtectedRoute><Pages.SelectRole /></ProtectedRoute>} />

        <Route path="/company-dashboard" element={<ProtectedRoute><Pages.CompanyDashboard /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><Pages.StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Pages.AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;