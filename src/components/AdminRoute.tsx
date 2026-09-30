import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-[70vh]" aria-busy="true" />;
  if (!user) return <Navigate to={`/account?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};