// src/pages/AdminRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { parseJwt } from '../utils/jwt.js';
import { toast } from 'react-toastify';

export default function AdminRoute() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Akses ditolak: Halaman ini hanya untuk admin');
    }
  }, [isAdmin, location.pathname]);

  if (!token || !isAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}