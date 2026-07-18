import { Routes, Route, Navigate } from "react-router-dom";
import Pages from "./index";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student-dashboard" replace />} />

      <Route path="/login" element={<Pages.Login />} />
      <Route path="/signup" element={<Pages.Signup />} />

      <Route path="/company-dashboard" element={<Pages.CompanyDashboard />} />
      <Route path="/student-dashboard" element={<Pages.StudentDashboard />} />
      <Route path="/admin" element={<Pages.AdminDashboard />} />

      <Route path="*" element={<Navigate to="/student-dashboard" replace />} />
    </Routes>
  );
}

export default App;