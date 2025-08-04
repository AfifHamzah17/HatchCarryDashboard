// src/pages/DashboardLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-white border-r p-4 space-y-2">
        <Link to="map" className="block px-3 py-2 rounded hover:bg-gray-100">
          Peta Hatch & Carry
        </Link>
        <Link to="admin" className="block px-3 py-2 rounded hover:bg-gray-100">
          Admin Panel
        </Link>
      </nav>
      <main className="flex-1 p-4 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}