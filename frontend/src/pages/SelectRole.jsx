import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, ShieldCheck } from 'lucide-react';

const ROLES = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap, path: '/student-dashboard' },
  { id: 'COMPANY_MANAGER', label: 'Company Manager', icon: Building2, path: '/company-dashboard' },
  { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, path: '/admin' },
];

export default function SelectRole() {
  const auth = useAuth();
  const navigate = useNavigate();

  const choose = (role) => {
    if (auth && auth.setRole) auth.setRole(role);
    const meta = ROLES.find((r) => r.id === role) || ROLES[0];
    navigate(meta.path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-3xl w-full p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Select your role</h2>
        <p className="text-sm text-gray-500 mb-6">Choose the role you want to continue as.</p>
        <div className="grid grid-cols-3 gap-4">
          {ROLES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => choose(id)} className="flex flex-col items-center gap-2 p-4 border rounded hover:shadow">
              <div className="p-3 rounded-full bg-pink-50"><Icon size={20} className="text-pink-600" /></div>
              <div className="font-semibold">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
