import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center animate-bounce mb-4">
          <Dumbbell className="w-8 h-8 text-brand-red" />
        </div>
        <p className="text-white font-bold text-sm tracking-widest uppercase">Verifying Session...</p>
        <p className="text-gray-400 text-xs mt-1">Checking secure owner permissions</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
